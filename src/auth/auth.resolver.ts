import { User } from './../users/entities/user.entity';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { SignResponse } from './dto/sign-response';
import { SignUpInput } from './dto/signup-input';

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

  @Mutation(() => SignResponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signup(signUpInput);
  }
}
