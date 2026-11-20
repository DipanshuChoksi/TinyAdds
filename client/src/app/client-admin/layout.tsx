import type { ReactNode } from "react";
import ClientSidebar from "@/components/client-admin/ClientSidebar";
import ClientAdminGuard from "@/components/client-admin/ClientAdminGuard";
import ClientBreadcrumb from "@/components/client-admin/ClientBreadcrumb";

export const metadata = {
  title: "My Account",
  description: "Manage your TinyAdds account, listings, profile, and subscription settings.",
  robots: { index: false, follow: false },
};

export default function ClientAdminLayout({ children }: { children: ReactNode }) {
  return (
    <ClientAdminGuard>
    <main className="lb-ca">
      <div className="container">
        <ClientBreadcrumb />
        <div className="row g-4">
          <aside className="col-lg-3 lb-ca-side"><ClientSidebar /></aside>
          <section className="col-lg-9">{children}</section>
        </div>
      </div>
    </main>
    </ClientAdminGuard>
  );
}
