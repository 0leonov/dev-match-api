import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthGuard } from './common/guards';
import { CloudinaryService } from './common/providers';
import { typeOrmModuleOptions } from './config/typeOrmModuleOptions';
import { AuthModule } from './modules/auth/auth.module';
import { MeModule } from './modules/me/me.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmModuleOptions,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MeModule,
  ],
  providers: [
    CloudinaryService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
