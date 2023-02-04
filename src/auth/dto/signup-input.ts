import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
