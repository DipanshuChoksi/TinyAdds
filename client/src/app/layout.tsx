import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "TinyAdds – Get daily thing in same platform",
  description: "TinyAdds: a classified listing website and marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`.lb-loader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Preloader />
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <BootstrapClient />
      </body>
    </html>
  );
}
