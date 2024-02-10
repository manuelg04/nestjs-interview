import { TimesheetController } from '../timesheets/timesheet.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TimesheetService } from './timesheet.service';



@Module({
  imports: [],
  controllers: [TimesheetController],
  providers: [TimesheetService, PrismaService],
})

export class TimesheetModule {}
