import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, MaxLength } from 'class-validator';

import {
  ApiPropertyGender,
  ApiPropertyInterests,
  ApiPropertyRole,
} from '../decorators';
import { Gender, Interest, Role } from '../enums';

import { RegisterDto } from './index';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({
    required: false,
    maximum: 32,
    example: 'Example Name',
  })
  @IsOptional()
  @MaxLength(255, { message: 'Biography must be shorten than 255 characters.' })
  biography: string;

  @ApiPropertyGender()
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyInterests()
  @IsOptional()
  @IsArray()
  @IsEnum(Interest, { each: true })
  interests: Interest[];

  @ApiPropertyRole()
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
