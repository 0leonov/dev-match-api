import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: { ...user } };
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail(loginDto.email);

      await this.validatePassword(loginDto.password, user.password);

      const tokens = await this.generateTokens(user);
      return { ...tokens, user: { ...user } };
    } catch (NotFoundException) {
      throw new UnauthorizedException('Incorrect email or password.');
    }
  }

  async logout(token: string) {
    const deleteResult = await this.refreshTokensRepository.delete({ token });

    if (deleteResult.affected === 0) {
      throw new NotFoundException();
    }
  }

  async refresh(refreshToken: string) {
    const token = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.refreshTokensRepository.delete({ token: refreshToken });

    if (token.expiresIn < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(token.userId);

    return this.generateTokens(user);
  }

  private async generateRefreshToken(userId: string) {
    const today = moment();
    const expiresIn = moment(today)
      .add(this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS', 30), 'days')
      .toDate();

    const refreshToken: RefreshToken = await this.refreshTokensRepository.save({
      userId,
      token: v4(),
      expiresIn,
    });

    return refreshToken;
  }

  private async generateAccessToken(user: User) {
    const payload = { sub: user.id, roles: user.roles };

    const accessToken = await this.jwtService.signAsync(payload);

    return `Bearer ${accessToken}`;
  }

  private async generateTokens(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validatePassword(
    enteredPassword: string,
    userPassword: string,
  ): Promise<void> {
    const isPasswordMatches = await bcrypt.compare(
      enteredPassword,
      userPassword,
    );

    if (!isPasswordMatches) {
      throw new UnauthorizedException('Incorrect email or password.');
    }
  }
}
