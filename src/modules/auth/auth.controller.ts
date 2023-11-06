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
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

import { FullUserDto } from '../../common/dto';
import { UserEntity } from '../../models/entities';
import { RefreshToken } from '../../models/entities';

import { AuthService } from './auth.service';
import {
  ApiOperationLogin,
  ApiOperationLogout,
  ApiOperationRefresh,
  ApiOperationRegister,
  Cookie,
  Public,
} from './decorators';
import { LoginDto, RegisterDto } from './dto';

const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperationLogin()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.authService.login(loginDto);

    this.returnUser(user, refreshToken, accessToken, res);
  }

  @ApiOperationRegister()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: RegisterDto, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.authService.register(createUserDto);

    this.returnUser(user, refreshToken, accessToken, res);
  }

  @ApiOperationRefresh()
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

  @ApiOperationLogout()
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

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

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
    user: UserEntity,
    refreshToken: RefreshToken,
    accessToken: string,
    res: Response,
  ) {
    this.setRefreshToken(refreshToken, res);

    const fullUserDto = plainToClass(FullUserDto, user);

    res.status(200).json({ accessToken, user: fullUserDto });
  }
}
