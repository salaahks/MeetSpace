"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { msalInstance } from "@/providers/auth-provider";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}