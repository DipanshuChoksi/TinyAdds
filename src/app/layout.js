import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SITE } from '@/data/site';

export const metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: 'Find the best places to stay, eat, shop, and visit—curated by trusted local experts and partners.',
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
