import { Min } from 'class-validator';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Min(8)
  password: string;

  @IsNotEmpty()
  nickname: string;
}
