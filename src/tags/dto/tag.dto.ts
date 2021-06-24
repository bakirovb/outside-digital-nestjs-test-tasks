import { UserDto } from 'src/users/dto/user.dto';
import { ITagDto } from '../interfaces/tag-dto.interface';

export class TagDto implements ITagDto {
  id: number;

  name: string;

  sortOrder: number;

  constructor(partial: Partial<TagDto>) {
    Object.assign(this, partial);
  }
}
