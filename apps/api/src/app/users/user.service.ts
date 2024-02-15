import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
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
}
