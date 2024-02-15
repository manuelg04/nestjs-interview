
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma.service";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/LoginUserDto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginUserDto) {
      const { email, password } = loginDto;
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        token: this.jwtService.sign({ email: user.email, id: user.id, role: user.role }),
      };
    }


    async createUser(createDto: CreateUserDto) {
      const hashedPassword = await bcrypt.hash(createDto.password, 10);
      const user = await this.prismaService.user.create({
        data: {
          name: createDto.name,
          email: createDto.email,
          password: hashedPassword,
          role: createDto.role,
        },
      });

      return {
        token: this.jwtService.sign({ email: user.email, id: user.id, role: user.role }),
      };
    }
}
