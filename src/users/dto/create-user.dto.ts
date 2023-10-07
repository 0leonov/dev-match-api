import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @MinLength(3, { message: 'Username must be longer than 3 characters.' })
  @MaxLength(32, { message: 'Username must be shorten than 32 characters.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username can only consist of Latin characters, numbers and underscores.',
  })
  username: string;

  @MinLength(6, { message: 'Password must be longer than 6 characters.' })
  @MaxLength(255, { message: 'Password must be shorter than 255 characters.' })
  password: string;

  @MinLength(3, { message: 'Name must be longer than 3 characters.' })
  @MaxLength(32, { message: 'Name must be shorten than 32 characters.' })
  name: string;
}
