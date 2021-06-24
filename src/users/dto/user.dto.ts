import { Allow, IsEmail, IsNotEmpty } from 'class-validator';
import { RefreshSession } from 'src/auth/refresh-session.entity';
import { Tag } from 'src/tags/tag.entity';

export class UserDto {
  @Allow()
  uid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password?: string;

  createdTags?: Tag[];

  @Allow()
  tags?: Tag[];

  @Allow()
  refreshSessions?: RefreshSession[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
