"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { fetchRooms } from "@/redux/room/actions"
import { fetchEquipements } from "@/redux/equipement/actions"
import { fetchUsers } from "@/redux/user/actions"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import DevicesIcon from "@mui/icons-material/Devices"
import PeopleIcon from "@mui/icons-material/People"
import SearchIcon from "@mui/icons-material/Search"
import RoomsAdmin from "./RoomsAdmin"
import EquipementsAdmin from "./EquipementsAdmin"
import UsersAdmin from "./UsersAdmin"

type Tab = "salles" | "equipements" | "utilisateurs"

export default function AdminPanel() {
    const dispatch = useDispatch<AppDispatch>()
    const { rooms, loading: roomsLoading } = useSelector((state: RootState) => state.roomState)
    const { equipements, loading: eqLoading } = useSelector((state: RootState) => state.equipementState)

    const [tab, setTab] = useState<Tab>("salles")
    const [search, setSearch] = useState("")
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

    useEffect(() => {
        dispatch(fetchRooms())
        dispatch(fetchEquipements())
        dispatch(fetchUsers())
    }, [dispatch])

    const safeRooms = Array.isArray(rooms) ? rooms : []
    const safeEqs = Array.isArray(equipements) ? equipements : []
    const activeRooms = safeRooms.filter((r) => r.actif).length

    return (
        <div className="flex flex-col min-h-screen -m-8 bg-[#f8fafc]">

            <div className="px-8 py-8 flex flex-col gap-6">

                {/* Title + Search */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-[26px] font-extrabold text-[#082187]">Administration</h1>
                        <p className="text-[14px] text-gray-400 mt-1">Gérez les salles et équipements de la plateforme.</p>
                    </div>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border-none rounded-lg bg-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-blue-100 w-64"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl self-start border border-gray-200">
                    <TabBtn active={tab === "salles"} onClick={() => { setTab("salles"); setSearch(""); setSelectedRoomId(null) }}>
                        <MeetingRoomIcon fontSize="small" /> Salles
                    </TabBtn>
                    <TabBtn active={tab === "equipements"} onClick={() => { setTab("equipements"); setSearch(""); setSelectedRoomId(null) }}>
                        <DevicesIcon fontSize="small" /> Équipements
                    </TabBtn>
                    <TabBtn active={tab === "utilisateurs"} onClick={() => { setTab("utilisateurs"); setSearch("") }}>
                        <PeopleIcon fontSize="small" /> Utilisateurs
                    </TabBtn>
                </div>

                {/* Content */}
                {tab === "salles" && (
                    <RoomsAdmin
                        rooms={safeRooms}
                        loading={roomsLoading}
                        search={search}
                    />
                )}
                {tab === "equipements" && (
                    <EquipementsAdmin
                        rooms={safeRooms}
                        equipements={safeEqs}
                        loading={eqLoading}
                        search={search}
                        selectedRoomId={selectedRoomId}
                        onSelectRoom={setSelectedRoomId}
                    />
                )}
                {tab === "utilisateurs" && (
                    <UsersAdmin search={search} />
                )}
            </div>
        </div>
    )
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'blue' | 'green' | 'red' | 'purple' }) {
    const colors = {
        blue:   'bg-blue-50   text-blue-700   border-blue-100',
        green:  'bg-green-50  text-green-700  border-green-100',
        red:    'bg-red-50    text-red-600    border-red-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
    }
    return (
        <div className={`rounded-xl border px-5 py-4 flex flex-col gap-1 ${colors[color]}`}>
            <span className="text-3xl font-extrabold">{value}</span>
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</span>
        </div>
    )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                active
                    ? 'bg-white text-[#082187] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {children}
        </button>
    )
}
