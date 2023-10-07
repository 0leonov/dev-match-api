import {
  Body,
  Controller,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';

@Controller('me')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@CurrentUser('sub') currentUserId: string) {
    const user = await this.usersService.findOne(currentUserId);
    user.password = undefined;

    return user;
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @CurrentUser('sub') currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(currentUserId, updateUserDto);
    user.password = undefined;

    return user;
  }
}
