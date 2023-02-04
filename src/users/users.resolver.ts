import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUser') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUser') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.updateUser(updateUserInput);
  }

  @Mutation(() => Number)
  async removeUser(@Args('id') id: number): Promise<number> {
    return await this.usersService.removeUser(id);
  }

  @Query(() => User)
  async getOneUser(@Args('id') id: number): Promise<User> {
    return await this.usersService.getOneUser(id);
  }

  @Query(() => [User])
  async getAllUsers(
    @Args('searchText', { nullable: true, type: () => String })
    searchText: string,
    @Args('take', { type: () => Int, nullable: true }) take = 10,
    @Args('skip', { type: () => Int, nullable: true }) skip = 1,
  ) {
    return this.usersService.getAllUsers(searchText, take, skip);
  }
}
