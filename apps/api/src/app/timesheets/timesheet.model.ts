export class Timesheet {
  id: number;
  employeeId: number;
  hoursWorked?: number;
  grossWage: number;
  checkDate: Date;
  status: string;
  notes?: string;
}
