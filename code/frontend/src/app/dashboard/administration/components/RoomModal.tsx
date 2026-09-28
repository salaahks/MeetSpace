"use client"

import { useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import type { Room, BuildingType } from "@/redux/room/types"
import { BUILDING_TYPES, BUILDING_LABELS } from "@/redux/room/types"
import { ROOM_TYPES, ROOM_TYPE_LABELS, emptyRoom } from "../constants"
import Toggle from "./Toggle"

interface Props {
    initial: (Omit<Room, 'id'> & { id?: number }) | null
    onSave: (data: Omit<Room, 'id'> & { id?: number }) => void
    onClose: () => void
}

export default function RoomModal({ initial, onSave, onClose }: Props) {
    const [form, setForm] = useState<Omit<Room, 'id'> & { id?: number }>(
        initial ?? emptyRoom()
    )

    const set = (field: string, value: unknown) =>
        setForm((f) => ({ ...f, [field]: value }))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#082187]">
                        {form.id ? 'Modifier la salle' : 'Ajouter une salle'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                        <input
                            value={form.nom}
                            onChange={(e) => set('nom', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20"
                            placeholder="Ex: Salle Casablanca"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacité</label>
                        <input
                            type="number" min={1}
                            value={form.capacite}
                            onChange={(e) => set('capacite', Number(e.target.value))}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                        <select
                            value={form.roomType}
                            onChange={(e) => set('roomType', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20 bg-white"
                        >
                            {ROOM_TYPES.map((t) => (
                                <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Département</label>
                        <select
                            value={form.building ?? ''}
                            onChange={(e) => set('building', e.target.value as BuildingType)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20 bg-white"
                        >
                            <option value="">— Sélectionner —</option>
                            {BUILDING_TYPES.map((b) => (
                                <option key={b} value={b}>{BUILDING_LABELS[b]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Localisation</label>
                        <input
                            value={form.localisation ?? ''}
                            onChange={(e) => set('localisation', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20"
                            placeholder="Ex: 3ème étage (Sud)"
                        />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</label>
                        <Toggle checked={form.actif} onChange={() => set('actif', !form.actif)} />
                        <span className={`text-sm font-medium ${form.actif ? 'text-green-600' : 'text-gray-400'}`}>
                            {form.actif ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        disabled={!form.nom.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-[#082187] hover:bg-[#06186b] text-white font-bold transition disabled:opacity-40"
                    >
                        {form.id ? 'Enregistrer' : 'Ajouter'}
                    </button>
                </div>
            </div>
        </div>
    )
}
