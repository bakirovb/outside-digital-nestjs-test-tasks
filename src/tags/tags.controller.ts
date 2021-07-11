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
import { ApiTags } from '@nestjs/swagger';
import { paginatedDto } from 'src/common/dto/paginated.dto';
import { TagWithCreatorDto } from './dto/tag-wtih-creator.dto';

@ApiTags('tag')
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
  async getTags(@Query() { offset, length, sortByOrder, sortByName }) {
    if (typeof sortByOrder === 'undefined') {
      sortByOrder = false;
    } else {
      sortByOrder = true;
    }
    if (typeof sortByName === 'undefined') {
      sortByName = false;
    } else {
      sortByName = true;
    }
    const { data, meta } = await this.tagsService.getTags(
      offset,
      length,
      sortByOrder,
      sortByName,
    );
    return new paginatedDto<TagWithCreatorDto>({ data, meta });
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
