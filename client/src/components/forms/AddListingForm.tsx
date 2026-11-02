'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FormField from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useImagePreview } from '@/hooks/useImagePreview';
import { EMOTIONS } from '@/data/site';
import type { Validators } from '@/hooks/useForm';
import { compose, email, phone, required } from '@/lib/validators';

type AddListingValues = {
  contactName: string;
  contactNo: string;
  email: string;
  address: string;
  emotion: string;
  tagline: string;
  image: File | null;
  description: string;
};

const validators: Validators<AddListingValues> = {
  contactName: required('Contact person name'),
  contactNo: compose(required('Contact no'), phone),
  email: compose(required('Email'), email),
  address: required('Address'),
  emotion: required('Emotion'),
  tagline: required('Tag line'),
  image: (v) => (v ? '' : 'Image is required'),
  description: required('Description'),
};

const initial: AddListingValues = { contactName: '', contactNo: '', email: '', address: '', emotion: '', tagline: '', image: null, description: '' };

export default function AddListingForm() {
  const router = useRouter();
  const { values, errors, submitting, handleChange, handleSubmit } = useForm<AddListingValues>(initial, validators);
  const preview = useImagePreview(values.image);

  const onSubmit = handleSubmit(async () => {
    // TODO: POST to your API (use FormData for the image)
    router.push('/my-listings');
  });

  return (
    <form onSubmit={onSubmit} noValidate className="row g-4">
      <FormField className="col-md-6" label="Contact Person Name" name="contactName" required value={values.contactName} onChange={handleChange} error={errors.contactName} />
      <FormField className="col-md-6" label="Contact No" name="contactNo" required value={values.contactNo} onChange={handleChange} error={errors.contactNo} />
      <FormField className="col-md-6" label="Email ID" name="email" type="email" required value={values.email} onChange={handleChange} error={errors.email} />
      <FormField className="col-md-6" label="Address" name="address" required value={values.address} onChange={handleChange} error={errors.address} />
      <FormField className="col-md-6" label="Select Emotions" name="emotion" as="select" required value={values.emotion} onChange={handleChange} error={errors.emotion}>
        <option value="">Emotions</option>
        {EMOTIONS.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
      </FormField>
      <FormField className="col-md-6" label="Add Tag Line" name="tagline" required value={values.tagline} onChange={handleChange} error={errors.tagline} />
      <FormField className="col-md-6" label="Upload Image File" name="image" type="file" accept="image/*" required onChange={handleChange} error={errors.image} />
      <div className="col-md-6">
        <label className="form-label">Image Preview <span className="text-danger">*</span></label>
        <div className="border rounded-3 d-grid place-items-center position-relative overflow-hidden" style={{ height: 120 }}>
          {preview ? <Image src={preview} alt="Preview" fill unoptimized style={{ objectFit: 'contain' }} /> : <span className="text-body-secondary small m-auto">No image selected</span>}
        </div>
      </div>
      <FormField className="col-12" label="Add Decription" name="description" as="textarea" rows={5} required value={values.description} onChange={handleChange} error={errors.description} />
      <div className="col-12">
        <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5" disabled={submitting}>Submit</button>
      </div>
    </form>
  );
}
