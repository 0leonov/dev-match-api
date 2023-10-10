import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT', 3000));
}

bootstrap().then();
