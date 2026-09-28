"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { msalInstance } from "@/providers/auth-provider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + Math.random() * 10));
    }, 150);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    msalInstance.handleRedirectPromise().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
          router.replace("/login");
          return;
        }

        // Définit le compte actif si pas déjà défini
        if (!msalInstance.getActiveAccount()) {
          msalInstance.setActiveAccount(accounts[0]);
        }
        
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    })
    .catch((error) => {
      console.error("Erreur d'authentification:", error);
      router.replace("/login");
    });
  }, [router]);

  if (loading) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="relative">
          <svg width="150" height="150" className="transform -rotate-90">
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#1a1a6e"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}