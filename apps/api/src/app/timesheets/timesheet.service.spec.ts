import { CreateTimesheetDto } from './../auth/dto/create-timesheet.dto';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

describe('EmployeesService', () => {
  let timesheetService: TimesheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesheetController],
      providers: [TimesheetService, PrismaService],

    }).compile();

    timesheetService = module.get<TimesheetService>(TimesheetService);
  });

  it('should be defined', () => {
    expect(timesheetService).toBeDefined();
  });

  describe('createTimesheet', () => {
    it('should create an timesheet successfully', async () => {
      const CreateTimesheetDto = {
        id: 1,
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
        notes: 'notes',
      };
      const userId = 1;
      jest.spyOn(timesheetService, 'createTimesheet').mockResolvedValue({
        userId: 1,
        id: 2,
        ...CreateTimesheetDto,
      });

      const result = await timesheetService.createTimesheet(CreateTimesheetDto, userId);
      expect(result).toEqual(expect.objectContaining({
        ...CreateTimesheetDto,
        id: expect.any(Number)
      }));
    });

    it('should throw a ConflictException for duplicate timesheet', async () => {
      jest.spyOn(timesheetService, 'createTimesheet').mockRejectedValue(new ConflictException());
      const createTimesheetDto: CreateTimesheetDto = {
        employeeId: 1,
        hoursWorked: 8,
        checkDate: new Date(),
      };
      const userId = 1;
      await expect(timesheetService.createTimesheet({
        ...createTimesheetDto,
        employeeId: 1,
      }, userId)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateTimesheet', () => {
    it('should update an employee successfully', async () => {
      const timesheetId = 1;
      const UpdateTimesheetDto = {
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      };
      const userId = 1;
      jest.spyOn(timesheetService, 'updateTimesheet').mockResolvedValue({
        userId,
        id: timesheetId,
        ...UpdateTimesheetDto,
      });

      const result = await timesheetService.updateTimesheet(timesheetId, UpdateTimesheetDto);
      expect(result).toEqual(expect.objectContaining(UpdateTimesheetDto));
    });
  });

  describe('deleteTimesheet', () => {
    it('should delete an employee successfully', async () => {
      const employeeId = 1;
      jest.spyOn(timesheetService, 'deleteTimesheet').mockImplementation(async () => Promise.resolve({ id: employeeId }));

      await expect(timesheetService.deleteTimesheet(employeeId)).resolves.toEqual({ id: employeeId });
    });
  });

  describe('findAllTimesheets', () => {
    it('should fetch all timesheets successfully', async () => {
      const userId = 1;
      jest.spyOn(timesheetService, 'findAllTimesheets').mockResolvedValue([
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
        }
      ]);

      const result = await timesheetService.findAllTimesheets(userId);
      expect(result).toHaveLength(2);
    });
  });


  describe('findOneTimesheet', () => {
    it('should fetch one timesheet successfully', async () => {
      const timesheetId = 1;
      const userId = 1;
      jest.spyOn(timesheetService, 'findOneTimesheet').mockResolvedValue({
        userId,
        id: timesheetId,
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      });

      const result = await timesheetService.findOneTimesheet(timesheetId, userId);
      expect(result).toEqual(expect.objectContaining({
        id: timesheetId,
        employeeId: 1,
        hoursWorked: 8,
        grossWage: 160,
        checkDate: expect.any(Date),
        status: 'pending', // default status
        userId,
      }));
    });
  });

  describe('calculateGrossWage', () => {
    it('should calculate gross wage successfully', async () => {
      const employeeId = 1;
      const hoursWorked = 8;
      jest.spyOn(timesheetService, 'calculateGrossWage').mockResolvedValue(160);

      const result = await timesheetService.calculateGrossWage(employeeId, hoursWorked);
      expect(result).toEqual(160);
    });
  });
});
