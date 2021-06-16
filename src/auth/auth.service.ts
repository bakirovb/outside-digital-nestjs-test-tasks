import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Connection, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      nickname: user.nickname,
      email: user.email,
      sub: user.uid,
    };
    return {
      access_token: this.jwtService.sign(payload),
      expire: jwtConstants.expire,
    };
  }

  async create(user: User) {
    let saved_user;
    try {
      saved_user = await this.usersRepository.save(user);
    } catch (err) {
      if (err.name === 'QueryFailedError') {
        throw new HttpException(err.detail, HttpStatus.CONFLICT);
      }
    }
    const payload = {
      nickname: saved_user.nickname,
      email: saved_user.email,
      sub: saved_user.uid,
    };
    return {
      access_token: this.jwtService.sign(payload),
      expire: jwtConstants.expire,
    };
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async editByPayload(payload: any) {
    await this.connection
      .createQueryBuilder()
      .update(User)
      .set({ nickname: payload.nickname })
      .where('uid = :uid', { uid: payload.sub })
      .execute();
  }

  async findByPayload(payload: any) {
    return this.usersRepository.findOne({ where: { uid: payload.uid } });
  }
}
