import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email ir required.' })
  email: string;

  @IsNotEmpty({ message: 'Password ir required.' })
  password: string;
}
