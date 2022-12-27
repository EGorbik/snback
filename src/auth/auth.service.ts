import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  async signup(loginUserInput: LoginUserInput) {
    const user: User | null = await this.usersService.getUserByUsername(
      loginUserInput.username,
    );

    if (user) {
      throw new Error('User already exists!');
    }

    const password = await bcrypt.hash(loginUserInput.password, 10);

    return this.usersService.createUser({
      ...loginUserInput,
      password,
    });
  }
}
