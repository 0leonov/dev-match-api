import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { MeController } from './me.controller';

@Module({
  imports: [UsersModule],
  controllers: [MeController],
})
export class MeModule {}
