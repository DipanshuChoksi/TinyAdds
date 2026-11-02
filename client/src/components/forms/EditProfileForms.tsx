'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { DEVICES, LANGUAGES, USER } from '@/data/site';
import type { Device } from '@/types';
import type { Validators } from '@/hooks/useForm';
import { compose, email, minLength, phone, required } from '@/lib/validators';

type PersonalValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  dob: string;
  address: string;
  bio: string;
};

type PasswordValues = { current: string; next: string; confirm: string };

const personalValidators: Validators<PersonalValues> = {
  firstName: required('First name'),
  lastName: required('Last name'),
  email: compose(required('Email'), email),
  phone: compose(required('Phone number'), phone),
  address: required('Address'),
};

const passwordValidators: Validators<PasswordValues> = {
  current: required('Current password'),
  next: compose(required('New password'), minLength(8)),
  confirm: (v, all) => (v !== all.next ? 'Passwords do not match.' : ''),
};

function PersonalInfo() {
  const router = useRouter();
  const { values, errors, handleChange, handleSubmit, submitting } = useForm<PersonalValues>(
    { firstName: USER.firstName, lastName: USER.lastName, email: USER.email, phone: USER.phone, language: '', dob: '', address: USER.address, bio: USER.bio },
    personalValidators
  );
  const onSubmit = handleSubmit(async () => { /* TODO: PATCH /api/profile */ router.push('/profile'); });

  return (
    <form onSubmit={onSubmit} noValidate className="row g-4">
      <div className="col-12 d-flex align-items-center gap-3">
        <Image src={USER.avatarLg} alt="" width={96} height={96} className="rounded-circle" />
        <div>
          <p className="small text-body-secondary mb-2">Your profile photo will appear on your profile and directory listing. PNG or JPG no bigger than 1000px wide and tall.</p>
          <button type="button" className="btn btn-outline-primary btn-sm rounded-pill">Update photo</button>
        </div>
      </div>
      <FormField className="col-md-6" label="First name" name="firstName" required value={values.firstName} onChange={handleChange} error={errors.firstName} />
      <FormField className="col-md-6" label="Last name" name="lastName" required value={values.lastName} onChange={handleChange} error={errors.lastName} />
      <FormField className="col-md-6" label="Email address" name="email" type="email" required value={values.email} onChange={handleChange} error={errors.email} />
      <FormField className="col-md-6" label="Phone number" name="phone" required value={values.phone} onChange={handleChange} error={errors.phone} />
      <FormField className="col-md-6" label="Languages you speak" name="language" as="select" value={values.language} onChange={handleChange}>
        <option value="">Select language</option>
        {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
      </FormField>
      <FormField className="col-md-6" label="Date of birth" name="dob" type="date" value={values.dob} onChange={handleChange} />
      <FormField className="col-12" label="Address" name="address" required value={values.address} onChange={handleChange} error={errors.address} />
      <FormField className="col-12" label="Information about you" name="bio" as="textarea" rows={4} value={values.bio} onChange={handleChange} />
      <div className="col-12 d-flex gap-3">
        <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => router.push('/profile')}>Cancel</button>
        <button type="submit" className="btn btn-primary rounded-pill" disabled={submitting}>Save changes</button>
      </div>
    </form>
  );
}

function PasswordSecurity() {
  const { values, errors, handleChange, handleSubmit, reset, submitting } = useForm<PasswordValues>({ current: '', next: '', confirm: '' }, passwordValidators);
  const [devices, setDevices] = useState<Device[]>(DEVICES);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const onSubmit = handleSubmit(async () => { /* TODO: POST /api/password */ reset(); });

  return (
    <>
      <p className="text-body-secondary">Your current email address is <strong>{USER.email}</strong></p>
      <form onSubmit={onSubmit} noValidate className="row g-4 mb-5">
        <FormField className="col-12" label="Current password" name="current" type="password" value={values.current} onChange={handleChange} error={errors.current} />
        <FormField className="col-md-6" label="New password (Min 8 chars)" name="next" type="password" value={values.next} onChange={handleChange} error={errors.next} />
        <FormField className="col-md-6" label="Confirm new password" name="confirm" type="password" value={values.confirm} onChange={handleChange} error={errors.confirm} />
        <div className="col-12 d-flex gap-3">
          <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={reset}>Cancel</button>
          <button type="submit" className="btn btn-primary rounded-pill" disabled={submitting}>Update password</button>
        </div>
      </form>

      <h3 className="h5">Device history</h3>
      <ul className="list-group mb-3">
        {devices.map((d) => (
          <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h4 className="h6 mb-0">{d.name}</h4>
              <small className="text-body-secondary">{d.meta} {d.status}</small>
            </div>
            <button className="btn btn-link text-danger" onClick={() => setDevices((l) => l.filter((x) => x.id !== d.id))}>Sign out</button>
          </li>
        ))}
      </ul>
      <button className="btn btn-link p-0 mb-5" onClick={() => setDevices([])}>Sign out of all sessions</button>

      <h3 className="h5 text-danger">Delete account</h3>
      <p className="text-body-secondary">When you delete your account, your public profile will be deactivated immediately. If you change your mind before the 14 days are up, sign in with your email and password, and we&apos;ll send a link to reactivate account.</p>
      <div className="form-check mb-3">
        <input id="confirm-delete" type="checkbox" className="form-check-input" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} />
        <label htmlFor="confirm-delete" className="form-check-label">Yes, I want to delete my account</label>
      </div>
      <button className="btn btn-danger rounded-pill" disabled={!confirmDelete}>Delete account</button>
    </>
  );
}

export default function EditProfileForms() {
  const [tab, setTab] = useState<'personal' | 'security'>('personal');
  return (
    <>
      <h1 className="h2 mb-4">Account settings</h1>
      <ul className="nav nav-tabs mb-4" role="tablist">
        {([['personal', 'Personal info'], ['security', 'Password and security']] as const).map(([key, label]) => (
          <li className="nav-item" key={key} role="presentation">
            <button role="tab" aria-selected={tab === key} className={`nav-link ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
          </li>
        ))}
      </ul>
      {tab === 'personal' ? <PersonalInfo /> : <PasswordSecurity />}
    </>
  );
}
