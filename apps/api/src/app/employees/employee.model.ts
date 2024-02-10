import { Prisma } from '@prisma/client';
export class Employees implements Prisma.EmployeeCreateInput{

  id: number;
  email: string;
  name: string;
  payType: string;
  payRate: number;

}
