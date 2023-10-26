import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { CurrentUser } from '../auth/decorators';
import { CurrentUserResponse } from '../users/responses';
import { UsersService } from '../users/users.service';

import { ApiOperationGetProfile } from './decorators';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperationGetProfile()
  @Get()
  async getProfile(@CurrentUser('sub') currentUserId: string) {
    const user = await this.usersService.findOne(currentUserId);

    return plainToClass(CurrentUserResponse, user);
  }
}
