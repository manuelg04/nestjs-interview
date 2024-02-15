import { use, useEffect, useState } from 'react';
import { Button } from '@ocmi/frontend/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ocmi/frontend/ui/components/table';
import axios from 'axios';
import { TimesheetDialog } from '../helpers/createTimesheetModal';
import { Employee } from '../entities/employee';
import { Timesheet } from '../entities/timeesheet';
import Swal from 'sweetalert2';
import { NotesModal } from '../helpers/writeNotesModal';

export default function TimesheetManagement() {
  const [isTimesheetDialogOpen, setIsTimesheetDialogOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentNotes, setCurrentNotes] = useState('');

  const openTimesheetDialog = () => setIsTimesheetDialogOpen(true);
  const totalGrossWages = timesheets.reduce(
    (acc, timesheet) => acc + timesheet.grossWage,
    0,
  );
  const handleEditClick = (timesheet) => {
    setSelectedTimesheet(timesheet);
    setIsTimesheetDialogOpen(true);
  };

  const openNotesDialog = (timesheet) => {
    setCurrentNotes(timesheet.notes || '');
    setSelectedTimesheet(timesheet.id);
    setIsNotesModalOpen(true);
  };

  const closeTimesheetDialog = () => {
    setIsTimesheetDialogOpen(false);
    setSelectedTimesheet(null);
  };

  const handleSaveTimesheet = async (timesheetData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/timesheets',
        timesheetData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        const employeePayRate =
          employees.find((e) => e.id === timesheetData.employeeId)?.payRate ??
          0;
        const newTimesheetWithEmployeeInfo = {
          ...response.data,
          employeePayRate,
          employeeName:
            employees.find((e) => e.id === timesheetData.employeeId)?.name ??
            'NULL',
        };

        setTimesheets((prevTimesheets) => [
          ...prevTimesheets,
          newTimesheetWithEmployeeInfo,
        ]);
        closeTimesheetDialog();
      }
    } catch (error) {
      console.error('Error al guardar el timesheet:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      console.error('Authentication token is not available');
      return;
    }

    const fetchEmployeesAndTimesheets = async () => {
      try {
        const employeesResponse = await axios.get(
          'http://localhost:3000/api/employees',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setEmployees(employeesResponse.data);
        const timesheetsResponse = await axios.get(
          'http://localhost:3000/api/timesheets',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("🚀 ~ timesheetsResponse:", timesheetsResponse.data)
        const timesheetsData = timesheetsResponse.data;
        const combinedTimesheets = timesheetsData.map((timesheet) => {
          const employee = employeesResponse.data.find(
            (e) => e.id === timesheet.employeeId,
          );
          return {
            ...timesheet,
            employeeName:
              role === 'ADMIN'
                ? timesheet.user?.email ?? 'Unknown'
                : employee?.name ?? 'Unknown',
            employeePayRate:
              role === 'ADMIN'
                ? timesheet.employee?.payRate ?? 0
                : employee?.payRate ?? 0,
          };
        });

        setTimesheets(combinedTimesheets);
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response?.data || error.message,
        );
      }
    };

    fetchEmployeesAndTimesheets();
  }, []);

  const handleDeleteTimesheet = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3000/api/timesheets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setTimesheets(timesheets.filter((timesheet) => timesheet.id !== id));
      }
    } catch (error) {
      console.error(
        'Error deleting timesheet:',
        error.response?.data || error.message,
      );
    }
  };

  const handleUpdateTimesheet = async (timesheet: Timesheet) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      let timesheetData = {};
      if (role === 'ADMIN') {
        timesheetData = { status: timesheet.status, notes: timesheet.notes };
      } else {
        timesheetData = {
          employeeId: timesheet.employeeId,
          hoursWorked: timesheet.hoursWorked,
          checkDate: new Date(timesheet.checkDate).toISOString(),
          status: timesheet.status,
        };
      }

      const response = await axios.patch(
        `http://localhost:3000/api/timesheets/${timesheet.id}`,
        timesheetData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("🚀 ~ response:", response.data)
      if (response.status === 200) {
        const updatedTimesheet = response.data;
        setTimesheets((prevTimesheets) =>
          prevTimesheets.map((t) =>
            t.id === timesheet.id ? { ...t, ...updatedTimesheet } : t,
          ),
        );
        closeTimesheetDialog();
      }
    } catch (error) {
      console.error('Error al actualizar el timesheet:', error);
    }
  };

  const role = localStorage.getItem('role');

  const saveNotes = async (notes) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/timesheets/${selectedTimesheet}`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Notes saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsNotesModalOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to update notes');
    }
  };

  return (
    <div className="border rounded-lg">
      <NotesModal
        isOpen={isNotesModalOpen}
        onSave={saveNotes}
        onClose={() => setIsNotesModalOpen(false)}
        initialNotes={currentNotes}
      />
      <div className="flex justify-end p-4">
        <Button onClick={openTimesheetDialog} disabled={employees.length === 0}>
          Add Timesheet
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Hours Worked</TableHead>
            <TableHead>Pay Rate</TableHead>
            <TableHead>Gross Wage</TableHead>
            <TableHead>Check Date</TableHead>
            <TableHead>Status</TableHead>
            {role === 'ADMIN' && <TableHead>Notes</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow
              key={timesheet.id}
              className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            >
              <TableCell>{timesheet.employeeName}</TableCell>
              <TableCell>{timesheet.hoursWorked}</TableCell>
              <TableCell>${timesheet.employeePayRate?.toFixed(2)}</TableCell>
              <TableCell>${timesheet.grossWage.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(timesheet.checkDate).toLocaleDateString('es-CO', {
                  timeZone: 'UTC',
                })}
              </TableCell>

              <TableCell>{timesheet.status}</TableCell>
              {role === 'ADMIN' && (
              <TableCell>
                {timesheet.notes}
              </TableCell>
            )}
              <TableCell className="flex gap-2 min-w-[100px]">
                <Button
                  className="rounded-full w-8 h-8"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditClick(timesheet)}
                >
                  <FileEditIcon className="h-6 w-6" />
                  <span className="sr-only">Edit</span>
                </Button>
                {role === 'CUSTOMER' && (
        <Button
          className="rounded-full w-8 h-8"
          size="icon"
          variant="ghost"
          onClick={() => handleDeleteTimesheet(timesheet.id)}
        >
          <TrashIcon className="h-6 w-6" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
                {role === 'ADMIN' && (
                  <Button
                    className="rounded-full w-8 h-8"
                    size="icon"
                    variant="ghost"
                    onClick={() => openNotesDialog(timesheet)}
                  >
                    <PencilIcon className="h-6 w-6" />
                    <span className="sr-only">Write Notes</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            {/* Celda vacía para todas las columnas excepto "Gross Wage" y "Actions" */}
            <TableCell colSpan={3}></TableCell>
            {/* Celda para el total de salarios brutos */}
            <TableCell className="text-left pl-1">
              Total Gross Wages: ${totalGrossWages.toFixed(2)}
            </TableCell>
            {/* Celda vacía para la columna "Actions" */}
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {isTimesheetDialogOpen && (
        <TimesheetDialog
          isOpen={isTimesheetDialogOpen}
          onSave={
            selectedTimesheet ? handleUpdateTimesheet : handleSaveTimesheet
          }
          onClose={closeTimesheetDialog}
          timesheet={selectedTimesheet}
          employees={employees}
        />
      )}
    </div>
  );
}

function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.232 2.828a2.828 2.828 0 114 4L7.758 18.302l-4 1 1-4L15.232 2.828z" />
    </svg>
  );
}


function FileEditIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
