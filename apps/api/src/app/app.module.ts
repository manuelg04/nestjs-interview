import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { HelloCommand } from '@ocmi/api/commands/hello.command';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesModule } from './employees/employee.module';
import { TimesheetModule } from './timesheets/timesheet.module';
import { UserService } from './users/user.service';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EmployeesModule,
    TimesheetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    // HelloCommand
  ],
})
export class AppModule {}
