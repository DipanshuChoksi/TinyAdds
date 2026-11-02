import Image from 'next/image';
import Link from 'next/link';

interface LogoProps { variant?: 'default' | 'footer'; width?: number; height?: number }

export default function Logo({ variant = 'default', width = 150, height = 44 }: LogoProps) {
  const src = variant === 'footer' ? '/assets/img/logo-2.png' : '/assets/img/logo.png';
  return (
    <Link href="/" className="navbar-brand me-0 d-inline-flex align-items-center">
      <Image src={src} alt="Tinyadds" width={width} height={height} priority style={{ height: 'auto', width }} />
    </Link>
  );
}
