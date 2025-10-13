"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import STORAGE_KEYS from "@/constants/storageKeys";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
          router.replace("/");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/system`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );

        if (!res.ok && (res.status === 401 || res.status === 403)) {
          router.replace("/");
          return;
        }

        if (!cancelled) setAllowed(true);
      } catch {
        router.replace("/");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}

