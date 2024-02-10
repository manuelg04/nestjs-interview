import { Module } from '@nestjs/common';
import { EmployeesController } from './employee.controllers';
import { EmployeesService } from './employee.service';
import { PrismaService } from '../../prisma.service';



@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService],
})

export class EmployeesModule {}
