'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '../../ui/components/input';
import { Button } from '../../ui/components/button';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [payType, setPayType] = useState('hourly');
  const [payRate, setPayRate] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < 8 || password.length > 20) {
      setErrorMessage('Password must be between 8 and 20 characters long');
      return;
    }
    const value = event.target.value;
    const numericValue = value ? parseFloat(value) : 0;
    setPayRate(numericValue);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          name,
          email,
          password,
          payRate,
          payType,
        },
      );
      setSuccessMessage('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 1000); // Redirige después de 3 segundos
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your information to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {errorMessage && (
            <div className="text-center text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <Input
            type="text"
            placeholder="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <select
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="hourly">Hourly</option>
              <option value="salary">Salary</option>
            </select>
          </div>
          <Input
            type="number"
            value={payRate}
            onChange={(e) => setPayRate(parseFloat(e.target.value) || 0)}
          />

          <Button type="submit">Create Account</Button>
          <div className="text-center text-sm text-gray-500">
            Already have an account?
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {' '}
              Log in{' '}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
