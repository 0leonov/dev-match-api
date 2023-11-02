import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';

import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [UsersModule, CloudinaryModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
