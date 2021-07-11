import { User } from 'src/users/user.entity';

export class RefreshSessionDto {
  id?: number;

  user: User;

  refreshToken: string;

  expiresIn: number;

  createdAt: Date;
}
