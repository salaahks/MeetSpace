"use client"

import { useEffect, useRef } from "react"
import QRCodeSVG from "react-qr-code"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import BusinessIcon from "@mui/icons-material/Business"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import DownloadIcon from "@mui/icons-material/Download"
import PrintIcon from "@mui/icons-material/Print"
import DevicesOtherIcon from "@mui/icons-material/DevicesOther"

import { fetchRoomById } from "@/redux/room/actions"
import type { RootState, AppDispatch } from "@/redux/store"
import type { RoomEquipement } from "@/redux/room/types"
import { getEqIcon } from "@/utils/equipementUtils"
import { EQ_TYPE_LABELS } from "@/app/dashboard/administration/constants"

export default function RoomDetail({ roomId }: { roomId: number }) {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const { room, loading } = useSelector((state: RootState) => state.roomState)

    useEffect(() => {
        dispatch(fetchRoomById(roomId))
    }, [dispatch, roomId])

    const qrRef = useRef<HTMLDivElement>(null)

    if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement...</div>
    if (!room) return <div className="flex items-center justify-center py-20 text-gray-400">Salle introuvable.</div>

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto min-h-screen pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowBackIcon className="text-[#082187]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#082187]">Détails de la salle</h1>
                </div>
                <div />
            </div>

            {/* Main Layout: Left Column & Right Column */}
            <div className="flex gap-8 items-start">
                
                {/* ---------------- LEFT COLUMN ---------------- */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    {/* Header de Statut (qui remplace l'image) */}
                    <div className="flex items-center gap-4 pb-2">
                        <h2 className="text-3xl font-extrabold text-[#082187]">{room.nom}</h2>
                        {room.actif ? (
                            <span className="bg-[#e0fbf0] text-[#1aa05f] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                Disponible
                            </span>
                        ) : (
                            <span className="bg-[#fce4e4] text-[#d42a3e] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                Occupé
                            </span>
                        )}
                    </div>

                    {/* 3 Info Cards (Bâtiment, Localisation, Capacité) - J'ai ajusté puisque le nom de la salle est au-dessus */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100 flex flex-col justify-center">
                            <div className="w-10 h-10 rounded-lg bg-[#f0f4ff] flex items-center justify-center mb-4">
                                <BusinessIcon className="text-[#1c3298]" fontSize="small" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bâtiment</p>
                            <p className="text-lg font-bold text-gray-900">{room.building || "—"}</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100 flex flex-col justify-center">
                            <div className="w-10 h-10 rounded-lg bg-[#f0f4ff] flex items-center justify-center mb-4">
                                <BusinessIcon className="text-[#1c3298]" fontSize="small" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Localisation</p>
                            <p className="text-lg font-bold text-gray-900">
                                {room.localisation || "—"}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100 flex flex-col justify-center">
                            <div className="w-10 h-10 rounded-lg bg-[#e8fbf0] flex items-center justify-center mb-4">
                                <PeopleOutlineIcon className="text-[#20b263]" fontSize="small" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Capacité</p>
                            <p className="text-lg font-bold text-gray-900">{room.capacite || 0} Personnes</p>
                        </div>
                    </div>

                    {/* Équipements inclus */}
                    <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Équipements inclus</h2>
                        {(room.equipements ?? []).length > 0 ? (
                            <div className={`grid gap-4 ${(room.equipements ?? []).length === 1 ? "grid-cols-1 max-w-[160px]" : (room.equipements ?? []).length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                                {(room.equipements ?? []).map((eq: RoomEquipement) => (
                                    <div key={eq.id} className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                                        {getEqIcon(eq.equipementType)}
                                        <p className="text-[13px] font-bold text-gray-700 mt-2">
                                            {eq.equipementType ? (EQ_TYPE_LABELS[eq.equipementType as keyof typeof EQ_TYPE_LABELS] ?? eq.name ?? eq.nom) : (eq.name ?? eq.nom)}
                                        </p>
                                        {(eq.quantity ?? 0) > 1 && (
                                            <span className="text-[11px] text-gray-400 mt-0.5">×{eq.quantity}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-300 gap-2">
                                <DevicesOtherIcon style={{ fontSize: 40 }} />
                                <p className="text-sm font-medium">Aucun équipement renseigné</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* ---------------- RIGHT COLUMN ---------------- */}
                <div className="w-[320px] flex-shrink-0 flex flex-col gap-6">
                    
                    {/* Identification QR Box */}
                    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-800 tracking-widest uppercase mb-6 w-full text-left">
                            Identification Salle
                        </h3>
                        
                        {(() => {
                            const roomUrl = typeof window !== "undefined"
                                ? `${window.location.origin}/dashboard/rooms/${room.id}`
                                : `/dashboard/rooms/${room.id}`

                            const downloadQR = () => {
                                const svg = qrRef.current?.querySelector('svg')
                                if (!svg) return
                                const serializer = new XMLSerializer()
                                const svgStr = serializer.serializeToString(svg)
                                const blob = new Blob([svgStr], { type: "image/svg+xml" })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = `qr-${room.nom ?? room.id}.svg`
                                a.click()
                                URL.revokeObjectURL(url)
                            }

                            const printQR = () => {
                                const svg = qrRef.current?.querySelector('svg')
                                if (!svg) return
                                const serializer = new XMLSerializer()
                                const svgStr = serializer.serializeToString(svg)
                                const blob = new Blob([svgStr], { type: "image/svg+xml" })
                                const url = URL.createObjectURL(blob)
                                const win = window.open(url, "_blank")
                                win?.addEventListener("load", () => { win.print(); URL.revokeObjectURL(url) })
                            }

                            return (
                                <>
                                    <div ref={qrRef} className="w-48 h-48 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6 p-3">
                                        <QRCodeSVG
                                            value={roomUrl}
                                            size={176}
                                            fgColor="#082187"
                                            bgColor="#ffffff"
                                        />
                                    </div>

                                    <p className="text-xs text-gray-500 text-center leading-relaxed mb-6 px-2">
                                        Scannez pour accéder à la page de réservation de cette salle depuis votre mobile.
                                    </p>

                                    <div className="w-full flex flex-col gap-3">
                                        <button
                                            onClick={downloadQR}
                                            className="w-full bg-[#1c3298] hover:bg-[#12226b] text-white text-[13px] font-bold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <DownloadIcon fontSize="small" />
                                            Télécharger le code
                                        </button>
                                        <button
                                            onClick={printQR}
                                            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-bold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <PrintIcon fontSize="small" />
                                            Imprimer l&apos;affiche
                                        </button>
                                    </div>
                                </>
                            )
                        })()}
                    </div>

                </div>
            </div>
        </div>
    )
}