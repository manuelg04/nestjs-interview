import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controllers';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../../prisma.service';



@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService],
})

export class EmployeesModule {}
