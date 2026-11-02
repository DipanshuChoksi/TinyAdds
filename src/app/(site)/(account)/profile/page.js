import Image from 'next/image';
import Link from 'next/link';
import { USER } from '@/data/site';

export const metadata = { title: 'My profile' };

export default function ProfilePage() {
  return (
    <>
      <h1 className="h2 mb-4">My profile</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex flex-column flex-md-row gap-4">
          <Image src={USER.avatarLg} alt={USER.name} width={120} height={120} className="rounded-circle align-self-start" />
          <div>
            <h2 className="h4">{USER.name}</h2>
            <ul className="list-unstyled text-body-secondary">
              <li><i className="bi bi-envelope me-2" />{USER.email}</li>
              <li><i className="bi bi-telephone me-2" />{USER.phone}</li>
              <li><i className="bi bi-geo-alt me-2" />{USER.address}</li>
            </ul>
            <p>{USER.bio}</p>
            <Link href="/profile/edit" className="btn btn-outline-primary rounded-pill">Edit profile</Link>
          </div>
        </div>
      </div>

      <h2 className="h4 mb-3">Need help?</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-3">
            <h3 className="h6"><a href="#!">Join a Finder property club</a></h3>
            <p className="mb-0 text-body-secondary">Join your local Host Club to connect with your hosting community both online and through in-person or virtual meetups.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-3">
            <h3 className="h6"><a href="#!">Get professional support</a></h3>
            <p className="mb-0 text-body-secondary">I&apos;m your virtual assistant from the Help Center, ready to assist you in finding the information and resources you&apos;re looking for.</p>
          </div>
        </div>
      </div>
    </>
  );
}
