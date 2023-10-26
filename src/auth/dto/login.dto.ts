import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'example@company.com',
  })
  @IsNotEmpty({ message: 'Email ir required.' })
  email: string;

  @ApiProperty({
    example: '••••••••••',
  })
  @ApiProperty()
  @IsNotEmpty({ message: 'Password ir required.' })
  password: string;
}
