import type { Metadata } from 'next';
import MyListingsList from '@/components/account/MyListingsList';

export const metadata: Metadata = { title: 'My listings' };

export default function MyListingsPage() {
  return (
    <>
      <h1 className="h2 mb-4">My listings</h1>
      <MyListingsList />
    </>
  );
}
