import { PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { RegisterDto } from '../../auth/dto/register.dto';
import { ApiPropertyRole } from '../decorators/api-property-role.decorator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiPropertyRole()
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
