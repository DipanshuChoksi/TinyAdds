import type { Metadata } from 'next';
import EditProfileForms from '@/components/forms/EditProfileForms';

export const metadata: Metadata = { title: 'Account settings' };

export default function EditProfilePage() {
  return <EditProfileForms />;
}
