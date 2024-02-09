import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Employees } from "./employee.model";

@Injectable()
export class EmployeesService{
  constructor(private prisma: PrismaService) {}

  async getAllEmployees(): Promise<Employees[]> {
    return this.prisma.employee.findMany();
  }

  async createEmployee(data: {
    email: string;
    password: string;
    name: string;
    payType: string;
    payRate: number;
  }): Promise<Employees> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee already exists');
    }
    return this.prisma.employee.create({ data });
  }

}
