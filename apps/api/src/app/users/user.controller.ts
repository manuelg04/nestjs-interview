import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { EditCustomerDto } from '../auth/dto/update-customer.dto';

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

  @UseGuards(JwtAuthGuard)
  @Put('editCustomer/:id')
  async editCustomerById(@Param('id', ParseIntPipe) id: number, @Body() editCustomerDto: EditCustomerDto) {
    return this.userService.editCustomerById(id, editCustomerDto);
  }
}
