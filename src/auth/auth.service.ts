import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpInput } from './dto/signup-input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: any = await this.usersService.getUserByUsername(username);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user?.password);
    if (!valid) return null;

    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const { password, ...result } = user;
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user: result,
    };
  }

  async signup(signUpInput: SignUpInput) {
    const user: User | null = await this.usersService.getUserByUsername(
      signUpInput.username,
    );

    if (user) {
      throw new Error('User already exists!');
    }

    const password = await bcrypt.hash(signUpInput.password, 10);

    const { accessToken, refreshToken } = await this.createTokens(user.id);

    return this.usersService.createUser({
      ...signUpInput,
      password,
    });
  }

  async createTokens(userId: number) {
    const accessToken = this.jwtService.sign(
      {
        userId,
      },
      { expiresIn: '10s', secret: process.env.ACCESS_TOKEN_SECRET },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        accessToken,
      },
      { expiresIn: '7d', secret: process.env.ACCESS_TOKEN_SECRET },
    );
    return { accessToken, refreshToken };
  }
}
