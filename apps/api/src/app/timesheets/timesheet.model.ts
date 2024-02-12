import { User } from "../users/user.model";
export class Timesheet {
  id: number;
  employeeId: number;
  hoursWorked?: number;
  grossWage: number;
  checkDate: Date;
  status: string;
  notes?: string;
  userId: number;
  user: User;

  constructor(id: number, employeeId: number, grossWage: number, checkDate: Date, status: string, userId: number, user: User, hoursWorked?: number, notes?: string) {
    this.id = id;
    this.employeeId = employeeId;
    this.grossWage = grossWage;
    this.checkDate = checkDate;
    this.status = status;
    this.userId = userId;
    this.user = user;
    this.hoursWorked = hoursWorked;
    this.notes = notes;
  }
}
