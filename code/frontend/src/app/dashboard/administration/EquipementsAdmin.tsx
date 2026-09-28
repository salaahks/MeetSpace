"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { fetchEquipements, addEquipement, updateEquipement, deleteEquipement } from "@/redux/equipement/actions"
import type { Equipement } from "@/redux/equipement/types"
import type { Room } from "@/redux/room/types"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { EQ_TYPE_LABELS } from "./constants"
import { getEqIcon } from "@/utils/equipementUtils"
import EquipementModal from "./components/EquipementModal"
import DeleteModal from "./components/DeleteModal"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from "next/navigation"

interface Props {
    rooms: Room[]
    equipements: Equipement[]
    loading: boolean
    search: string
    selectedRoomId: number | null
    onSelectRoom: (id: number | null) => void
}

export default function EquipementsAdmin({ rooms, equipements, loading, search, selectedRoomId, onSelectRoom }: Props) {
    const dispatch = useDispatch<AppDispatch>()

    const [modal, setModal] = useState<{ open: boolean; data: (Omit<Equipement, 'id'> & { id?: number }) | null }>({ open: false, data: null })
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null)

    const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null
    const router = useRouter() 
    const filteredEqs = equipements
        .filter((e) => e != null)
        .filter((e) => e.roomId === selectedRoomId)
        .filter((e) =>
            e.name?.toLowerCase().includes(search.toLowerCase()) ||
            EQ_TYPE_LABELS[e.equipementType]?.toLowerCase().includes(search.toLowerCase())
        )

    const handleSave = (data: Omit<Equipement, 'id'> & { id?: number }) => {
        if (data.id) {
            dispatch(updateEquipement({
                id: data.id,
                equipementData: { ...data, roomId: selectedRoomId },
                onSuccess: () => {
                    setModal({ open: false, data: null })
                    dispatch(fetchEquipements())
                },
            }))
        } else {
            dispatch(addEquipement({
                equipementData: { ...(data as Omit<Equipement, 'id'>), roomId: selectedRoomId },
                onSuccess: () => {
                    setModal({ open: false, data: null })
                    dispatch(fetchEquipements())
                },
            }))
        }
    }

    const handleDelete = (id: number, name: string) => setDeleteTarget({ id, label: name })

    const confirmDelete = () => {
        if (!deleteTarget) return
        dispatch(deleteEquipement({
            id: deleteTarget.id,
            onSuccess: () => {
                setDeleteTarget(null)
                dispatch(fetchEquipements())
            },
        }))
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.06)] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">
                    {selectedRoom
                        ? `Équipements — ${selectedRoom.nom} (${filteredEqs.length})`
                        : 'Gestion des Équipements'
                    }
                </h2>
                {selectedRoom && (
                    <button
                        onClick={() => setModal({ open: true, data: null })}
                        className="flex items-center gap-2 bg-[#082187] hover:bg-[#06186b] text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                    >
                        <AddIcon fontSize="small" /> Ajouter un équipement
                    </button>
                )}
            </div>

            {/* Room selector */}
            {!selectedRoom && (
                <div className="px-6 py-6 flex flex-col gap-3">
                    <p className="text-sm text-gray-500 font-medium">Choisissez une salle gérer ses équipements :</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {rooms.map((r) => {
                            const count = equipements.filter((e) => e?.roomId === r.id).length
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => onSelectRoom(r.id)}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#082187] hover:bg-[#082187]/5 transition text-left group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#082187]/10 flex items-center justify-center text-[#082187] font-bold text-sm shrink-0">
                                        {r.nom?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#082187]">{r.nom}</p>
                                        <p className="text-xs text-gray-400">{count} équipement{count !== 1 ? 's' : ''}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Equipements table */}
            {selectedRoom && (
                <>
                    <div className="px-6 py-3 border-b border-gray-50">
                       <button
                            onClick={() => {
                                if (selectedRoomId) {
                                    onSelectRoom(null)
                                } else {
                                    router.back()
                                }
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#082187] transition"
                            title="Retour"
                        >
                            <ArrowBackIcon fontSize="small" />
                            Toutes les salles
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#f8fafc] text-gray-500 text-xs uppercase tracking-wide">
                                <th className="text-left px-6 py-3 font-semibold">Nom</th>
                                <th className="text-left px-6 py-3 font-semibold">Type</th>
                                <th className="text-left px-6 py-3 font-semibold">Quantité</th>
                                <th className="text-left px-6 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={4} className="text-center py-12 text-gray-400">Chargement...</td></tr>
                            )}
                            {!loading && filteredEqs.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-12 text-gray-400">Aucun équipement pour cette salle.</td></tr>
                            )}
                            {!loading && filteredEqs.map((eq) => (
                                <tr key={eq.id} className="border-t border-gray-50 hover:bg-[#f8fafc] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center [&_svg]:!text-[#1c3298] [&_svg]:!mb-0">
                                                {getEqIcon(eq.equipementType, "small")}
                                            </div>
                                            <span className="font-semibold text-gray-800">{eq.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                            {EQ_TYPE_LABELS[eq.equipementType] ?? eq.equipementType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{eq.quantity}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setModal({ open: true, data: { ...eq } })}
                                                className="p-2 rounded-lg text-[#082187] hover:bg-[#082187]/10 transition"
                                                title="Modifier"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(eq.id, eq.name)}
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
                </>
            )}

            {modal.open && selectedRoom && (
                <EquipementModal
                    initial={modal.data}
                    roomName={selectedRoom.nom}
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
