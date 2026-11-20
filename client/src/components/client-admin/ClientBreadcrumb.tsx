"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/client-admin": "Dashboard",
  "/client-admin/profile": "Profile",
  "/client-admin/add-post": "Add Post",
  "/client-admin/view-post": "View Post",
};

export default function ClientBreadcrumb() {
  const pathname = usePathname();

  // Find exact match or match base path
  const currentTitle =
    ROUTE_TITLES[pathname] ||
    Object.entries(ROUTE_TITLES).find(([route]) => route !== "/client-admin" && pathname.startsWith(route))?.[1] ||
    "My Account";

  return (
    <nav aria-label="breadcrumb" className="lb-ca-crumbs">
      <Link className="nav-link fw-bold" href="/">
        Home
      </Link>
      <i className="bi bi-chevron-right" aria-hidden="true" />
      <span>{currentTitle}</span>
    </nav>
  );
}
