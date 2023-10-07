import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { JwtPayload } from '../auth/interfaces';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user-role.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found.`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found.`);
    }

    if (
      updateUserDto.email &&
      (await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      }))
    ) {
      throw new ConflictException(
        `Email ${updateUserDto.email} is already taken.`,
      );
    }

    if (
      updateUserDto.username &&
      (await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      }))
    ) {
      throw new ConflictException(
        `Username ${updateUserDto.username} is already taken.`,
      );
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

  async remove(id: string, currentUser: JwtPayload) {
    if (!currentUser.roles.includes(UserRole.ADMIN) && id !== currentUser.sub) {
      throw new ForbiddenException();
    }

    const deleteResult = await this.usersRepository.delete({ id });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User id ${id} not found.`);
    }

    return { message: `User id ${id} has been deleted.` };
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
