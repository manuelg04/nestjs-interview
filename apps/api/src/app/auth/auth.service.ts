import { LoginDto } from './dto/login-employee.dto';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma.service";
import { EmployeesService } from "../employees/employees.service";
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { Employees } from '../employees/employee.model';

@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly employeeService: EmployeesService
    ) {}

    async login(loginDto: LoginDto) {
      const { email, password } = loginDto;
      const employee = await this.prismaService.employee.findUnique({
        where: {
          email
        },
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const validatePassword = bcrypt.compare(password, employee.password);

      if (!validatePassword) {
        throw new NotFoundException('Invalid credentials');
      }

      return {
        token: this.jwtService.sign({ email: employee.email, id: employee.id }),
      };

    }

    async register(createDto: RegisterEmployeeDto){
      const createEmployees = new Employees();
      createEmployees.email = createDto.email;
      createEmployees.password = await  bcrypt.hash(createDto.password, 10);
      createEmployees.name = createDto.name;
      createEmployees.payRate = createDto.payRate;
      createEmployees.payType = createDto.payType;


      const employee = await this.employeeService.createEmployee(createEmployees);

      return {
        token: this.jwtService.sign({ email: employee.email, id: employee.id }),
      };
    }
}
