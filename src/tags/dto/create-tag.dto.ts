import { Allow, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  sortOrder: number;
}
