import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { LoginUserDto } from '../auth/dto/LoginUserDto';
import { UserService } from './user.service';

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
}
