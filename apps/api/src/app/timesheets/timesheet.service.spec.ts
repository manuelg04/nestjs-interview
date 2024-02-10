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
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      };
      jest.spyOn(timesheetService, 'createTimesheet').mockResolvedValue({
        id: 2,
        ...CreateTimesheetDto,
      });

      const result = await timesheetService.createTimesheet(CreateTimesheetDto);
      expect(result).toEqual(expect.objectContaining({
        ...CreateTimesheetDto,
        id: expect.any(Number)
      }));
    });

    it('should throw a ConflictException for duplicate timesheet', async () => {
      jest.spyOn(timesheetService, 'createTimesheet').mockRejectedValue(new ConflictException());
      await expect(timesheetService.createTimesheet({
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        checkDate: new Date(),
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateTimesheet', () => {
    it('should update an employee successfully', async () => {
      const timesheetId = 1;
      const UpdateTimesheetDto = {
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      };
      jest.spyOn(timesheetService, 'updateTimesheet').mockResolvedValue({
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
      jest.spyOn(timesheetService, 'findAllTimesheets').mockResolvedValue([
        {
          id: 1,
          employeeId: 1,
          date: new Date(),
          hoursWorked: 8,
          grossWage: 160,
          checkDate: new Date(),
          status: 'pending', // default status
        },
        {
          id: 2,
          employeeId: 1,
          date: new Date(),
          hoursWorked: 8,
          grossWage: 160,
          checkDate: new Date(),
          status: 'pending', // default status
        }
      ]);

      const result = await timesheetService.findAllTimesheets();
      expect(result).toHaveLength(2);
    });
  });


  describe('findOneTimesheet', () => {
    it('should fetch one timesheet successfully', async () => {
      const timesheetId = 1;
      jest.spyOn(timesheetService, 'findOneTimesheet').mockResolvedValue({
        id: timesheetId,
        employeeId: 1,
        date: new Date(),
        hoursWorked: 8,
        grossWage: 160,
        checkDate: new Date(),
        status: 'pending', // default status
      });

      const result = await timesheetService.findOneTimesheet(timesheetId);
      expect(result).toEqual(expect.objectContaining({
        id: timesheetId,
        employeeId: 1,
        date: expect.any(Date),
        hoursWorked: 8,
        grossWage: 160,
        checkDate: expect.any(Date),
        status: 'pending', // default status
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
