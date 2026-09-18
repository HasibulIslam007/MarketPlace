"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && (!user || user.role !== "admin")) {
      router.push(user ? "/" : "/login?redirect=%2Fadmin");
    }
  }, [isReady, user, router]);

  if (!isReady || !user || user.role !== "admin") {
    return <p className="px-4 py-8">Checking access...</p>;
  }

  return <>{children}</>;
}