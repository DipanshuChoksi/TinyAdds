import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
