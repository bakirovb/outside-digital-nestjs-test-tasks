import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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
    const count = await this.getUserSessionCount(userDto.uid);
    if (count >= refreshSessionConstants.userSessionCount) {
      await this.deleteAllUserSessions(userDto.uid);
    }
  }

  async checkRelevance(refreshToken: string): Promise<RefreshSessionDto> {
    const refreshSession = await this.getByRefreshToken(refreshToken);
    if (!refreshSession) {
      throw new HttpException(
        'Authorization token not verified',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expirationDate = +refreshSession.createdAt + refreshSession.expiresIn;
    if (expirationDate < Date.now()) {
      throw new HttpException(
        'The refresh token has expired, need to log in',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return refreshSession;
  }

  async getByRefreshToken(refreshToken: string) {
    return await this.refreshSessionsRepository.findOne({
      where: { refreshToken: refreshToken },
    });
  }

  async getUserSessionCount(userId: string): Promise<number> {
    const result = await this.connection
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(RefreshSession, 'refresh_session')
      .where('refresh_session.userUid = :id', { id: userId })
      .getRawOne();
    return result.count;
  }

  async create(refreshSessionData): Promise<RefreshSession> {
    const refreshToken = uuidv4();
    const newRefreshSession: RefreshSession =
      this.refreshSessionsRepository.create({
        ...refreshSessionData,
        refreshToken,
      }) as unknown as RefreshSession;
    await this.refreshSessionsRepository.save(newRefreshSession);
    return newRefreshSession;
  }

  async delete(id: number): Promise<void> {
    await this.refreshSessionsRepository.delete(id);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(RefreshSession)
      .where('user_uid = :id', { id: userId })
      .execute();
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshSessionsRepository.delete({ refreshToken });
  }
}
