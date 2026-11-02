import type { Metadata } from 'next';
import RegisterForm from '@/components/forms/RegisterForm';

export const metadata: Metadata = { title: 'Register' };

export default function RegisterPage() {
  return <RegisterForm />;
}
