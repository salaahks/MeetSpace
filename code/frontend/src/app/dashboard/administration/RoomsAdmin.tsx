"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { fetchRooms, addRoom, updateRoom, deleteRoom, toggleRoomActif } from "@/redux/room/actions"
import type { Room, BuildingType } from "@/redux/room/types"
import { BUILDING_LABELS } from "@/redux/room/types"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { ROOM_TYPE_LABELS, type RoomTypeValue } from "./constants"
import Toggle from "./components/Toggle"
import RoomModal from "./components/RoomModal"
import DeleteModal from "./components/DeleteModal"

interface Props {
    rooms: Room[]
    loading: boolean
    search: string
}

export default function RoomsAdmin({ rooms, loading, search }: Props) {
    const dispatch = useDispatch<AppDispatch>()

    const [modal, setModal] = useState<{ open: boolean; data: (Omit<Room, 'id'> & { id?: number }) | null }>({ open: false, data: null })
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null)

    const filtered = rooms.filter((r) =>
        r.nom?.toLowerCase().includes(search.toLowerCase()) ||
        r.building?.toLowerCase().includes(search.toLowerCase()) ||
        r.localisation?.toLowerCase().includes(search.toLowerCase())
    )

    const handleSave = (data: Omit<Room, 'id'> & { id?: number }) => {
        if (data.id) {
            dispatch(updateRoom({
                id: data.id,
                roomData: data,
                onSuccess: () => {
                    setModal({ open: false, data: null })
                    dispatch(fetchRooms())
                },
            }))
        } else {
            dispatch(addRoom({
                roomData: data as Omit<Room, 'id'>,
                onSuccess: () => {
                    setModal({ open: false, data: null })
                    dispatch(fetchRooms())
                },
            }))
        }
    }

    const handleDelete = (id: number, nom: string) => setDeleteTarget({ id, label: nom })

    const handleToggle = (id: number) => dispatch(toggleRoomActif({
        id,
        onSuccess: () => dispatch(fetchRooms()),
    }))

    const confirmDelete = () => {
        if (!deleteTarget) return
        dispatch(deleteRoom({
            id: deleteTarget.id,
            onSuccess: () => {
                setDeleteTarget(null)
                dispatch(fetchRooms())
            },
        }))
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.06)] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Gestion des Salles ({filtered.length})</h2>
                <button
                    onClick={() => setModal({ open: true, data: null })}
                    className="flex items-center gap-2 bg-[#082187] hover:bg-[#06186b] text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                >
                    <AddIcon fontSize="small" /> Ajouter une salle
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#f8fafc] text-gray-500 text-xs uppercase tracking-wide">
                        <th className="text-left px-6 py-3 font-semibold">Nom</th>
                        <th className="text-left px-6 py-3 font-semibold">Capacité</th>
                        <th className="text-left px-6 py-3 font-semibold">Type</th>
                        <th className="text-left px-6 py-3 font-semibold">Localisation</th>
                        <th className="text-left px-6 py-3 font-semibold">Statut</th>
                        <th className="text-left px-6 py-3 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">Chargement...</td></tr>
                    )}
                    {!loading && filtered.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucune salle trouvée.</td></tr>
                    )}
                    {!loading && filtered.map((room) => (
                        <tr key={room.id} className="border-t border-gray-50 hover:bg-[#f8fafc] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#082187]/10 flex items-center justify-center text-[#082187] font-bold text-sm">
                                        {room.nom?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800">{room.nom}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{room.capacite} pers.</td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                    {ROOM_TYPE_LABELS[room.roomType as RoomTypeValue] ?? room.roomType}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-[13px]">
                                {[room.building ? (BUILDING_LABELS[room.building as BuildingType] ?? room.building) : null, room.localisation].filter(Boolean).join(' · ') || '—'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Toggle checked={room.actif} onChange={() => handleToggle(room.id)} />
                                    <span className={`text-xs font-semibold ${room.actif ? 'text-green-600' : 'text-gray-400'}`}>
                                        {room.actif ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setModal({ open: true, data: { ...room } })}
                                        className="p-2 rounded-lg text-[#082187] hover:bg-[#082187]/10 transition"
                                        title="Modifier"
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.id, room.nom)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                                        title="Supprimer"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modal.open && (
                <RoomModal
                    initial={modal.data}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, data: null })}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    label={deleteTarget.label}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}
