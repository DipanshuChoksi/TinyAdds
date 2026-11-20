"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_MENU } from "@/data/clientAdmin";
import { useConfirm, useToast } from "@/components/ui/UiProvider";
import http from "@/lib/http";
import { useUserStore } from "@/store/userStore";

export default function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Logout",
      message: "Are you sure want to logout ?",
      icon: "bi-box-arrow-left",
      variant: "primary",
      confirmText: "Logout",
      cancelText: "Cancel",
    });
    if (!ok) return;
    try {
      await http.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log out");
    } finally {
      clearUser();
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <nav className="lb-ca-menu" aria-label="Account menu">
      {CLIENT_MENU.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={`lb-ca-menu-item${pathname === item.href ? " active" : ""}`}>
            {item.label}
          </Link>
        ) : (
          <button key={item.label} type="button" className="lb-ca-menu-item">{item.label}</button>
        ),
      )}
      <button type="button" className="lb-ca-menu-item" onClick={handleLogout}>Logout</button>
    </nav>
  );
}
