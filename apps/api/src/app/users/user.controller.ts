import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-admin-user')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllCustomers')
  async getAllCustomers() {

    return this.userService.getAllCustomers();
  }
}
