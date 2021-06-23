import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { bcryptConstants, jwtConstants } from './constants';
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
    private usersService: UsersService,
    private refreshSessionService: RefreshSessionService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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

  async refreshTokens(refreshToken: string) {
    const refreshSession = await this.refreshSessionService.checkRefreshSession(
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

  async createTokens(payload) {
    const refreshSession = await this.refreshSessionService.create(
      payload.sub,
      jwtConstants.expiresIn,
    );
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: {
        token: accessToken,
        expiresIn: jwtConstants.expiresIn,
      },
      refreshToken: {
        token: refreshSession.refreshToken,
        expiresIn: refreshSession.expiresIn,
      },
    };
  }

  async getUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findById(payload.sub);
    const { password, ...result } = user;
    return result;
  }
}
