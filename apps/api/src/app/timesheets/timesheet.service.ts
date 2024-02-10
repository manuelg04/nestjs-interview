import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTimesheetDto } from '../auth/dto/create-timesheet.dto';
import { Timesheet } from './timesheet.model';
import { UpdateTimesheetDto } from '../auth/dto/update-timesheet.dto';

@Injectable()
export class TimesheetService {
  constructor(private prisma: PrismaService) {}

  async calculateGrossWage(
    employeeId: number,
    hoursWorked: number,
  ): Promise<number> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee)
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);

    return employee.payType === 'hourly'
      ? employee.payRate * hoursWorked
      : employee.payRate;
  }

  async createTimesheet(
    createTimesheetDto: CreateTimesheetDto,
  ): Promise<Timesheet> {
    const { employeeId, hoursWorked, date, checkDate } = createTimesheetDto;

    try {
      const grossWage = await this.calculateGrossWage(employeeId, hoursWorked);

      return this.prisma.timesheet.create({
        data: {
          employeeId,
          date,
          hoursWorked,
          grossWage,
          checkDate,
          status: 'pending', // default status
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating timesheet');
    }
  }

  async findAllTimesheets(): Promise<Timesheet[]> {
    try {
      return this.prisma.timesheet.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheets');
    }
  }

  async findOneTimesheet(id: number): Promise<Timesheet> {

    try {
      const timesheet = await this.prisma.timesheet.findUnique({
        where: { id },
      });
      if (!timesheet)
        throw new NotFoundException(`Timesheet with ID ${id} not found`);

      return timesheet;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheet');
    }
  }



  async updateTimesheet(
    id: number,
    updateTimesheetDto: UpdateTimesheetDto,
  ): Promise<Timesheet> {
    try {
      return this.prisma.timesheet.update({
        where: { id },
        data: updateTimesheetDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating timesheet');
    }
  }

  async deleteTimesheet(id: number): Promise<{ id: number; }> {
    try {
      const timesheetExists = await this.prisma.timesheet.findUnique({
        where: { id },
      });
      if (!timesheetExists)
        throw new NotFoundException(`Timesheet with ID ${id} not found`);

      return this.prisma.timesheet.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting timesheet');
    }
  }
}
