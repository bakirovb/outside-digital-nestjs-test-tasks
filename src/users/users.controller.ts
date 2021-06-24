import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRelations } from './interfaces/find-user-options.interface';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async getProfile(@Request() req: RequestWithUser) {
    const user = await this.usersService.getById(req.user.uid, {
      relations: [UserRelations.CreatedTags],
    });
    return { email: user.email, nickname: user.nickname, tags: user.tags };
  }

  @Put('')
  async editProfile(@Request() request: RequestWithUser) {
    const user = await this.usersService.edit(request.user.uid, request.body);
    return { email: user.email, nickname: user.nickname };
  }

  @Delete('')
  async delete(@Request() request: RequestWithUser) {
    await this.usersService.delete(request.user.uid);
  }
}
