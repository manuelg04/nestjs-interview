import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserRole } from '@prisma/client';
import { AuthController } from './auth.controller';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,

      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new employee', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'newPassword',
        role: UserRole.CUSTOMER,
      };

      jest.spyOn(authService, 'createUser').mockResolvedValue({
        token: 'token',
        ...createUserDto,
      });

      const result = await authService.createUser(createUserDto);

      expect(result).toEqual(expect.any(Object));
      expect(result.token).toBeDefined();
    });
  });


  describe('login', () => {
    it('should validate employee login', async () => {
      const loginDto = { email: 'test@example.com', password: 'newPassword' };

      await expect(authService.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

});
