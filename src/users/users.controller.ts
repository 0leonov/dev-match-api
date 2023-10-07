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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { CurrentUser, Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtPayload } from '../auth/interfaces';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user-role.enum';
import { UserResponse } from './responses';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser('roles') currentUserRoles: string) {
    const users = await this.usersService.findAll();

    return currentUserRoles.includes(UserRole.ADMIN)
      ? users
      : users.map((user) => new UserResponse(user));
  }

  @Get(':idOrUsername')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('idOrUsername') idOrUsername: string,
    @CurrentUser('roles') currentUserRoles: string,
  ) {
    const user = isUUID(idOrUsername, 4)
      ? await this.usersService.findOne(idOrUsername)
      : await this.usersService.findOneByUsername(idOrUsername);

    return currentUserRoles.includes(UserRole.ADMIN)
      ? user
      : new UserResponse(user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
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
