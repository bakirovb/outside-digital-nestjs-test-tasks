import { Type } from 'class-transformer';
import { TagsMeta } from '../interfaces/tags-meta.inteface';
import { TagWithCreatorDto } from './tag-wtih-creator.dto';

export class responseTags {
  @Type(() => TagWithCreatorDto)
  data: TagWithCreatorDto[];

  meta: TagsMeta;

  constructor(partial: Partial<responseTags>) {
    Object.assign(this, partial);
  }
}
