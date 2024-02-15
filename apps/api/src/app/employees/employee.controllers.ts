import {
  Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards, ParseIntPipe
} from '@nestjs/common';
import { EmployeesService } from '../employees/employee.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Employees } from './employee.model';
import { RegisterEmployeeDto } from '../auth/dto/register-employee.dto';
import { EmployeeUpdateDto } from '../auth/dto/employee-update.dto';
import { GetUser } from '../users/user.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllEmployees(@GetUser() user): Promise<Employees[]> {
    try {
      const userId = user.id;
      return await this.employeesService.getAllEmployees(userId);
    } catch (error) {
      throw new HttpException('Failed to get employees', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEmployee(@Body() createDto: RegisterEmployeeDto,  @GetUser() user): Promise<Employees> {
    try {
      const userId = user.id;
      const employeeData = { ...createDto, userId };
      return await this.employeesService.createEmployee(employeeData);
    } catch (error) {
      if (error.status) {
        throw error;
      } else {
        throw new HttpException('Failed to create employee', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEmployee(@Param('id') id: number, @GetUser() user ): Promise<Employees> {
    const userId = user.id;
    try {
      return await this.employeesService.findOneEmployee(+id, userId);
    } catch (error) {
      if (error.status) {
        throw error;
      } else {
        throw new HttpException('Failed to get employee', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() updateDto: EmployeeUpdateDto, @GetUser() user): Promise<Employees> {
    try {
      const userId = user.id;
      const empleadoudpate = await this.employeesService.updateEmployee(id, userId, updateDto);
      console.log("🚀 ~ empleadoudpate:", empleadoudpate)
      return empleadoudpate;
    } catch (error) {
      if (error.status) {
        throw error;
      } else {
        throw new HttpException('Failed to update employee', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteEmployee(@Param('id') id: number, @GetUser() user ): Promise<{ id: number }> {
    try {
      const userId = user.id;
      return await this.employeesService.deleteEmployee(+id, userId);
    } catch (error) {
      if (error.status) {
        throw error;
      } else {
        throw new HttpException('Failed to delete employee', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
