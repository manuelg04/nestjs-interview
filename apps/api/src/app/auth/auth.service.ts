
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma.service";
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/LoginUserDto';
import { adminUser } from "../users/user.model";

@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService
    ) {}

    async login(loginDto: LoginUserDto) {
      const { email } = loginDto;
      const employee = await this.prismaService.employee.findUnique({
        where: {
          email
        },
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      return {
        token: this.jwtService.sign({ email: employee.email, id: employee.id }),
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
