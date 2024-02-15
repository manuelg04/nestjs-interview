'use client';
import { Button } from '../../ui/components/button';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '../../ui/components/table';
import Image from 'next/image';
import { EmployeeDialog } from '../helpers/createEmployeeModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Employee } from '../entities/employee';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import TimesheetManagement from '../timesheet/timesheet';
import CustomersTable from '../customers/page';

export default function Dashboard() {
  const [isEmployeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  const openEmployeeDialog = () => setEmployeeDialogOpen(true);
  const closeEmployeeDialog = () => setEmployeeDialogOpen(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(
        'Error fetching employees:',
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    openEmployeeDialog();
  };

  const handleSaveEmployee = async (employeeData: Employee) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token is not available');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/api/employees',
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        Swal.fire({
          title: 'Its done!',
          text: 'Employee created successfully.',
          icon: 'success',
        });

        fetchEmployees();
      }
      closeEmployeeDialog();
    } catch (error) {
     Swal.fire({
        title: 'Error!',
        text: error.response?.data.message || error.message,
        icon: 'error',
      });
    }
  };

  const handleEditEmployee = async (employee: Employee) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token is not available');
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/employees/${selectedEmployee?.id}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        Swal.fire({
          title: 'Its done!',
          text: 'Employee updated successfully.',
          icon: 'success',
        });

        fetchEmployees();
      }

      closeEmployeeDialog();
      setSelectedEmployee(null);
    } catch (error) {
      console.error(
        'Error updating employee:',
        error.response?.data || error.message,
      );
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token is not available');
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        Swal.fire({
          title: 'Its done!',
          text: 'Employee deleted successfully.',
          icon: 'success',
        });
      }
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
    } catch (error) {
      console.error(
        'Error deleting employee:',
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="flex flex-col h-screen min-h-screen">
      <header className="flex h-14 items-center border-b px-4 md:px-6">
        <Button className="mr-6" onClick={handleLogout} variant={'outline'}>
          <LogoutIcon className="h-6 w-6" />
          <span className="sr-only">Logout</span>
        </Button>
        <nav className="hidden lg:flex flex-1 items-center gap-4 text-sm font-medium">
          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => handleTabChange('timesheets')}
                className={`font-semibold ${activeTab === 'timesheets' ? 'text-blue-500' : 'text-gray-500'}`}
              >
                Timesheet Management
              </button>
              <button
                onClick={() => handleTabChange('customerManagement')}
                className={`ml-4 font-semibold ${activeTab === 'customerManagement' ? 'text-blue-500' : 'text-gray-500'}`}
              >
                Customer Management
              </button>
            </>
          )}
          {userRole === 'CUSTOMER' && (
            <>
              <button
                onClick={() => handleTabChange('employees')}
                className={`font-semibold ${activeTab === 'employees' ? 'text-blue-500' : 'text-gray-500'}`}
              >
                Employee Management
              </button>
              <button
                onClick={() => handleTabChange('timesheets')}
                className={`ml-4 font-semibold ${activeTab === 'timesheets' ? 'text-blue-500' : 'text-gray-500'}`}
              >
                Timesheet Management
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
      {activeTab === 'customerManagement' && userRole === 'ADMIN' && (
          <div>
          <CustomersTable />
          </div>
        )}
        <div className="flex items-center">
          {activeTab === 'employees' && (
            <Button className="ml-auto" size="sm" onClick={openEmployeeDialog}>
              Add employee
            </Button>
          )}
        </div>
        {activeTab === 'employees' && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Pay Type</TableHead>
                  <TableHead>Pay Rate</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-semibold">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.payType}</TableCell>
                    <TableCell>${employee.payRate.toFixed(2)}</TableCell>
                    <TableCell className="flex gap-2 min-w-[100px]">
                      <Button
                        className="rounded-full w-8 h-8"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditClick(employee)}
                      >
                        <FileEditIcon className="h-6 w-6" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        className="rounded-full w-8 h-8"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <TrashIcon className="h-6 w-6" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {((userRole === 'ADMIN' || userRole === 'CUSTOMER') && activeTab === 'timesheets') && (
            <TimesheetManagement />
        )}
      </main>
      {isEmployeeDialogOpen && (
        <EmployeeDialog
          isOpen={isEmployeeDialogOpen}
          onSave={selectedEmployee ? handleEditEmployee : handleSaveEmployee}
          onClose={closeEmployeeDialog}
          employee={selectedEmployee}
        />
      )}
    </div>
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

function LogoutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5" />
      <polyline points="8 7 3 12 8 17" />
      <line x1="3" y1="12" x2="15" y2="12" />
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
