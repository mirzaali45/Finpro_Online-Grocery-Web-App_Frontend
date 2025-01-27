"use client"

import { useRouter } from 'next/navigation';
import LoginForm from '@/components/loginSuperAdmin';
import { loginUser } from '@/services/auth.service';
import type { LoginFormValues } from '@/types/login-types';

export default function SuperAdminLogin() {
  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginUser(values);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Verify role and redirect
      if (response.user.role === 'SUPER_ADMIN') {
        router.push('/dashboard');
      } else {
        throw new Error('Unauthorized access. Super Admin only.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
}