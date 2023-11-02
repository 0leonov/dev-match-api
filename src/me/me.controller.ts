import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { CurrentUser } from '../auth/decorators';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CurrentUserResponse } from '../users/responses';
import { UsersService } from '../users/users.service';

import {
  ApiOperationGetProfile,
  ApiOperationUpdateAvatar,
} from './decorators/swagger';

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

    return plainToClass(CurrentUserResponse, user);
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

    return plainToClass(CurrentUserResponse, user);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @CurrentUser('sub') currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(currentUserId, updateUserDto);

    return plainToClass(CurrentUserResponse, user);
  }
}
