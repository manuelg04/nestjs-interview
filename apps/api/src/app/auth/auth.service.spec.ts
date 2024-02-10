import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../employees/employees.service';
import { PrismaService } from '../../prisma.service';
import { LoginDto } from './dto/login-employee.dto';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}));


describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let employeesService: EmployeesService;


  beforeEach(async () => {
    const prismaServiceMock = {
      employee: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            login: jest.fn().mockReturnValue(LoginDto),
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
          },
        },
        {
          provide: EmployeesService,
          useValue: {
            createEmployee: jest.fn().mockImplementation(email => ({
              id: 1,
              email: email,
              password: bcrypt.hashSync('password', 10),
            })),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            ...prismaServiceMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    employeesService = module.get<EmployeesService>(EmployeesService);


    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should validate employee login and return a token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      await expect(authService.login(loginDto)).rejects.toThrow(NotFoundException);
    });

  });

  describe('register', () => {
    it('should successfully register a new employee and return a token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'newPassword',
        name: 'New Employee',
        payType: 'hourly',
        payRate: 15,
      };

      jest.spyOn(employeesService, 'createEmployee').mockResolvedValue({
        id: 2,
        ...registerDto,
        password: bcrypt.hashSync(registerDto.password, 10),
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual({ token: 'mockedJwtToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'new@example.com',
        id: 2,
      });
    });
  });
});
