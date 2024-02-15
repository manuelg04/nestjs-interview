/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from "../../ui/components/button";
import { Input } from "../../ui/components/input";
import { useState } from 'react';

export function CustomerDialog({ isOpen, onSave, onClose, customer }) {
  const [name, setName] = useState(customer ? customer.name : '');
  const [email, setEmail] = useState(customer ? customer.email : '');
  const [role, setRole] = useState(customer ? customer.role : 'CUSTOMER');

  const handleSave = (event) => {
    event.preventDefault();
    const employeeData = {
      ...customer,
      name,
      email,
      role,
    };
    onSave(employeeData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name">Business Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
