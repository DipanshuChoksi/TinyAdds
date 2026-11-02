'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormField from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/context/AuthContext';
import { compose, email, required } from '@/lib/validators';

const validators = {
  email: compose(required('Email'), email),
  password: required('Password'),
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { values, errors, submitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '', remember: false },
    validators
  );

  const onSubmit = handleSubmit(async () => {
    // TODO: call your real sign-in API here
    login();
    router.push('/');
  });

  return (
    <>
      <h1 className="h2">Welcome back</h1>
      <p className="mb-4">
        Don&apos;t have an account? <Link href="/register">Create an account</Link>
      </p>
      <form onSubmit={onSubmit} noValidate className="d-grid gap-3">
        <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <div className="d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input id="remember" name="remember" type="checkbox" className="form-check-input" checked={values.remember} onChange={handleChange} />
            <label htmlFor="remember" className="form-check-label">Remember for 30 days</label>
          </div>
          <Link href="#!">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={submitting}>Sign In</button>
        <Link href="#!" className="text-center">Need help?</Link>
      </form>
    </>
  );
}
