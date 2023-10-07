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
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';

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
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return new UserResponse(user);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserResponse(user));
  }

  @Get(':username')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);

    return new UserResponse(user);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return new UserResponse(user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.usersService.remove(id, currentUser);
  }
}
