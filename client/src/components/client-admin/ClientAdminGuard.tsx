"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import http from "@/lib/http";

type Props = { children: ReactNode };

export default function ClientAdminGuard({ children }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    http.get("/auth/me").then(() => {
      if (mounted) setAuthorized(true);
    }).catch(() => {
      router.replace("/login");
    }).finally(() => {
      if (mounted) setChecking(false);
    });
    return () => { mounted = false; };
  }, [router]);

  if (checking || !authorized) return <main className="container py-5 text-center">Checking account...</main>;
  return children;
}
