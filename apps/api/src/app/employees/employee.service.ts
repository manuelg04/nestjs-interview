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

// Puedes ajustar este valor según sea necesario o hacerlo configurable
const MINIMUM_WAGE = {
  hourly: 12.0, // salario por hora
  salary: 480.0, // salario por cheque
};

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async getAllEmployees(): Promise<Employees[]> {
    return this.prisma.employee.findMany();
  }

  async createEmployee(data: {
    email: string;
    name: string;
    payType: string;
    payRate: number;
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
          email: data.email,
          name: data.name,
          payType: data.payType,
          payRate: data.payRate,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create employee');
    }
  }


  async updateEmployee(
    id: number,
    updateData: {
      email?: string;
      password?: string;
      name?: string;
      payType?: string;
      payRate?: number;
    },
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
        where: { id },
      });

      if (!employeeExists) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return this.prisma.employee.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  async deleteEmployee(id: number): Promise<{ id: number; }> {
    try {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id },
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

  async findOneEmployee(id: number): Promise<Employees> {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
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
