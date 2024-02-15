import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { EditCustomerDto } from '../auth/dto/update-customer.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: '',
        role: 'CUSTOMER',
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) throw new Error('User not found');

    const passwordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!passwordValid) throw new Error('Invalid password');

    return { message: 'Login successful', userId: user.id };
  }

  async getAllCustomers() {
    return this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async editCustomerById(id: number, editCustomerDto: EditCustomerDto) {
    return this.prisma.user.update({
      where: { id },
      data: editCustomerDto,
    });
  }

}
