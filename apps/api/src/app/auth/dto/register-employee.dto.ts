import { IsNumber, IsString } from "class-validator";

export class RegisterEmployeeDto {
  @IsString()
  email: string;
  @IsString()
  @IsString()
  name: string;
  @IsString()
  payType: string;
  @IsNumber()
  payRate: number;

}
