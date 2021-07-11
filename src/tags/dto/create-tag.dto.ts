import { Allow, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTagDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  sortOrder: number;
}
