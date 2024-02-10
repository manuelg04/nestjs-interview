
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma.service";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/LoginUserDto';
import { adminUser } from "../users/user.model";
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService
    ) {}

    async login(loginDto: LoginUserDto) {
      const { email, password } = loginDto;
      const user = await this.prismaService.adminUser.findUnique({
        where: {
          email
        },
      });
      if (!user) {
        throw new NotFoundException('Employee not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        token: this.jwtService.sign({ email: user.email, id: user.id }),
      };

    }

    async register(createDto: CreateUserDto){
      const createAdminUser = new adminUser();
      createAdminUser.email = createDto.email;
      createAdminUser.password = createDto.password;

      const employee = await this.userService.createAdminUser(createAdminUser);

      return {
        token: this.jwtService.sign({ email: employee.email, id: employee.id }),
      };
    }
}
