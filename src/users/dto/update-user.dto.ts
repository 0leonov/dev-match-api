import { PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { RegisterDto } from '../../auth/dto/register.dto';
import { ApiPropertyRole } from '../decorators/swagger';
import { Role } from '../enums';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiPropertyRole()
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
