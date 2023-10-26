import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

import { RegistrationData } from '../../users/interfaces';

export class RegisterDto implements RegistrationData {
  @ApiProperty({
    format: 'email',
    example: 'example@company.com',
  })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @ApiProperty({
    pattern: '/^[a-zA-Z0-9_]+$/',
    minimum: 3,
    maximum: 32,
    example: 'example',
  })
  @MinLength(3, { message: 'Username must be longer than 3 characters.' })
  @MaxLength(32, { message: 'Username must be shorten than 32 characters.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username can only consist of Latin characters, numbers and underscores.',
  })
  username: string;

  @ApiProperty({
    minimum: 6,
    maximum: 255,
    example: '••••••••••',
  })
  @MinLength(6, { message: 'Password must be longer than 6 characters.' })
  @MaxLength(255, { message: 'Password must be shorter than 255 characters.' })
  password: string;

  @ApiProperty({
    minimum: 3,
    maximum: 32,
    example: 'Example Name',
  })
  @MinLength(3, { message: 'Name must be longer than 3 characters.' })
  @MaxLength(32, { message: 'Name must be shorten than 32 characters.' })
  name: string;
}
