import {
  Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards
} from '@nestjs/common';
import { EmployeesService } from '../employees/employee.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Employees } from './employee.model';
import { RegisterEmployeeDto } from '../auth/dto/register-employee.dto';
import { EmployeeUpdateDto } from '../auth/dto/employee-update.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllEmployees(): Promise<Employees[]> {
    try {
      return await this.employeesService.getAllEmployees();
    } catch (error) {
      throw new HttpException('Failed to get employees', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEmployee(@Body() createDto: RegisterEmployeeDto): Promise<Employees> {
    try {
      return await this.employeesService.createEmployee(createDto);
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
  async getEmployee(@Param('id') id: number): Promise<Employees> {
    try {
      return await this.employeesService.findOneEmployee(+id);
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
  async updateEmployee(@Param('id') id: number, @Body() updateDto: EmployeeUpdateDto): Promise<Employees> {
    try {
      return await this.employeesService.updateEmployee(+id, updateDto);
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
  async deleteEmployee(@Param('id') id: number): Promise<{ id: number }> {
    try {
      return await this.employeesService.deleteEmployee(+id);
    } catch (error) {
      if (error.status) {
        throw error;
      } else {
        throw new HttpException('Failed to delete employee', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}