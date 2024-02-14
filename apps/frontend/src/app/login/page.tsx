/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Input } from "../../ui/components/input";
import { Button } from "../../ui/components/button";
import Link from "next/link";
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      const decoded = jwtDecode(response.data.result.token);
      localStorage.setItem('token', response.data.result.token);
      localStorage.setItem('role', decoded.role);
      router.push('/dashboard');
    } catch (error) {
      console.error('An error occurred', error);
      setError(error.response?.data?.message || 'An unexpected error occurred');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">
          Enter your email below to login to your account.
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <Link href="/register" className="underline pl-1">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
