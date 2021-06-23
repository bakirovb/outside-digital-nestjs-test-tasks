import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { FindUserOptions } from './interfaces/find-user-options.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async findByEmail(
    email: string,
    options?: FindUserOptions,
  ): Promise<UserDto> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: options?.relations,
    });
  }

  async findById(id: string, options?: FindUserOptions): Promise<UserDto> {
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
      if (err.code === '23505') {
        throw new HttpException(err.detail, HttpStatus.CONFLICT);
      } else throw err;
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
      if (err.code === '23505') {
        throw new HttpException(err.detail, HttpStatus.CONFLICT);
      } else throw err;
    }
    return await this.usersRepository.findOne(id);
  }
}
