import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    const isEmailTaken = !!(await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    }));

    if (isEmailTaken) {
      throw new ConflictException(
        `Email ${createUserDto.email} is already taken.`,
      );
    }

    const isUsernameTaken = !!(await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    }));

    if (isUsernameTaken) {
      throw new ConflictException(
        `Username ${createUserDto.username} is already taken.`,
      );
    }

    const password = await this.hashPassword(createUserDto.password);

    const user: User = await this.usersRepository.save({
      ...createUserDto,
      password,
    });

    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User id #${id} not found.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User id #${id} not found.`);
    }

    const password = updateUserDto.password
      ? await this.hashPassword(updateUserDto.password)
      : user.password;

    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
      password,
    });
  }

  async remove(id: number) {
    const user = await this.usersRepository.delete({ id });

    if (user.affected === 0) {
      throw new NotFoundException(`User id #${id} not found.`);
    }

    return { message: `User id #${id} has been deleted.` };
  }
}
