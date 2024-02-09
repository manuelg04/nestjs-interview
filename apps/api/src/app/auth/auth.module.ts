import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from './jwt.strategy';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { EmployeesModule } from '../employees/employees.module';




@Module({
     controllers: [AuthController],
     providers:[AuthService, PrismaService,JwtStrategy,EmployeesService],
     imports:[
          EmployeesModule,
          PassportModule,
          JwtModule.register({
               secret: process.env.JWT_SECRET,
               signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN
               }
          })
     ]
})
export class AuthModule{}
