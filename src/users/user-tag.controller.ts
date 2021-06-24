import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTagService } from './user-tag.servise';

@UseGuards(JwtAuthGuard)
@Controller('user/tag')
export class UserTagController {
  constructor(private userTagService: UserTagService) {}
  @Post('')
  async addTagsToUser(@Body() data, @Request() request: RequestWithUser) {
    return this.userTagService.addTagsToUser(data.tags, request.user);
  }

  @Get('my')
  async getUserTags(@Request() request: RequestWithUser) {
    return this.userTagService.getUserTags(request.user);
  }

  @Delete(':id')
  async deleteUserTag(@Param() { id }, @Request() request: RequestWithUser) {
    return this.userTagService.deleteUserTag2(id, request.user);
  }
}
