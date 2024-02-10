import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service'; // Adjust the import path as needed

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
