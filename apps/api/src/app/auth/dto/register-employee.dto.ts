import { IsNumber, IsString, Length } from "class-validator";

export class RegisterEmployeeDto {
  @IsString()
  email: string;
  @IsString()
  @Length(8, 20)
  password: string;
  @IsString()
  name: string;
  @IsString()
  payType: string;
  @IsNumber()
  payRate: number;

}
