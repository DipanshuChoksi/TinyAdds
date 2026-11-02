'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Logo from '@/components/ui/Logo';
import { CATEGORIES } from '@/data/site';
import { useAuth } from '@/context/AuthContext';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DropdownProps { label: ReactNode; children: ReactNode; align?: 'start' | 'end' }

function Dropdown({ label, children, align = 'start' }: DropdownProps) {
  const { isOpen, toggle, close } = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(close);
  return (
    <div ref={ref} className="dropdown position-relative">
      <button type="button" className="nav-link dropdown-toggle bg-transparent border-0" aria-expanded={isOpen} onClick={toggle}>
        {label}
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''} ${align === 'end' ? 'dropdown-menu-end' : ''}`} onClick={close}>
        {children}
      </ul>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const menu = useDisclosure();

  // close the mobile menu after navigating
  useEffect(() => {
    menu.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const linkClass = (href: string) => `nav-link ${pathname === href ? 'active' : ''}`;

  return (
    <header className="navbar navbar-expand-lg bg-body sticky-top border-bottom">
      <div className="container">
        <Logo />

        <button
          className="navbar-toggler ms-auto"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <nav className={`collapse navbar-collapse ${menu.isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto ms-lg-4 align-items-lg-center">
            <li className="nav-item"><Link href="/" className={linkClass('/')}>Home</Link></li>
            <li className="nav-item">
              <Dropdown label="Ads Category">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="dropdown-item">{c.short}</Link>
                  </li>
                ))}
              </Dropdown>
            </li>
            <li className="nav-item"><Link href="/blogs" className={linkClass('/blogs')}>Our Blog</Link></li>
            <li className="nav-item"><Link href="/advertise-with-us" className={linkClass('/advertise-with-us')}>Advertise With Us</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user ? (
              <>
                <Link href="/add-listing" className="btn btn-primary rounded-pill">
                  <i className="bi bi-plus-circle me-2" />Add Post
                </Link>
                <Dropdown
                  align="end"
                  label={<Image src={user.avatarSm} alt={user.name} width={40} height={40} className="rounded-circle" />}
                >
                  <li className="dropdown-header fw-semibold">{user.name}</li>
                  <li><Link href="/profile" className="dropdown-item">My profile</Link></li>
                  <li><Link href="/my-listings" className="dropdown-item">My listings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button type="button" className="dropdown-item" onClick={logout}>Sign out</button></li>
                </Dropdown>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline-dark rounded-pill">Log in</Link>
                <Link href="/add-listing" className="btn btn-primary rounded-pill">Add Post</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
