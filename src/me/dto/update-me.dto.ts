import { PartialType } from '@nestjs/swagger';

import { RegisterDto } from '../../auth/dto/register.dto';

export class UpdateMe extends PartialType(RegisterDto) {}
