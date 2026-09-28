"use client";

import { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/utils/msalConfig";

// Instance unique créée en dehors du composant
const msalInstance = new PublicClientApplication(msalConfig);

// Export pour utilisation dans AuthGuard et autres fichiers
export { msalInstance };

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    msalInstance
      .initialize()
      .then(() => {
        setInitialized(true);
      })
      .catch((err) => {
        console.error("Erreur d'initialisation MSAL:", err);
        setError("Impossible d'initialiser l'authentification");
      });
  }, []);

  // En cas d'erreur d'initialisation
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">⚠️ Erreur</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Pendant l'initialisation, ne rien afficher (ou un loader)
  if (!initialized) {
    return null;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}