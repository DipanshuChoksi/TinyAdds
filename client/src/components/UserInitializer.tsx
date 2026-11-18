"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useUserStore } from "@/store/userStore";

interface Props {
  children: ReactNode;
}

export default function UserInitializer({ children }: Props) {
  const initialized = useUserStore((s) => s.initialized);
  const fetchUser = useUserStore((s) => s.fetchUser);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!initialized && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchUser();
    }
  }, [initialized, fetchUser]);

  return <>{children}</>;
}
