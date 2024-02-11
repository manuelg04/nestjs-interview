'use client';
import { useState, useEffect } from 'react';
import { Button } from "../../ui/components/button";
import { Input } from "../../ui/components/input";

export function TimesheetDialog({ isOpen, onSave, onClose, employees, timesheet }) {
  const [employeeId, setEmployeeId] = useState('')
  const [hoursWorked, setHoursWorked] = useState(timesheet ? timesheet.hoursWorked.toString() : '');
  const [checkDate, setCheckDate] = useState(timesheet ? timesheet.checkDate : new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!timesheet && employees.length > 0) {
      setEmployeeId(employees[0].id.toString());
    }
  }, [employees, timesheet]);

  const handleSave = async (event) => {
    event.preventDefault();
    const timesheetData = {
      employeeId: parseInt(employeeId, 10),
      hoursWorked: parseFloat(hoursWorked) || 0,
      checkDate
    };
    onSave(timesheetData);
    onClose();

  };


  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{timesheet ? 'Edit Timesheet' : 'Add Timesheet'}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="employeeId">Employee</label>
            <select
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="form-select block w-full mt-1"
              disabled={timesheet !== null}
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hoursWorked">Hours Worked</label>
            <Input id="hoursWorked" type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} />
          </div>
          <div>
            <label htmlFor="checkDate">Check Date</label>
            <Input id="checkDate" type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{timesheet ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
