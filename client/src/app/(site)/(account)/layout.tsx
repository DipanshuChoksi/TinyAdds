import AccountSidebar from '@/components/account/AccountSidebar';

import type { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-3"><AccountSidebar /></div>
        <div className="col-lg-9">{children}</div>
      </div>
    </div>
  );
}
