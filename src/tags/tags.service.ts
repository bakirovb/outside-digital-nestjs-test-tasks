import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toTagWithCreatorDto } from 'src/common/mapper';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagWithCreatorDto } from './dto/tag-wtih-creator.dto';
import { TagDto } from './dto/tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagData: CreateTagDto, userDto: UserDto): Promise<TagDto> {
    const newTag = this.tagsRepository.create({
      ...createTagData,
      creator: userDto,
    });
    try {
      await this.tagsRepository.save(newTag);
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(err?.detail, HttpStatus.BAD_REQUEST);
      } else {
        console.log(err);
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return newTag;
  }

  async getById(id: number): Promise<TagWithCreatorDto> {
    const tag = await this.tagsRepository.findOne(id, {
      relations: ['creator'],
    });
    if (!tag) {
      throw new HttpException(
        `Tag with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return toTagWithCreatorDto(tag);
  }

  async getTags(
    offset = 0,
    length = 10,
    sortByOrder?: boolean,
    SortByName?: boolean,
  ) {
    const [tags, count] = await this.tagsRepository.findAndCount({
      relations: ['creator'],
      skip: offset,
      take: length,
    });
    return {
      data: tags.map((tag) => toTagWithCreatorDto(tag)),
      meta: { offset, length, quantity: count },
    };
  }

  async editTag(
    updateTagDto,
    id: number,
    userDto: UserDto,
  ): Promise<TagWithCreatorDto> {
    const tag = await this.getById(id);
    if (tag.creator.uid != userDto.uid) {
      throw new HttpException(
        `You don't have permission to change this tag.`,
        HttpStatus.FORBIDDEN,
      );
    }
    let res;
    try {
      res = await this.tagsRepository.update(id, updateTagDto);
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(err?.detail, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    console.log(res);
    return await this.getById(id);
  }
}
