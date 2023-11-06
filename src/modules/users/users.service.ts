import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RegisterDto } from '../../common/dto';
import { UpdateUserDto } from '../../common/dto';
import { UserEntity } from '../../models/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(registerDto: RegisterDto) {
    const isEmailTaken = !!(await this.usersRepository.findOne({
      where: { email: registerDto.email },
    }));

    if (isEmailTaken) {
      throw new ConflictException(
        `Email ${registerDto.email} is already taken.`,
      );
    }

    const isUsernameTaken = !!(await this.usersRepository.findOne({
      where: { username: registerDto.username },
    }));

    if (isUsernameTaken) {
      throw new ConflictException(
        `Username ${registerDto.username} is already taken.`,
      );
    }

    const password = await this.hashPassword(registerDto.password);

    const user: UserEntity = await this.usersRepository.save({
      ...registerDto,
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

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
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
      updateUserDto?.email &&
      updateUserDto.email != user.email &&
      (await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      }))
    ) {
      throw new ConflictException(
        `Email ${updateUserDto.email} is already taken.`,
      );
    }

    if (
      updateUserDto?.username &&
      updateUserDto.username != user.username &&
      (await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      }))
    ) {
      throw new ConflictException(
        `Username ${updateUserDto.username} is already taken.`,
      );
    }

    const password = updateUserDto?.password
      ? await this.hashPassword(updateUserDto.password)
      : user.password;

    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
      password,
    });
  }

  async updateAvatar(id: string, avatar_url: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found.`);
    }

    return this.usersRepository.save({
      ...user,
      avatar_url,
    });
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found.`);
    }

    await this.usersRepository.delete({ id });

    return user;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
