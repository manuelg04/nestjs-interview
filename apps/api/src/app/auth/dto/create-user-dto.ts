import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
