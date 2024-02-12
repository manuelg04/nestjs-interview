import { User } from "../users/user.model"; // Asegúrate de que este importe corresponda a la ubicación real de tu modelo User.

export class Employees {
  id: number;
  userId: number;
  user?: User;
  email: string;
  name: string;
  payType: string;
  payRate: number;

  constructor(id: number, userId: number, email: string, name: string, payType: string, payRate: number, user: User) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.payType = payType;
    this.payRate = payRate;
    this.user = user;
  }
}
