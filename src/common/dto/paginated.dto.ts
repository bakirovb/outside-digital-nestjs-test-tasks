import { Exclude, Type } from 'class-transformer';
import { PaginatedDtoMeta } from '../interfaces/paginated-dto-meta.interface';

export class paginatedDto<TData> {
  data: TData[];

  meta: PaginatedDtoMeta;

  constructor(partial: Partial<paginatedDto<TData>>) {
    Object.assign(this, partial);
  }
}
