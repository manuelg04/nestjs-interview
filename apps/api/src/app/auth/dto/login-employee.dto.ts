import { IsString, Length } from 'class-validator';

export class LoginDto {

  @IsString()
  email: string;
  @IsString()
  @Length(8, 20)
  password: string;
}
