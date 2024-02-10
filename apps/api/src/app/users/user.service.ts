import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { adminUser } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<adminUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.adminUser.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) throw new Error('User not found');

    const passwordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!passwordValid) throw new Error('Invalid password');

    // Implement JWT token creation and return it
    return { message: 'Login successful', userId: user.id };
  }
}
