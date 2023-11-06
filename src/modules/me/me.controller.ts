import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { CurrentUser } from '../../common/decorators';
import { FullUserDto } from '../../common/dto';
import { UpdateUserDto } from '../../common/dto';
import { CloudinaryService } from '../../common/providers';
import { UsersService } from '../users/users.service';

import {
  ApiOperationGetProfile,
  ApiOperationUpdateAvatar,
  ApiOperationUpdateMe,
} from './decorators';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperationGetProfile()
  @Get()
  async getProfile(@CurrentUser('sub') currentUserId: string) {
    const user = await this.usersService.findOne(currentUserId);

    return plainToClass(FullUserDto, user);
  }

  @ApiOperationUpdateAvatar()
  @Put('avatar')
  @UseInterceptors(FileInterceptor('image'))
  async updateAvatar(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser('sub') currentUserId: string,
  ) {
    const { url } = await this.cloudinaryService.upload(image, {
      folder: 'avatars',
      filename_override: currentUserId,
      use_filename: true,
      unique_filename: false,
    });

    const user = await this.usersService.updateAvatar(currentUserId, url);

    return plainToClass(FullUserDto, user);
  }

  @ApiOperationUpdateMe()
  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @CurrentUser('sub') currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    delete updateUserDto.roles;

    const user = await this.usersService.update(currentUserId, updateUserDto);

    return plainToClass(FullUserDto, user);
  }
}
