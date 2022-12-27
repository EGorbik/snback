import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    return await this.userRepository.save({ ...createUserInput });
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    await this.userRepository.update(
      { id: updateUserInput.id },
      { ...updateUserInput },
    );
    return await this.getOneUser(updateUserInput.id);
  }

  async removeUser(id: number): Promise<number> {
    await this.userRepository.delete({ id });
    return id;
  }

  async getOneUser(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getAllUsers(searchText = '', take = 10, skip = 0): Promise<User[]> {
    const query = searchText
      ? {
          where: { username: ILike('%' + searchText + '%') },
        }
      : {};

    const [total, list] = await this.userRepository.findAndCount({
      ...query,
      take,
      skip,
      order: { username: 'DESC' },
    });
    return total;
    // return {
    //   total,
    //   list,
    // } as any;
  }
}
