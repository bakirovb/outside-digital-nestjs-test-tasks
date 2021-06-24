import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';
import { ITagDto } from '../interfaces/tag-dto.interface';

export class TagWithCreatorDto implements ITagDto {
  @Exclude()
  id: number;

  name: string;

  sortOrder: number;

  @Transform(({ value }) => {
    return {
      uid: value.uid,
      nickname: value.nickname,
    };
  })
  creator: UserDto;

  constructor(partial: Partial<TagWithCreatorDto>) {
    Object.assign(this, partial);
  }
}
