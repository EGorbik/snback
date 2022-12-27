import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class LoginUserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
