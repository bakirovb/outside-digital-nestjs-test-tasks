import { TagWithCreatorDto } from 'src/tags/dto/tag-wtih-creator.dto';
import { TagDto } from 'src/tags/dto/tag.dto';
import { Tag } from 'src/tags/tag.entity';

export const toTagDto = (data: Tag): TagDto => {
  const { id, name, sortOrder } = data;
  const tagDto = new TagDto({
    id,
    name,
    sortOrder,
  });
  return tagDto;
};

export const toTagWithCreatorDto = (data: Tag): TagWithCreatorDto => {
  const { id, name, creator, sortOrder } = data;
  const tagWithCreatorDto = new TagWithCreatorDto({
    id,
    name,
    creator,
    sortOrder,
  });
  return tagWithCreatorDto;
};
