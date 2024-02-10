'use client';
import Link from 'next/link';
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
import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [isEmployeeDialogOpen, setEmployeeDialogOpen] = useState(false);

  const openEmployeeDialog = () => setEmployeeDialogOpen(true);
  const closeEmployeeDialog = () => setEmployeeDialogOpen(false);

  const handleSaveEmployee = async (employeeData) => {
    try {
      // Make the API call to save the new employee
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name: employeeData.name,
        email: employeeData.email,
        payType: employeeData.payType,
        payRate: parseFloat(employeeData.payRate),
      });
      console.log('Employee saved:', response.data);
      closeEmployeeDialog();

    } catch (error) {
      console.error('Error saving employee:', error.response?.data || error.message);
    }
  };


  return (
    <div className="flex flex-col h-screen min-h-screen">
      <header className="flex h-14 items-center border-b px-4 md:px-6">
        <Link className="mr-6" href="#">
          <Package2Icon className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden lg:flex flex-1 items-center gap-4 text-sm font-medium">
          <Link className="font-semibold" href="#">
            Employee Management
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Timesheet Management
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4 lg:gap-8">
          <Button
            className="rounded-full border w-8 h-8"
            size="icon"
            variant="ghost"
          >
            <Image
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: '32/32',
                objectFit: 'cover',
              }}
              width="32"
            />
            <span className="sr-only">View profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">
            Employee Management
          </h1>
          <Button className="ml-auto" size="sm" onClick={openEmployeeDialog}>
            Add employee
          </Button>
        </div>
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
              <TableRow className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                <TableCell className="font-semibold">Alice Johnson</TableCell>
                <TableCell>Hourly</TableCell>
                <TableCell>$15.00</TableCell>
                <TableCell className="flex gap-2 min-w-[100px]">
                  <Button className="h-8 w-8" size="icon">
                    <FileEditIcon className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button className="h-8 w-8" size="icon">
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                <TableCell className="font-semibold">Bob Smith</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>$50,000.00</TableCell>
                <TableCell className="flex gap-2 min-w-[100px]">
                  <Button className="h-8 w-8" size="icon">
                    <FileEditIcon className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button className="h-8 w-8" size="icon">
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                <TableCell className="font-semibold">Eve Williams</TableCell>
                <TableCell>Hourly</TableCell>
                <TableCell>$20.00</TableCell>
                <TableCell className="flex gap-2 min-w-[100px]">
                  <Button className="h-8 w-8" size="icon">
                    <FileEditIcon className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button className="h-8 w-8" size="icon">
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
      {isEmployeeDialogOpen && (
        <EmployeeDialog
          isOpen={isEmployeeDialogOpen}
          onSave={handleSaveEmployee}
          onClose={closeEmployeeDialog}
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

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
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
