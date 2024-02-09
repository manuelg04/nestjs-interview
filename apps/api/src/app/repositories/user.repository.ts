import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Employee } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: {
    email: string;
    password: string;
    name: string;
    payType: string;
    payRate: number;
  }): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  async findEmployeeByEmail(email: string): Promise<Employee | null>{
    return this.prisma.employee.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        payType: true,
        payRate: true,
      },
    });
  }
}
