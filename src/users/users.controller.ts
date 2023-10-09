import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isUUID } from 'class-validator';

import { CurrentUser, Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtPayload } from '../auth/interfaces';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user-role.enum';
import { UserResponse } from './responses';
import { CurrentUserResponse } from './responses/current-user.response';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('sub') currentUserId: string) {
    const user = await this.usersService.findOne(currentUserId);

    return plainToClass(CurrentUserResponse, user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return plainToClass(CurrentUserResponse, user);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => plainToClass(UserResponse, user));
  }

  @Get(':idOrUsername')
  async findOne(@Param('idOrUsername') idOrUsername: string) {
    const user = isUUID(idOrUsername, 4)
      ? await this.usersService.findOne(idOrUsername)
      : await this.usersService.findOneByUsername(idOrUsername);

    return plainToClass(UserResponse, user);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.update(id, currentUser, updateUserDto);

    return plainToClass(UserResponse, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.usersService.remove(id, currentUser);
  }
}
