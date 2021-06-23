import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';

export class RefreshSessionDto {
  @IsNotEmpty()
  id?: number;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  expiresIn: number;

  @IsNotEmpty()
  createdAt: Date;
}
