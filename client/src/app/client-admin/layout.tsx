import Link from "next/link";
import type { ReactNode } from "react";
import ClientSidebar from "@/components/client-admin/ClientSidebar";

export default function ClientAdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="lb-ca">
      <div className="container">
        <nav aria-label="breadcrumb" className="lb-ca-crumbs">
          <Link className="nav-link fw-bold" href="/">Home</Link><i className="bi bi-chevron-right"></i><span>My Account</span>
        </nav>
        <div className="row g-4">
          <aside className="col-lg-3 lb-ca-side"><ClientSidebar /></aside>
          <section className="col-lg-9">{children}</section>
        </div>
      </div>
    </main>
  );
}
