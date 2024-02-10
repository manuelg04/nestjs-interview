import { Controller,Post,Body,Req,Res } from "@nestjs/common";
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
               return response.status(500).json({
                    status: 'Error!',
                    message: 'Internal Server Error!',
                   })
          }
     }


     @Post('/register')
     async register(@Req() request: Request, @Res() response: Response, @Body() createUserDto: CreateUserDto): Promise<any> {
       try {
         const result = await this.authService.register(createUserDto);
         return response.status(200).json({
           status: 'Ok!',
           message: 'Successfully registered user!',
           result: result,
         });
       } catch (err) {
         console.log(err);
         return response.status(500).json({
           status: 'Error!',
           message: 'Internal Server Error! ',
         });

       }
     }


}
