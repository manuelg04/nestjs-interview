import { Prisma, UserRole } from '@prisma/client';
export class User implements Prisma.UserCreateInput {
  id?: number;
  email: string;
  password: string;
  role: UserRole;
}

// src/models/user-role.enum.ts

