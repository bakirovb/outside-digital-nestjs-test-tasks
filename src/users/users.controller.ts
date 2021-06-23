import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRelations } from './interfaces/find-user-options.interface';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/user')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.uid, {
      relations: [UserRelations.Tags],
    });
    return { email: user.email, nickname: user.nickname, tags: user.tags };
  }

  @Put('/user')
  async editProfile(@Request() req) {
    const user = await this.usersService.edit(req.user.uid, req.body);
    return { email: user.email, nickname: user.nickname };
  }
}
