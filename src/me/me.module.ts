import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [UsersModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
