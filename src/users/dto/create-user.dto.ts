import { MinLength } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ContainsNumeric } from 'src/common/validators/contains-numeric';
import { ContainsLowercaseLetter } from 'src/common/validators/contains-lowercase-letter';
import { ContainsUppercaseLetter } from 'src/common/validators/contains-uppercase-letter';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @ContainsUppercaseLetter()
  @ContainsLowercaseLetter()
  @ContainsNumeric()
  password: string;

  @IsNotEmpty()
  nickname: string;
}
