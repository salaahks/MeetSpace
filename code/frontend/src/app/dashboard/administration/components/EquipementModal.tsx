"use client"

import { useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import type { Equipement, EquipementType } from "@/redux/equipement/types"
import { EQUIPEMENT_TYPES, EQ_TYPE_LABELS, emptyEquipement } from "../constants"

interface Props {
    initial: (Omit<Equipement, 'id'> & { id?: number }) | null
    roomName: string
    onSave: (data: Omit<Equipement, 'id'> & { id?: number }) => void
    onClose: () => void
}

export default function EquipementModal({ initial, roomName, onSave, onClose }: Props) {
    const [form, setForm] = useState<Omit<Equipement, 'id'> & { id?: number }>(
        initial ?? emptyEquipement()
    )

    const set = (field: string, value: unknown) =>
        setForm((f) => ({ ...f, [field]: value }))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#082187]">
                            {form.id ? "Modifier l'équipement" : 'Ajouter un équipement'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MeetingRoomIcon style={{ fontSize: 13 }} /> {roomName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                        <input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20"
                            placeholder="Ex: Projecteur Epson"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                        <select
                            value={form.equipementType}
                            onChange={(e) => set('equipementType', e.target.value as EquipementType)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20 bg-white"
                        >
                            {EQUIPEMENT_TYPES.map((t) => (
                                <option key={t} value={t}>{EQ_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantité</label>
                        <input
                            type="number" min={1}
                            value={form.quantity}
                            onChange={(e) => set('quantity', Number(e.target.value))}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#082187]/20"
                        />
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
                        disabled={!form.name.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-[#082187] hover:bg-[#06186b] text-white font-bold transition disabled:opacity-40"
                    >
                        {form.id ? 'Enregistrer' : 'Ajouter'}
                    </button>
                </div>
            </div>
        </div>
    )
}
