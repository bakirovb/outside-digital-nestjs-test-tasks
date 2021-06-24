import { IsNumberString } from 'class-validator';

export class GetTagParams {
  @IsNumberString()
  id: string;
}
