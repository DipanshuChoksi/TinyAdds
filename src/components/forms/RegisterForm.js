'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/context/AuthContext';
import { compose, email, minLength, required } from '@/lib/validators';

const validators = {
  name: required('Name'),
  email: compose(required('Email'), email),
  password: compose(required('Password'), minLength(8)),
  confirm: (v, all) => (v !== all.password ? 'Passwords do not match.' : ''),
};

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { values, errors, submitting, handleChange, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirm: '', remember: false },
    validators
  );

  const onSubmit = handleSubmit(async () => {
    // TODO: call your real registration API here
    login();
    router.push('/');
  });

  return (
    <>
      <h1 className="h2 mb-4">Welcome To TinyAdds</h1>
      <form onSubmit={onSubmit} noValidate className="d-grid gap-3">
        <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <FormField label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={handleChange} error={errors.confirm} autoComplete="new-password" />
        <div className="form-check">
          <input id="remember" name="remember" type="checkbox" className="form-check-input" checked={values.remember} onChange={handleChange} />
          <label htmlFor="remember" className="form-check-label">Remember for 30 days</label>
        </div>
        <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={submitting}>Registration Now</button>
        <p className="text-center mb-0">Already have an account? <Link href="/login">Sign in</Link></p>
      </form>
    </>
  );
}
