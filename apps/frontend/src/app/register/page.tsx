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
    try {
       await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          email,
          password,

        },
      );
      setSuccessMessage('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
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
