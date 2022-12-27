import { User } from './../users/entities/user.entity';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.body);
  }

  @Mutation(() => User)
  signup(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.signup(loginUserInput);
  }
}
