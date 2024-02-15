'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@ocmi/frontend/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ocmi/frontend/ui/components/table';
import { CustomerDialog } from '../helpers/createCustomerModal';
import { Customer } from '../entities/customer';

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer>([]);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/getAllCustomers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers', error.stack);
    }
  };

  const openCustomerDialog = () => setIsCustomerDialogOpen(true);
  const closeCustomerDialog = () => setIsCustomerDialogOpen(false);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    openCustomerDialog();
  };

  const handleCustomerSaved = async (customerData) => {
    if (customerData.id) {
      await handleEdit(customerData);
    } else {
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:3000/api/users/create-admin-user', customerData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        loadCustomers();
        closeCustomerDialog();
      } catch (error) {
        console.error('Error creating customer', error);
      }
    }
  };

  const handleEdit = async (customerData) => {

    const token = localStorage.getItem('token');
    const email = customerData.email;
    const name = customerData.name;
    try {
      await axios.put(`http://localhost:3000/api/users/editCustomer/${customerData.id}`,
        { name, email }
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadCustomers();
      closeCustomerDialog();
    } catch (error) {
      console.error('Error updating customer', error);
    }
  };


  return (
    <div className="border rounded-lg">
      <div className="flex justify-end p-4">
        <Button onClick={() => handleEditClick(null)}>Add Customer</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer:Customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell className="flex gap-2">
                <Button onClick={() => handleEditClick(customer)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isCustomerDialogOpen && (
        <CustomerDialog
          isOpen={isCustomerDialogOpen}
          onClose={closeCustomerDialog}
          onSave={handleCustomerSaved}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}
