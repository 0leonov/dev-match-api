import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegistrationData } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(registrationData: RegistrationData) {
    const isEmailTaken = !!(await this.usersRepository.findOne({
      where: { email: registrationData.email },
    }));

    if (isEmailTaken) {
      throw new ConflictException(
        `Email ${registrationData.email} is already taken.`,
      );
    }

    const isUsernameTaken = !!(await this.usersRepository.findOne({
      where: { username: registrationData.username },
    }));

    if (isUsernameTaken) {
      throw new ConflictException(
        `Username ${registrationData.username} is already taken.`,
      );
    }

    const password = await this.hashPassword(registrationData.password);

    const user: User = await this.usersRepository.save({
      ...registrationData,
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
