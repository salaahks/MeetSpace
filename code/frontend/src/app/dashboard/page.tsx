"use client";

import { useMsal } from "@azure/msal-react";
import Link from "next/link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConstructionIcon from "@mui/icons-material/Construction";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";



function UnderConstruction({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
      <ConstructionIcon style={{ fontSize: 48 }} className="text-yellow-400" />
      <p className="text-sm font-medium">{label} — en cours de construction</p>
    </div>
  );
}

export default function DashboardPage() {
  const { accounts } = useMsal();
  const name = accounts[0]?.name?.split(" ")[0] || "Utilisateur";

  return (
    <div className="max-w-5xl mx-auto">

      {/* Greeting + CTA */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bonjour, {name}</h2>
          <p className="text-gray-400 mt-1 text-sm">
            Prête pour vos réunions d&apos;aujourd&apos;hui ?
          </p>
        </div>
        <Link
          href="/reservations/new"
          className="flex items-center gap-2 bg-[#1a1a6e] hover:bg-[#13136b] text-white text-sm font-medium px-5 py-3 rounded-xl shadow transition"
        >
          <AddCircleOutlineIcon style={{ fontSize: 20 }} />
          Réserver une salle
        </Link>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Mes réservations du jour */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <CalendarTodayIcon style={{ fontSize: 18 }} className="text-blue-500" />
              Mes réservations du jour
            </div>
            <button className="text-xs text-blue-600 font-medium hover:underline">
              Voir tout
            </button>
          </div>
          <UnderConstruction label="Mes réservations du jour" />
        </div>

        {/* Calendrier hebdo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-semibold text-sm">Calendrier hebdo</span>
            <div className="flex items-center gap-1 text-gray-400">
              <button className="hover:text-gray-600 transition">
                <ChevronLeftIcon style={{ fontSize: 18 }} />
              </button>
              <button className="hover:text-gray-600 transition">
                <ChevronRightIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
          <UnderConstruction label="Calendrier" />
        </div>
      </div>

      {/* Salles disponibles maintenant */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Salles disponibles maintenant</h3>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6" />
            </svg>
          </button>
        </div>
        <UnderConstruction label="Salles disponibles" />
      </div>
    </div>
  );
}
