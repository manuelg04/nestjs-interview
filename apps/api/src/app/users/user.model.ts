import { Prisma } from '@prisma/client';

export class adminUser implements Prisma.adminUserCreateInput {
  id?: number;
  email: string;
  password: string;
}
