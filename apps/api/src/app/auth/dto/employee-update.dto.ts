import { PartialType } from '@nestjs/mapped-types';
import { RegisterEmployeeDto } from './register-employee.dto';

export class EmployeeUpdateDto extends PartialType(RegisterEmployeeDto) {}
