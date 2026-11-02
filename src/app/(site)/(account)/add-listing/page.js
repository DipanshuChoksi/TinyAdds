import AddListingForm from '@/components/forms/AddListingForm';

export const metadata = { title: 'Add Post' };

export default function AddListingPage() {
  return (
    <>
      <h1 className="h2 mb-4">Add Detail</h1>
      <AddListingForm />
    </>
  );
}
