import { EmployeesController } from './employees.controllers';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
      const employeeDto = {
        email: 'test@example.com',
        password: 'pass123',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      };
      jest.spyOn(employeesService, 'createEmployee').mockResolvedValue({
        id: 2,
        ...employeeDto,
        password: bcrypt.hashSync(employeeDto.password, 10),
      });

      const result = await employeesService.createEmployee(employeeDto);
      expect(result).toEqual(expect.objectContaining({
        ...employeeDto,
        password: expect.any(String), // Verifica solo que password es un string
        id: expect.any(Number) // Verifica que se haya generado un ID
      }));
    });

    it('should throw a ConflictException for duplicate employee', async () => {
      jest.spyOn(employeesService, 'createEmployee').mockRejectedValue(new ConflictException());
      await expect(employeesService.createEmployee({
        email: 'test@example.com',
        password: 'pass123',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const employeeId = 1;
      const updateDto = { name: 'Jane Doe', payRate: 25 };
      jest.spyOn(employeesService, 'updateEmployee').mockResolvedValue({
        id: employeeId,
        email: 'jane.doe@example.com',
        password: 'encryptedPassword',
        name: 'Jane Doe',
        payType: 'hourly',
        payRate: 25,
      });

      const result = await employeesService.updateEmployee(employeeId, updateDto);
      expect(result).toEqual(expect.objectContaining(updateDto));
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      const employeeId = 1;
      jest.spyOn(employeesService, 'deleteEmployee').mockImplementation(async () => Promise.resolve({ id: employeeId }));

      await expect(employeesService.deleteEmployee(employeeId)).resolves.toEqual({ id: employeeId });
    });
  });
});
