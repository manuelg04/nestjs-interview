import { EmployeesController } from './employee.controllers';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employee.service';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
describe('EmployeesService', () => {
  let employeesService: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [EmployeesService, PrismaService],

    }).compile();

    employeesService = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(employeesService).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should create an employee successfully', async () => {
      const userId = 1;
      const employeeDto = {
        userId,
        email: 'test@example.com',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      };
      jest.spyOn(employeesService, 'createEmployee').mockResolvedValue({
        id: 2,
        ...employeeDto,
        userId,
      });

      const result = await employeesService.createEmployee(employeeDto);
      expect(result).toEqual(expect.objectContaining({
        ...employeeDto,
        id: expect.any(Number)
      }));
    });

    it('should throw a ConflictException for duplicate employee', async () => {
      const userId = 1;
      jest.spyOn(employeesService, 'createEmployee').mockRejectedValue(new ConflictException());
      await expect(employeesService.createEmployee({
        userId,
        email: 'test@example.com',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const employeeId = 1;
      const userId = 1;
      const updateDto = { name: 'Jane Doe', payRate: 25 };
      jest.spyOn(employeesService, 'updateEmployee').mockResolvedValue({

        id: employeeId,
        userId,
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        payType: 'hourly',
        payRate: 25,
      });

      const result = await employeesService.updateEmployee(employeeId, userId, updateDto);
      expect(result).toEqual(expect.objectContaining(updateDto));
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      const employeeId = 1;
      const userId = 1;
      jest.spyOn(employeesService, 'deleteEmployee').mockImplementation(async () => Promise.resolve({ id: employeeId }));

      await expect(employeesService.deleteEmployee(employeeId, userId)).resolves.toEqual({ id: employeeId });
    });
  });
});
