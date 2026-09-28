"use client";

import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "@/utils/msalConfig";
import { APP_NAME, APP_VERSION } from "@/utils/constants";

export default function LoginPage() {
  const { instance, inProgress } = useMsal();

  const handleLogin = () => {
    if (inProgress !== InteractionStatus.None) return;
    instance.loginRedirect({
    ...loginRequest,
    prompt: "select_account",
    redirectStartPage: "/dashboard", //  redirection après login
  });
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#12112e]">
      {/* Formes géométriques gauche */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -left-20 top-0 h-full w-[55%]"
          style={{
            background: "linear-gradient(135deg, #6c3fa0 0%, #c2185b 60%, #ff6b9d 100%)",
            clipPath: "polygon(0 0, 75% 0, 55% 100%, 0 100%)",
            opacity: 0.85,
          }}
        />
        <div
          className="absolute -left-10 top-0 h-full w-[45%]"
          style={{
            background: "linear-gradient(135deg, #8e44ad 0%, #d81b60 100%)",
            clipPath: "polygon(0 0, 65% 0, 45% 100%, 0 100%)",
            opacity: 0.6,
          }}
        />
        <div
          className="absolute -left-5 top-0 h-full w-[30%]"
          style={{
            background: "linear-gradient(135deg, #4a1a6e 0%, #9c0045 100%)",
            clipPath: "polygon(0 0, 80% 0, 60% 100%, 0 100%)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Carte login */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl px-10 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-3xl font-bold text-[#12112e]">Meet</span>
            <span className="text-3xl font-bold text-[#2563eb] italic">Space</span>
          </div>
          <span className="text-sm text-gray-500 tracking-wide">Gestion des Salles</span>
        </div>

        {/* Titre */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-gray-500 mb-1">Bienvenue</p>
          <h1 className="text-2xl font-bold text-[#12112e] leading-tight">
            Connectez-vous à votre espace réservation
          </h1>
        </div>

        {/* Bouton Microsoft */}
        <button
          onClick={handleLogin}
          disabled={inProgress !== InteractionStatus.None}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-[#12112e] text-white font-semibold py-3 text-sm tracking-wide hover:bg-[#1e1c47] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Logo Microsoft */}
          <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Se connecter avec Microsoft
        </button>

        {/* Info SSO */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Authentification via Microsoft Entra ID
        </p>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-[#2563eb]">
          {APP_NAME} v{APP_VERSION}
        </p>
      </div>
    </div>
  );
}