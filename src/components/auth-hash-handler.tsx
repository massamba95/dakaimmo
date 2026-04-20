"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error_code=otp_expired") || hash.includes("error=access_denied")) {
      router.replace("/forgot-password?error=expired");
    }
  }, [router]);

  return null;
}
