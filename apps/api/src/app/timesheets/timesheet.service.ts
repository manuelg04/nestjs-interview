import {
  ForbiddenException,
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
    userId: number,
  ): Promise<Timesheet> {
    const { employeeId, hoursWorked, checkDate } = createTimesheetDto;
    const date = new Date();
    try {
      const grossWage = await this.calculateGrossWage(employeeId, hoursWorked);
      const checkDateObj = new Date(checkDate);

      return this.prisma.timesheet.create({
        data: {
          employeeId,
          date,
          hoursWorked,
          grossWage,
          checkDate: checkDateObj,
          status: 'pending', // default status
          userId
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating timesheet');
    }
  }

  async findAllTimesheets(userId?: number): Promise<Timesheet[]> {
    try {
      const whereCondition = userId ? { userId } : {};

      return this.prisma.timesheet.findMany({
        where: whereCondition,
        include: {
          user:{
            select: {
              email: true,
            }
          },
          employee: {
            select: {
              payRate: true,
            }
          }
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheets');
    }
  }


  async findOneTimesheet(id: number, userId: number): Promise<Timesheet> {
    try {
      const timesheet = await this.prisma.timesheet.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          user: true,
        },
      });

      if (!timesheet)
        throw new NotFoundException(`Timesheet with ID ${id} not found for user ID ${userId}`);

      return timesheet;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheet');
    }
  }




  async updateTimesheet(
    id: number,
    userId: number,
    role: string,
    updateTimesheetDto: UpdateTimesheetDto,
  ): Promise<Timesheet> {
    try {
      const timesheet = await this.prisma.timesheet.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!timesheet) {
        throw new NotFoundException(`Timesheet with ID ${id} not found`);
      }

      if (role === 'CUSTOMER' && timesheet.userId !== userId) {
        throw new ForbiddenException('You can only update your own timesheets');
      }
      const dataToUpdate = role === 'ADMIN' ? {
        status: updateTimesheetDto.status,
        notes: updateTimesheetDto.notes,
      } : updateTimesheetDto;

      return await this.prisma.timesheet.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      console.log(error.stack);
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
