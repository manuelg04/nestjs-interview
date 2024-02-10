'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { Input } from '../../ui/components/input';
import { Button } from '../../ui/components/button';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [payType, setPayType] = useState('hourly');
  const [payRate, setPayRate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Validaciones del lado del cliente
    if (password.length < 8 || password.length > 20) {
      setErrorMessage('Password must be between 8 and 20 characters long');
      return;
    }

    const payRateNumber = parseFloat(payRate);
    if (isNaN(payRateNumber) || payRateNumber <= 0) {
      setErrorMessage('Invalid pay rate');
      return;
    }

    // Preparar los datos para la API
    const userData = {
      email,
      password,
      name,
      payType,
      payRate: payRateNumber,
    };

    try {
      // Enviar datos al endpoint de registro
      const response = await axios.post('http://localhost:3000/api/employees', userData);
      console.log(response.data);

      // Redireccionar al usuario al login o dashboard después del registro
      router.push('/login');
    } catch (error) {
      console.error('An error occurred', error);
      setErrorMessage('An error occurred');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleRegister}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={payType} onChange={(e) => setPayType(e.target.value)}>
          <option value="hourly">Hourly</option>
          <option value="salary">Salary</option>
        </select>
        <Input type="text" placeholder="Pay Rate" value={payRate} onChange={(e) => setPayRate(e.target.value)} />
        <Button type="submit">Register</Button>
        <p>
          Already have an account?
          <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
