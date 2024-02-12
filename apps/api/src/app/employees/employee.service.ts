/* eslint-disable no-useless-catch */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Employees } from './employee.model';
import { EmployeeUpdateDto } from '../auth/dto/employee-update.dto';

const MINIMUM_WAGE = {
  hourly: 12.0,
  salary: 480.0,
};

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async getAllEmployees(userId: number): Promise<Employees[]> {
    const employees = await this.prisma.employee.findMany({
      where: { userId },
    });
    return employees;
  }

  async createEmployee(data: {
    email: string;
    name: string;
    payType: string;
    payRate: number;
    userId: number;
  }): Promise<Employees> {
    if (data.payType === 'hourly' && data.payRate < MINIMUM_WAGE.hourly) {
      throw new BadRequestException('Hourly rate is below the minimum wage');
    } else if (data.payType === 'salary' && data.payRate < MINIMUM_WAGE.salary) {
      throw new BadRequestException('Salary is below the minimum wage');
    }

    try {
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { email: data.email },
      });

      if (existingEmployee) {
        throw new ConflictException('Employee already exists');
      }

      return this.prisma.employee.create({
        data: {
        ...data,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create employee');
    }
  }


  async updateEmployee(
    id: number,
    userId: number,
    updateData: EmployeeUpdateDto,
  ): Promise<Employees> {
    if (
      updateData.payType === 'hourly' &&
      updateData.payRate < MINIMUM_WAGE.hourly
    ) {
      throw new BadRequestException('Hourly rate is below the minimum wage');
    } else if (
      updateData.payType === 'salary' &&
      updateData.payRate < MINIMUM_WAGE.salary
    ) {
      throw new BadRequestException('Salary is below the minimum wage');
    }
    try {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id, userId },
      });

      if (!employeeExists) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      const updatedEmployee = await this.prisma.employee.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
        },
      });
      return updatedEmployee;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  async deleteEmployee(id: number, userId:number): Promise<{ id: number; }> {
    try {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id, userId  },
      });

      if (!employeeExists) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      await this.prisma.employee.delete({
        where: { id },
      });
      return employeeExists;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete employee');
    }
  }

  async findOneEmployee(id: number, userId: number ): Promise<Employees> {
    try {
      const employee = await this.prisma.employee.findFirst({
        where: {
           id,
          userId
          },
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return employee;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get employee');
    }
  }
}
