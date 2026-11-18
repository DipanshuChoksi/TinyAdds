"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

type Props = { children: ReactNode };

export default function ClientAdminGuard({ children }: Props) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);
  const initialized = useUserStore((s) => s.initialized);
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    if (!initialized && !loading) {
      fetchUser();
    }
  }, [initialized, loading, fetchUser]);

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace("/login");
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading || !user) {
    return <main className="container py-5 text-center">Checking account...</main>;
  }

  return <>{children}</>;
}
