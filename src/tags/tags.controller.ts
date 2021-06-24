import { Request } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagsService } from './tags.service';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagParams } from './utils/get-tag-params';
import { responseTags } from './dto/response-tags';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Put('')
  async create(
    @Body() createTagDto: CreateTagDto,
    @Req() request: RequestWithUser,
  ) {
    const createdTag = await this.tagsService.create(
      createTagDto,
      request.user,
    );
    return { name: createdTag.name, sortOrder: createdTag.sortOrder };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getTag(@Param() { id }: GetTagParams) {
    const tag = await this.tagsService.getById(+id);
    return tag;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getTags(@Query() { offset, length }) {
    const { data, meta } = await this.tagsService.getTags(offset, length);
    return new responseTags({ data, meta });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  async editTag(
    @Body() updateTagDto,
    @Param() { id },
    @Req() request: RequestWithUser,
  ) {
    const res = await this.tagsService.editTag(updateTagDto, id, request.user);
    return res;
  }
}
