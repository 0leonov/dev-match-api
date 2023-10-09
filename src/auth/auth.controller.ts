import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUserResponse } from '../users/responses/current-user.response';

import { AuthService } from './auth.service';
import { Cookie, Public } from './decorators';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './entities/refresh-token.entity';

const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.authService.login(loginDto);

    this.returnUser(user, refreshToken, accessToken, res);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.authService.register(createUserDto);

    this.returnUser(user, refreshToken, accessToken, res);
  }

  @Post('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME)
    oldRefreshToken: string,
    @Res() res: Response,
  ) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } =
      await this.authService.refresh(oldRefreshToken);

    this.setRefreshToken(refreshToken, res);

    res.status(200).json({ accessToken });
  }

  @Post('logout')
  async logout(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME)
    refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      throw new BadRequestException('Missing token in request cookies.');
    }

    await this.authService.logout(refreshToken);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(),
      secure: true,
      path: '/',
    });

    res.sendStatus(HttpStatus.OK);
  }

  private setRefreshToken(refreshToken: RefreshToken, res: Response) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: refreshToken.expiresIn,
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
  }

  private returnUser(
    user: User,
    refreshToken: RefreshToken,
    accessToken: string,
    res: Response,
  ) {
    this.setRefreshToken(refreshToken, res);

    res
      .status(200)
      .json({ accessToken, user: plainToClass(CurrentUserResponse, user) });
  }
}
