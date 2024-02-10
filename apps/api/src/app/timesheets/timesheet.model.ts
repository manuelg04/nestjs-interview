export class Timesheet {
  id: number;
  employeeId: number;
  date: Date;
  hoursWorked?: number;
  grossWage: number;
  checkDate: Date;
  status: string;
  notes?: string;
}
