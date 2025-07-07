"use client";

import useGuard from "@/hooks/useGuard";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { verified } = useGuard();

  useEffect(() => {
    if (verified === false) {
      router.push("/signin");
      return;
    }
  }, [verified, router]);

  if(verified === null) return null;

  return <>{children}</>;
}
