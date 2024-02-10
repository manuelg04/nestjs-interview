import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmployeesService } from './app/employees/employee.service';

@Module({

  providers: [PrismaService,
    EmployeesService
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
