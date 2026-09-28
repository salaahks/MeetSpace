"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AuthGuard from "@/providers/AuthGuard";
import Sidebar from "@/template/layouts/components/vertical/navigation/Sidebar";
import ConstructionIcon from "@mui/icons-material/Construction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ROUTE_LABELS: Record<string, string> = {
  reservations: "Réservations",
  rooms: "Salles",
  equipment: "Équipements",
  statistics: "Statistiques",
  administration: "Administration",
};

export default function CatchAllPage() {
  const params = useParams();
  const segments = Array.isArray(params.slug) ? params.slug : [params.slug ?? ""];
  const label = ROUTE_LABELS[segments[0]] ?? "Cette page";

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 bg-gray-50 flex items-center justify-center">
          <ConstructionScene label={label} />
        </main>
      </div>
    </AuthGuard>
  );
}

function ConstructionScene({ label }: { label: string }) {
  const rings = [0, 1, 2, 3];

  return (
    <div className="flex flex-col items-center text-center px-8 select-none">
      {/* Ripple animation */}
      <div className="relative flex items-center justify-center mb-14" style={{ width: 240, height: 240 }}>
        {rings.map((i) => (
          <span
            key={i}
            className="ripple-ring absolute rounded-full border-2 border-blue-400"
            style={{
              width: 120,
              height: 120,
              animationDelay: `${i * 0.65}s`,
            }}
          />
        ))}

        {/* Outer glow ring */}
        <div className="absolute w-32 h-32 rounded-full bg-blue-100 opacity-60" />

        {/* Center circle */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl">
          <ConstructionIcon style={{ fontSize: 44, color: "white" }} />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-3xl font-bold text-gray-800 mb-3">{label}</h2>
      <p className="text-lg font-medium text-blue-600 mb-2">En cours de construction</p>
      <p className="text-sm text-gray-400 max-w-sm mb-10">
        Cette section est en cours de développement.<br />
        Elle sera disponible très prochainement.
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: "40%", animation: "none" }}
        />
      </div>

      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a6e] text-white text-sm font-medium hover:bg-indigo-800 transition shadow"
      >
        <ArrowBackIcon style={{ fontSize: 18 }} />
        Retour au tableau de bord
      </Link>
    </div>
  );
}
