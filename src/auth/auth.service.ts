import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import {
  bcryptConstants,
  jwtConstants,
  refreshSessionConstants,
} from './constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { RefreshSessionService } from './refresh-session.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private refreshSessionService: RefreshSessionService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto> {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  async register(createUserDto: CreateUserDto): Promise<LoginStatus> {
    const hash = await bcrypt.hash(
      createUserDto.password,
      bcryptConstants.saltRounds,
    );
    createUserDto = { ...createUserDto, password: hash };
    const user = await this.usersService.create(createUserDto);
    return await this.logIn(user);
  }

  async logIn(userDto: UserDto): Promise<LoginStatus> {
    await this.refreshSessionService.deleteSessionsIfSuspiciousActivity(
      userDto,
    );
    const payload = {
      sub: userDto.uid,
      nickname: userDto.nickname,
    };
    return this.createTokens(payload);
  }

  async logOut(refreshToken: string) {
    await this.refreshSessionService.deleteByRefreshToken(refreshToken);
  }

  async abortAllUserSessions(userId: string) {
    await this.refreshSessionService.deleteAllUserSessions(userId);
  }

  async refreshTokens(refreshToken: string) {
    const refreshSession = await this.refreshSessionService.checkRelevance(
      refreshToken,
    );
    const user = refreshSession.user;
    const payload = {
      sub: user.uid,
      nickname: user.nickname,
    };
    await this.refreshSessionService.delete(refreshSession.id);
    return this.createTokens(payload);
  }

  async createTokens(payload: JwtPayload) {
    const refreshSessionData = {
      user: payload.sub,
      expiresIn: refreshSessionConstants.expiresIn,
    };
    const createdRefreshSession = await this.refreshSessionService.create(
      refreshSessionData,
    );
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: {
        token: accessToken,
        expiresIn: jwtConstants.expiresIn,
      },
      refreshToken: {
        token: createdRefreshSession.refreshToken,
        expiresIn: createdRefreshSession.expiresIn,
      },
    };
  }

  async getUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.getById(payload.sub);
    const { password, ...result } = user;
    return result;
  }

  getCookiesForLogOut() {
    return ['refreshToken=; HttpOnly; Path=/; Max-Age=0'];
  }
}
