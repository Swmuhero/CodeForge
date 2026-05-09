"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.push("/login");
    }
  }, [ready, router, user]);

  if (!ready) {
    return <div className="py-12 text-center text-muted">Loading session...</div>;
  }

  if (!user) {
    return <div className="py-12 text-center text-muted">Redirecting...</div>;
  }

  return <>{children}</>;
}
