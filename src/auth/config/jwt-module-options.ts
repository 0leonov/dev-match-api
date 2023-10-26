import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtModuleOptions = (
  configService: ConfigService,
): JwtModuleOptions => {
  return {
    secret: configService.get('ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN', '60s'),
    },
  };
};
