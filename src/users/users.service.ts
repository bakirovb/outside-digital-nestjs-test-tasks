import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';
import { TagNotFoundError } from 'src/tags/exceptions/tag-not-found.error';
import { Tag } from 'src/tags/tag.entity';
import { Connection, EntityNotFoundError, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import {
  FindUserOptions,
  UserRelations,
} from './interfaces/find-user-options.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async getByEmail(email: string, options?: FindUserOptions): Promise<UserDto> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: options?.relations,
    });
  }

  async getById(id: string, options?: FindUserOptions): Promise<UserDto> {
    return await this.usersRepository.findOne({
      where: { uid: id },
      relations: options?.relations,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    let user;
    try {
      user = await this.usersRepository.save(createUserDto);
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
    return user;
  }

  async edit(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      await this.connection
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where('uid = :uid', { uid: id })
        .execute();
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
    return await this.usersRepository.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('uid = :id', { id: id })
      .execute();
  }

  async deleteUserWithLogOut(id: string): Promise<void> {
    await this.delete(id);
  }

  async addTagsToUser(ids: number[], userDto: UserDto) {
    const user = await this.getById(userDto.uid, {
      relations: [UserRelations.Tags],
    });
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
      user.tags = user.tags.concat(...tags);
      await queryRunner.manager.save(user);
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
      await this.getById(userDto.uid, {
        relations: [UserRelations.Tags],
      })
    ).tags;
  }
}
