import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import { SITE } from '@/data/site';

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-lg-6 d-flex flex-column p-4 p-md-5">
          <Logo />
          <div className="my-auto mx-auto w-100" style={{ maxWidth: 440 }}>{children}</div>
          <p className="small text-body-secondary mb-0">
            © All rights reserved. Made by <a href={SITE.copyrightUrl}>{SITE.copyright}</a>
          </p>
        </div>
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <Image src="/assets/img/account/account-cover.png" alt="" fill priority sizes="50vw" style={{ objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
