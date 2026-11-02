import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
