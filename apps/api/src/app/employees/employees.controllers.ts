import { Controller, Get, HttpException, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Employees } from './employee.model';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllEmployees(@Req() request: Request, @Res() response: Response):Promise<Employees[]>{
    try{
         const result = await this.employeesService.getAllEmployees();
          return result;
    }catch(err){
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

}
