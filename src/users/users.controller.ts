import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { Public, Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards/role.guard';

import {
  ApiOperationDelete,
  ApiOperationFindAll,
  ApiOperationFindOne,
  ApiOperationUpdate,
} from './decorators/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums';
import { UserResponse } from './responses';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperationFindAll()
  @Get()
  @Public()
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => plainToClass(UserResponse, user));
  }

  @ApiOperationFindOne()
  @Get(':username')
  @Public()
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);

    return plainToClass(UserResponse, user);
  }

  @ApiOperationUpdate()
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.update(id, updateUserDto);

    return plainToClass(UserResponse, user);
  }

  @ApiOperationDelete()
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.remove(id);

    return plainToClass(UserResponse, user);
  }
}
