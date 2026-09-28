"use client"

import { usePathname } from "next/navigation"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"

const PAGE_TITLES: Record<string, string> = {
    "/dashboard":                    "Tableau de bord",
    "/dashboard/reservations":       "Réservations",
    "/dashboard/rooms":              "Salles",
    "/dashboard/equipements":        "Équipements",
    "/dashboard/administration":     "Administration",
    "/statistics":                   "Statistiques",
}

function getPageTitle(pathname: string): string {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
    if (pathname.startsWith("/dashboard/rooms/")) return "Détail salle"
    return "Dashboard"
}

const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
})

export default function DashboardTopBar() {
    const pathname = usePathname()
    const title = getPageTitle(pathname)

    return (
        <div className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
            <span className="text-[#082187] font-bold text-lg tracking-tight">{title}</span>
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                    <CalendarTodayIcon style={{ fontSize: 15 }} />
                    {today}
                </span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400">
                    <NotificationsNoneIcon fontSize="small" />
                </button>
            </div>
        </div>
    )
}
