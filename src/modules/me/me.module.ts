import { Module } from '@nestjs/common';

import { CloudinaryService } from '../../common/providers';
import { UsersModule } from '../users/users.module';

import { MeController } from './me.controller';

@Module({
  imports: [UsersModule],
  controllers: [MeController],
  providers: [CloudinaryService],
})
export class MeModule {}
