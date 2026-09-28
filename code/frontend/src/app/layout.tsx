import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import I18nProvider from "@/providers/I18nProvider";
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "MeetSpace — Gestion des Salles",
  description: "Plateforme de réservation de salles de réunion et d'équipements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full">
        <I18nProvider>
          <ReduxProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}