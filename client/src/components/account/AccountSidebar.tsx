'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER } from '@/data/site';

const LINKS = [
  { href: '/profile', label: 'My profile', icon: 'bi-person' },
  { href: '/my-listings', label: 'My listings', icon: 'bi-card-list' },
  { href: '/add-listing', label: 'Add Post', icon: 'bi-plus-circle' },
  { href: '#!', label: 'Help center', icon: 'bi-question-circle' },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const user = USER;

  const signOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Image src={user.avatar} alt={user.name} width={56} height={56} className="rounded-circle" />
          <div className="overflow-hidden">
            <h2 className="h6 mb-0">{user.name}</h2>
            <small className="text-body-secondary text-truncate d-block">{user.email}</small>
          </div>
        </div>
        <nav className="nav flex-column gap-1">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={`nav-link rounded-3 ${pathname === l.href ? 'active bg-primary-subtle text-primary' : 'text-body'}`}>
              <i className={`bi ${l.icon} me-2`} />{l.label}
            </Link>
          ))}
          <button type="button" onClick={signOut} className="nav-link text-start text-danger bg-transparent border-0">
            <i className="bi bi-box-arrow-right me-2" />Sign out
          </button>
        </nav>
      </div>
    </aside>
  );
}
