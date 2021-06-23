import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, ConnectionIsNotSetError, Repository } from 'typeorm';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { RefreshSession } from './refresh-session.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/users/dto/user.dto';
import { refreshSessionConstants } from './constants';

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private refreshSessionsRepository: Repository<RefreshSession>,
    private connection: Connection,
  ) {}

  async deleteSessionsIfSuspiciousActivity(userDto: UserDto): Promise<void> {
    const count = await this.findUserSessionCount(userDto.uid);
    if (count >= refreshSessionConstants.userSessionCount) {
      await this.deleteUserSessions(userDto.uid);
    }
  }

  async checkRefreshSession(refreshToken: string): Promise<RefreshSessionDto> {
    const refreshSession = await this.findByRefreshToken(refreshToken);
    if (!refreshSession) {
      throw new HttpException(
        'Authorization token not verified',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expirationDate =
      +refreshSession.createdAt + refreshSession.expiresIn * 1000;
    if (expirationDate < Date.now()) {
      throw new HttpException(
        'The refresh token has expired, need to log in',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return refreshSession;
  }

  async findByRefreshToken(refreshToken: string) {
    return await this.refreshSessionsRepository.findOne({
      where: { refreshToken: refreshToken },
    });
  }

  async findUserSessionCount(userId: string): Promise<number> {
    const result = await this.connection
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(RefreshSession, 'refresh_session')
      .where('user_uid = :id', { id: userId })
      .getRawOne();
    return result.count;
  }

  async create(userId, expiresIn) {
    const refreshSession = new RefreshSession();
    refreshSession.user = userId;
    refreshSession.expiresIn = expiresIn;
    refreshSession.refreshToken = uuidv4();
    let savedRefreshSession;
    try {
      savedRefreshSession = await this.refreshSessionsRepository.save(
        refreshSession,
      );
    } catch (err) {
      if (err) {
        throw err;
      }
    }
    return savedRefreshSession;
  }

  async delete(id: number): Promise<void> {
    await this.refreshSessionsRepository.delete(id);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(RefreshSession)
      .where('user_uid = :id', { id: userId })
      .execute();
  }
}
