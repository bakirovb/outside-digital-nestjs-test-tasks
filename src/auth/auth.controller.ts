import { Response, Request } from 'express';
import { Body, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const res = await this.authService.register(createUserDto);
    response.cookie('refreshToken', res.refreshToken.token, {
      httpOnly: true,
      maxAge: res.refreshToken.expiresIn,
      path: '/auth',
    });
    return {
      token: res.accessToken.token,
      expire: res.accessToken.expiresIn,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(
    @Res({ passthrough: true }) response: Response,
    @Req() request: RequestWithUser,
  ) {
    const res = await this.authService.logIn(request.user);
    response.cookie('refreshToken', res.refreshToken.token, {
      httpOnly: true,
      maxAge: res.refreshToken.expiresIn,
      path: '/auth',
    });
    return {
      token: res.accessToken.token,
      expire: res.accessToken.expiresIn,
    };
  }

  @Post('refresh-tokens')
  async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      request.cookies['refreshToken'],
    );
    response.cookie('refreshToken', tokens.refreshToken.token, {
      httpOnly: true,
      maxAge: tokens.refreshToken.expiresIn,
      path: '/auth',
    });
    return {
      token: tokens.accessToken.token,
      expire: tokens.accessToken.expiresIn,
    };
  }

  @Post('logout')
  async logOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logOut(request['refreshToken']);
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}
