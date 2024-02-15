import { Controller,Post,Body,Req,Res, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {Request,Response} from 'express'
import { LoginDto } from "./dto/login-employee.dto";
import { CreateUserDto } from "./dto/create-user-dto";

@Controller('/auth')
export class AuthController{


     constructor(private readonly authService:AuthService){}

     @Post('/login')
     async login(@Req() request:Request, @Res() response :Response, @Body() loginDto: LoginDto):Promise<any>{
          try{
              const result = await this.authService.login(loginDto);
              return response.status(200).json({
               status: 'Ok!',
               message: 'Successfully login!',
               result: result
              })

          }catch(err){
            return response.status(HttpStatus.UNAUTHORIZED).json({
              status: 'Error',
              message: 'Invalid credentials',
            });
          }
     }


     @Post('/register')
     async register(@Req() request: Request, @Res() response: Response, @Body() createUserDto: CreateUserDto): Promise<any> {
       try {
         const result = await this.authService.createUser(createUserDto);
       return response.status(HttpStatus.CREATED).json({
          status: 'Ok!',
          message: 'Successfully registered!',
          result: result
        });
       } catch (err) {
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'Error',
            message: 'Failed to register user',
          });

       }
     }


}
