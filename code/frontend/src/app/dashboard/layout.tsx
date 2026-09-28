import { ReactNode } from "react";
import AuthGuard from "@/providers/AuthGuard";
import Sidebar from "@/template/layouts/components/vertical/navigation/Sidebar";
import DashboardTopBar from "./DashboardTopBar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col bg-gray-50">
          <DashboardTopBar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}