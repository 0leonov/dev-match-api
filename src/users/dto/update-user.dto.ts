import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { UserRole } from '../entities/user-role.enum';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional() // Make roles optional, use this decorator if it's not always required
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
