"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

import SearchIcon from "@mui/icons-material/Search"
import GridViewIcon from "@mui/icons-material/GridView"
import ViewListIcon from "@mui/icons-material/ViewList"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import BusinessIcon from "@mui/icons-material/Business"

import { fetchRooms } from "@/redux/room/actions"
import type { RootState, AppDispatch } from "@/redux/store"
import type { Room, RoomEquipement, BuildingType } from "@/redux/room/types"
import { BUILDING_TYPES, BUILDING_LABELS } from "@/redux/room/types"
import { getEqIcon } from "@/utils/equipementUtils"
import { EQ_TYPE_LABELS } from "@/app/dashboard/administration/constants"
import RoomsMap from "./RoomsMap"

type StatusFilter = "ALL" | "AVAILABLE" | "OCCUPIED"
type BuildingFilter = "ALL" | BuildingType

export default function RoomsList() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const { rooms, loading } = useSelector((state: RootState) => state.roomState)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
    const [buildingFilter, setBuildingFilter] = useState<BuildingFilter>("ALL")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    useEffect(() => {
        dispatch(fetchRooms())
    }, [dispatch])

    const safeRooms: Room[] = Array.isArray(rooms) ? rooms : []

    const filtered = safeRooms.filter((r) => {
        const matchSearch = (r.nom ?? "").toLowerCase().includes(search.toLowerCase())
        const matchStatus =
            statusFilter === "ALL" ? true :
            statusFilter === "AVAILABLE" ? r.actif === true :
            r.actif === false
        const matchBuilding =
            buildingFilter === "ALL" ? true :
            r.building === buildingFilter ||
            r.building?.toUpperCase() === buildingFilter
        return matchSearch && matchStatus && matchBuilding
    })

    return (
        <div className="flex flex-col min-h-screen -m-8 bg-[#f8fafc]">
            <div className="px-8 py-8 flex flex-col gap-6">

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-[26px] font-extrabold text-[#082187]">Gestion des Salles</h1>
                        <p className="text-[14px] text-gray-400 mt-1">Parcourez et réservez nos espaces de réunion.</p>
                    </div>
                </div>

                <RoomsMap rooms={filtered} loading={loading} canReposition={true} />

                {/* Filters & view toggle */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 flex-wrap">

                        <div className="flex items-center bg-white border border-gray-200 p-1 rounded-xl shadow-sm gap-0.5">
                            {(["ALL", ...BUILDING_TYPES] as BuildingFilter[]).map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setBuildingFilter(b)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                        buildingFilter === b
                                            ? "bg-[#082187] text-white shadow"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {b === "ALL" && <BusinessIcon style={{ fontSize: 14 }} />}
                                    {b === "ALL" ? "Tous" : BUILDING_LABELS[b as BuildingType]}
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            {([
                                { key: "ALL",       label: "Toutes",      icon: <FormatListBulletedIcon fontSize="small" />, active: "bg-gray-800 text-white border-gray-800" },
                                { key: "AVAILABLE", label: "Disponibles", icon: <CheckCircleOutlineIcon fontSize="small" />, active: "bg-[#5ceb96] text-gray-900 border-[#5ceb96]" },
                                { key: "OCCUPIED",  label: "Occupées",    icon: <DoNotDisturbAltIcon fontSize="small" />,    active: "bg-red-100 text-red-600 border-red-200" },
                            ] as { key: StatusFilter; label: string; icon: React.ReactNode; active: string }[]).map(({ key, label, icon, active }) => (
                                <button
                                    key={key}
                                    onClick={() => setStatusFilter(key)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition border shadow-sm ${
                                        statusFilter === key ? active : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {icon}{label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Rechercher une salle..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm rounded-lg bg-[#f1f5f9] border-none focus:outline-none focus:ring-2 focus:ring-[#082187]/10 w-64 text-gray-600"
                            />
                        </div>
                        <div className="flex items-center bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-1.5 rounded-md transition-all flex items-center justify-center ${
                                    viewMode === "grid" ? "bg-[#082187] text-white shadow" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <GridViewIcon fontSize="small" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-1.5 rounded-md transition-all flex items-center justify-center ${
                                    viewMode === "list" ? "bg-[#082187] text-white shadow" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <ViewListIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                </div>

                {!loading && (
                    <p className="text-sm text-gray-400 -mt-2">
                        <span className="font-semibold text-gray-600">{filtered.length}</span> salle{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
                    </p>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-[#082187]/20 border-t-[#082187] animate-spin" />
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400 text-sm">
                        Aucune salle ne correspond à ces filtres.
                    </div>
                )}

                {/* Grid view */}
                {!loading && filtered.length > 0 && viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(8,33,135,0.08)] hover:shadow-[0_4px_20px_-4px_rgba(8,33,135,0.14)] transition-shadow flex flex-col overflow-hidden"
                            >
                                <div className={`h-1 w-full ${room.actif ? "bg-gradient-to-r from-[#5ceb96] to-[#3dd88a]" : "bg-gray-200"}`} />
                                <div className="p-5 flex flex-col flex-1 gap-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#082187]/10 flex items-center justify-center text-[#082187] font-extrabold text-sm shrink-0">
                                                {room.nom?.charAt(0).toUpperCase()}
                                            </div>
                                            <h2 className="text-[15px] font-bold text-[#082187] leading-tight">{room.nom}</h2>
                                        </div>
                                        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                            room.actif ? "bg-[#e0fbf0] text-[#1aa05f]" : "bg-red-50 text-red-500"
                                        }`}>
                                            {room.actif ? "Disponible" : "Occupée"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-[13px] text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <PeopleOutlineIcon style={{ fontSize: 16 }} className="text-gray-400 shrink-0" />
                                            <span className="font-medium">{room.capacite ?? 0} personnes</span>
                                        </div>
                                        {(room.building || room.localisation) && (
                                            <div className="flex items-center gap-2">
                                                <BusinessIcon style={{ fontSize: 16 }} className="text-gray-400 shrink-0" />
                                                <span>{[room.building ? (BUILDING_LABELS[room.building as BuildingType] ?? room.building) : null, room.localisation].filter(Boolean).join(" · ")}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(room.equipements ?? []).length > 0 ? (
                                            (room.equipements ?? []).map((eq: RoomEquipement) => (
                                                <span key={eq.id} className="flex items-center gap-1.5 bg-[#eef2ff] text-[#1c3298] text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                                                    <span className="flex items-center [&_svg]:!text-[#1c3298] [&_svg]:!mb-0">{getEqIcon(eq.equipementType, "small")}</span>
                                                    {eq.equipementType ? (EQ_TYPE_LABELS[eq.equipementType as keyof typeof EQ_TYPE_LABELS] ?? (eq.nom ?? eq.name)) : (eq.nom ?? eq.name)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">Aucun équipement</span>
                                        )}
                                    </div>
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
                                            className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                                                room.actif
                                                    ? "bg-[#082187] text-white hover:bg-[#06186b]"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            disabled={!room.actif}
                                        >
                                            {room.actif ? "Voir les détails" : "Non disponible"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* List view */}
                {!loading && filtered.length > 0 && viewMode === "list" && (
                    <div className="flex flex-col gap-3">
                        {filtered.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(8,33,135,0.07)] hover:shadow-[0_4px_16px_-4px_rgba(8,33,135,0.12)] transition-shadow flex items-center gap-4 px-5 py-4"
                            >
                                <div className={`w-1 h-12 rounded-full shrink-0 ${room.actif ? "bg-[#5ceb96]" : "bg-gray-200"}`} />
                                <div className="w-10 h-10 rounded-xl bg-[#082187]/10 flex items-center justify-center text-[#082187] font-extrabold text-sm shrink-0">
                                    {room.nom?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h2 className="text-[14px] font-bold text-[#082187] truncate">{room.nom}</h2>
                                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                            room.actif ? "bg-[#e0fbf0] text-[#1aa05f]" : "bg-red-50 text-red-500"
                                        }`}>
                                            {room.actif ? "Disponible" : "Occupée"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <PeopleOutlineIcon style={{ fontSize: 14 }} />
                                            {room.capacite ?? 0} pers.
                                        </span>
                                        {(room.building || room.localisation) && (
                                            <span className="flex items-center gap-1">
                                                <BusinessIcon style={{ fontSize: 14 }} />
                                                {[room.building ? (BUILDING_LABELS[room.building as BuildingType] ?? room.building) : null, room.localisation].filter(Boolean).join(" · ")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-1.5 flex-wrap max-w-[260px]">
                                    {(room.equipements ?? []).slice(0, 3).map((eq: RoomEquipement) => (
                                        <span key={eq.id} className="flex items-center gap-1.5 bg-[#eef2ff] text-[#1c3298] text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                                            <span className="flex items-center [&_svg]:!text-[#1c3298] [&_svg]:!mb-0">{getEqIcon(eq.equipementType, "small")}</span>
                                            {eq.equipementType ? (EQ_TYPE_LABELS[eq.equipementType as keyof typeof EQ_TYPE_LABELS] ?? (eq.nom ?? eq.name)) : (eq.nom ?? eq.name)}
                                        </span>
                                    ))}
                                    {(room.equipements ?? []).length > 3 && (
                                        <span className="text-[10px] text-[#1c3298] font-bold bg-[#eef2ff] px-2 py-1 rounded-lg">
                                            +{(room.equipements ?? []).length - 3}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
                                    disabled={!room.actif}
                                    className={`shrink-0 px-5 py-2 rounded-xl text-[13px] font-bold transition-all ${
                                        room.actif
                                            ? "bg-[#082187] text-white hover:bg-[#06186b]"
                                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    }`}
                                >
                                    Détails
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}
