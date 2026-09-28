"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import Navigation from "@/app/menu/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { instance } = useMsal();
  const navItems = Navigation();

  // Récupère le compte actif 
  const activeAccount = instance.getActiveAccount() || instance.getAllAccounts()[0];

  // Nom et email de l'utilisateur
  const userName = activeAccount?.name || activeAccount?.username || "Utilisateur";
  const userEmail = activeAccount?.username || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/login",
      });
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1a1a6e] flex items-center justify-center">
            <span className="text-white text-base font-bold">M</span>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">MeetSpace</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Réservation de salles</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon
                fontSize="small"
                className={isActive ? "text-blue-700" : "text-gray-400"}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User info en bas */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          Déconnecter
        </button>
      </div>
    </aside>
  );
}