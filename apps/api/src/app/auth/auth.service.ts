/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {

  }

  async validateEmployee(email: string, pass: string): Promise<Employee | null> {
    const employee = await this.userRepository.findEmployeeByEmail(email);
    if (employee && await bcrypt.compare(pass, employee.password)) {
      // La contraseña se verifica pero no se retorna en el objeto
      return employee;
    }
    return null;
  }

  async login(employee: Employee): Promise<{ access_token: string }> {
    const payload = { email: employee.email, sub: employee.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<Employee> {
    // Verificar si el usuario ya existe
    const userExists = await this.userRepository.findEmployeeByEmail(createUserDto.email);
    if (userExists) {
      throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
    }

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el nuevo usuario con la contraseña hasheada
    const employee = await this.userRepository.createEmployee({
      ...createUserDto,
      password: hashedPassword,
    });

    // No incluir la contraseña en el objeto de retorno
    delete employee.password;

    return employee;
  }
}
