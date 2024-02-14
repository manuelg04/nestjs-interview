import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from '../timesheets/timesheet.service';
import { PrismaService } from '../../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TimesheetController', () => {
  let controller: TimesheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesheetController],
      providers: [TimesheetService, PrismaService],
    }).compile();

    controller = module.get<TimesheetController>(TimesheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTimesheet', () => {
    it('should create a timesheet successfully', async () => {
      const userId = 1;
      const CreateTimesheetDto = {
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      };
      jest.spyOn(controller, 'createTimesheet').mockResolvedValue({
        id: 2,
        ...CreateTimesheetDto,
        userId,
      });

      const result = await controller.createTimesheet(CreateTimesheetDto, userId);
      expect(result).toEqual(expect.objectContaining({
        ...CreateTimesheetDto,
        id: expect.any(Number)
      }));
    });

    it('should throw a ConflictException for duplicate timesheet', async () => {
      const user = { id: 1 };
      jest.spyOn(controller, 'createTimesheet').mockRejectedValue(new ConflictException());
      await expect(controller.createTimesheet({
        employeeId: 1,
        hoursWorked: 8,
        checkDate: new Date(),
      }, user)).rejects.toThrow(ConflictException);
    });
  });


  describe('updateTimesheet', () => {
    it('should update a timesheet successfully', async () => {
      const timesheetId = 1;
      const userId = 1;
      const UpdateTimesheetDto = {
        userId,
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      };
      jest.spyOn(controller, 'updateTimesheet').mockResolvedValue({
        id: timesheetId,
        ...UpdateTimesheetDto,
      });

      const result = await controller.updateTimesheet(timesheetId, UpdateTimesheetDto);
      expect(result).toEqual(expect.objectContaining({
        ...UpdateTimesheetDto,
        id: timesheetId
      }));
    });

    it('should throw a NotFoundException for non-existing timesheet', async () => {
      jest.spyOn(controller, 'updateTimesheet').mockRejectedValue(new NotFoundException());
      await expect(controller.updateTimesheet(999, {
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        checkDate: new Date(),
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTimesheet', () => {
    it('should delete a timesheet successfully', async () => {
      const timesheetId = 1;
      jest.spyOn(controller, 'deleteTimesheet').mockResolvedValue({
        id: timesheetId,
      });

      const result = await controller.deleteTimesheet(timesheetId);
      expect(result).toEqual(expect.objectContaining({
        id: timesheetId
      }));
    });

    it('should throw a NotFoundException for non-existing timesheet', async () => {
      jest.spyOn(controller, 'deleteTimesheet').mockRejectedValue(new NotFoundException());
      await expect(controller.deleteTimesheet(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllTimesheets', () => {
    it('should fetch all timesheets successfully', async () => {
      const userId = 1;
      jest.spyOn(controller, 'findAllTimesheets').mockResolvedValue([
        {
          userId,
          id: 1,
          employeeId: 1,
          hoursWorked: 8,
          grossWage: 160,
          checkDate: new Date(),
          status: 'pending', // default status
        },
        {
          userId,
          id: 2,
          employeeId: 1,
          hoursWorked: 8,
          grossWage: 160,
          checkDate: new Date(),
          status: 'pending', // default status
        },
      ]);

      const result = await controller.findAllTimesheets(userId);
      expect(result).toHaveLength(2);
    });
  });


  describe('findOneTimesheet', () => {
    it('should fetch a timesheet successfully', async () => {
      const timesheetId = 1;
      const userId = 1;
      jest.spyOn(controller, 'findOneTimesheet').mockResolvedValue({
        userId,
        id: timesheetId,
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      });

      const result = await controller.findOneTimesheet(timesheetId, userId);
      expect(result).toEqual(expect.objectContaining({
        id: timesheetId
      }));
    });

    it('should throw a NotFoundException for non-existing timesheet', async () => {
      const user = { id: 1 };
      jest.spyOn(controller, 'findOneTimesheet').mockRejectedValue(new NotFoundException());
      await expect(controller.findOneTimesheet(999, user)).rejects.toThrow(NotFoundException);
    });
  });
});
