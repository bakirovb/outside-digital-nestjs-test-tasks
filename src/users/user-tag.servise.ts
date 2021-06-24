import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
import { TagNotFoundError } from 'src/tags/exceptions/tag-not-found.error';
import { Tag } from 'src/tags/tag.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UserRelations } from 'src/users/interfaces/find-user-options.interface';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserTagService {
  constructor(
    private connection: Connection,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async addTagsToUser(ids: number[], userDto: UserDto) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tags = await Promise.all(
        ids.map(async (id) => {
          const tag = await queryRunner.manager.findOne(Tag, id);
          if (!tag) throw new TagNotFoundError(id);
          return tag;
        }),
      );
      await queryRunner.manager
        .createQueryBuilder()
        .relation(User, 'tags')
        .of(userDto.uid)
        .add(tags);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof TagNotFoundError) {
        throw new HttpException(
          `Tag with id ${err.criteria} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      await queryRunner.release();
    }
    return (
      await this.usersService.getById(userDto.uid, {
        relations: [UserRelations.Tags],
      })
    ).tags;
  }

  async getUserTags(userDto: UserDto) {
    const user = await this.usersService.getById(userDto.uid, {
      relations: [UserRelations.Tags],
    });
    return user.tags;
  }

  async deleteUserTag(id: number, userDto: UserDto) {
    const user = await this.usersService.getById(userDto.uid, {
      relations: [UserRelations.Tags],
    });
    for (let i = 0; i < user.tags.length; i++) {
      if (user.tags[i].id == id) {
        user.tags.splice(i, 1);
      }
    }
    this.usersRepository.save(user);
    return user.tags;
  }

  async deleteUserTag2(id: number, userDto: UserDto) {
    await this.connection
      .createQueryBuilder()
      .relation(User, 'tags')
      .of(userDto.uid)
      .remove(id);
    const user = await this.usersService.getById(userDto.uid, {
      relations: [UserRelations.Tags],
    });
    return user.tags;
  }
}
