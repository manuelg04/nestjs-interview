import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EmployeesController } from './employee.controllers';
import { EmployeesService } from './employee.service';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [EmployeesService, PrismaService],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should create a employee successfully', async () => {
      const employeeDto = {
        email: 'test@example.com',
        password: 'pass123',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      };
      jest.spyOn(controller, 'createEmployee').mockResolvedValue({
        id: 2,
        ...employeeDto,
      });

      const result = await controller.createEmployee(employeeDto);
      expect(result).toEqual(expect.objectContaining({
        ...employeeDto,
        id: expect.any(Number) // Verifica que se haya generado un ID
      }));
    });

    it('should throw a ConflictException for duplicate employee', async () => {
      jest.spyOn(controller, 'createEmployee').mockRejectedValue(new ConflictException());
      await expect(controller.createEmployee({
        email: 'test@example.com',
        name: 'John Doe',
        payType: 'hourly',
        payRate: 20
      })).rejects.toThrow(ConflictException);
    });
  });


  describe('updateEmployee', () => {
    it('should update a employee successfully', async () => {
      const employeeId = 1;
      const UpdateEmployeeDto = {
        id: employeeId,
        email: 'jane.doe@example.com',
        password: 'encryptedPassword',
        name: 'Jane Doe',
        payType: 'hourly',
        payRate: 25,
      };
      jest.spyOn(controller, 'updateEmployee').mockResolvedValue({
        id: employeeId,
        ...UpdateEmployeeDto,
      });

      const result = await controller.updateEmployee(employeeId, UpdateEmployeeDto);
      expect(result).toEqual(expect.objectContaining({
        ...UpdateEmployeeDto,
        id: employeeId
      }));
    });

    it('should throw a NotFoundException for non-existing employee', async () => {
      jest.spyOn(controller, 'updateEmployee').mockRejectedValue(new NotFoundException());
      await expect(controller.updateEmployee(999, {
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete a employee successfully', async () => {
      const employeeId = 1;
      jest.spyOn(controller, 'deleteEmployee').mockResolvedValue({
        id: employeeId,
      });

      const result = await controller.deleteEmployee(employeeId);
      expect(result).toEqual(expect.objectContaining({
        id: employeeId
      }));
    });

    it('should throw a NotFoundException for non-existing employee', async () => {
      jest.spyOn(controller, 'deleteEmployee').mockRejectedValue(new NotFoundException());
      await expect(controller.deleteEmployee(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllEmployees', () => {
    it('should fetch all employee successfully', async () => {
      jest.spyOn(controller, 'getAllEmployees').mockResolvedValue([
        {
        id: 1,
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        payType: 'hourly',
        payRate: 25,
        },
        {
        id: 2,
        email: 'jane.doe@example.com',
        name: 'Jane Doee',
        payType: 'hourly',
        payRate: 25,
        },
      ]);

      const result = await controller.getAllEmployees();
      expect(result).toHaveLength(2);
    });
  });


  describe('getEmployee', () => {
    it('should fetch a employee successfully', async () => {
      const employeeId = 1;
      jest.spyOn(controller, 'getEmployee').mockResolvedValue({
        id: employeeId,
        email: 'jane.doe@example.com',
        name: 'Jane Doee',
        payType: 'hourly',
        payRate: 25,
      });

      const result = await controller.getEmployee(employeeId);
      expect(result).toEqual(expect.objectContaining({
        id: employeeId
      }));
    });

    it('should throw a NotFoundException for non-existing employee', async () => {
      jest.spyOn(controller, 'getEmployee').mockRejectedValue(new NotFoundException());
      await expect(controller.getEmployee(999)).rejects.toThrow(NotFoundException);
    });
  });
});
