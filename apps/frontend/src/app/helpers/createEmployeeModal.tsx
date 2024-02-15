/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from "../../ui/components/button";
import { Input } from "../../ui/components/input";
import { Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/components/select";
import { useState } from 'react';

export function EmployeeDialog({ isOpen, onSave, onClose, employee }) {
  const [name, setName] = useState(employee ? employee.name : '');
  const [email, setEmail] = useState(employee ? employee.email : '');
  const [payType, setPayType] = useState(employee ? employee.payType : 'hourly');
  const [payRate, setPayRate] = useState(employee ? employee.payRate.toString() : '');

  const handleSave = (event) => {
    event.preventDefault();
    const employeeData = {
      ...employee,
      name,
      email,
      payType,
      payRate: parseFloat(payRate) || 0
    };
    onSave(employeeData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="payType">Pay Type</label>
            <Select value={payType} onValueChange={setPayType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="payRate">Pay Rate</label>
            <Input id="payRate" type="number" value={payRate} onChange={(e) => setPayRate(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
