import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;

  readonly date?: Date;

  @IsNumber()
  readonly hoursWorked?: number;

  @IsNotEmpty()
  @IsDate()
  readonly checkDate: Date;
}
