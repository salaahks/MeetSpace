"use client"

import { useRef, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { AppDispatch } from "@/redux/store"
import { updateRoomMapPosition } from "@/redux/room/actions"
import type { Room } from "@/redux/room/types"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import OpenWithIcon from "@mui/icons-material/OpenWith"
import CheckIcon from "@mui/icons-material/Check"
import { FLOOR_PLAN_URL } from "@/utils/constants"

const DEFAULT_MAP_X = 50
const DEFAULT_MAP_Y = 50
const LS_KEY = "room_map_positions"

const lsLoad = (): Record<number, { x: number; y: number }> => {
    if (typeof window === "undefined") return {}
    try {
        const raw = window.localStorage.getItem(LS_KEY)
        return raw ? (JSON.parse(raw) as Record<number, { x: number; y: number }>) : {}
    } catch { return {} }
}

const lsSave = (roomId: number, x: number, y: number) => {
    if (typeof window === "undefined") return
    try {
        const current = lsLoad()
        window.localStorage.setItem(LS_KEY, JSON.stringify({ ...current, [roomId]: { x, y } }))
    } catch { /* ignore */ }
}

interface Props {
    rooms: Room[]
    loading: boolean
    canReposition?: boolean
}

export default function RoomsMap({ rooms, loading, canReposition = false }: Props) {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const [positionMode, setPositionMode] = useState(false)
    const [savedPos, setSavedPos] = useState<Record<number, { x: number; y: number }>>(() => lsLoad())
    const [localPos, setLocalPos] = useState<Record<number, { x: number; y: number }>>({})
    const [draggingId, setDraggingId] = useState<number | null>(null)

    const dragPosRef = useRef<{ x: number; y: number } | null>(null)
    const draggingRoomIdRef = useRef<number | null>(null)
    const mapRef = useRef<HTMLDivElement>(null)

    const getPinPos = (room: Room) => {
        if (localPos[room.id])                      return localPos[room.id]
        if (room.mapX != null && room.mapY != null)  return { x: room.mapX, y: room.mapY }
        if (savedPos[room.id])                       return savedPos[room.id]
        return { x: DEFAULT_MAP_X, y: DEFAULT_MAP_Y }
    }

    const handlePinMouseDown = useCallback((e: React.MouseEvent, room: Room) => {
        if (!positionMode) return
        e.preventDefault()
        e.stopPropagation()
        draggingRoomIdRef.current = room.id
        setDraggingId(room.id)
        dragPosRef.current = {
            x: room.mapX ?? DEFAULT_MAP_X,
            y: room.mapY ?? DEFAULT_MAP_Y,
        }
    }, [positionMode])

    const handleMapMouseMove = useCallback((e: React.MouseEvent) => {
        if (draggingRoomIdRef.current === null || !mapRef.current) return
        const rect = mapRef.current.getBoundingClientRect()
        const x = Math.max(1, Math.min(99, ((e.clientX - rect.left) / rect.width) * 100))
        const y = Math.max(1, Math.min(99, ((e.clientY - rect.top) / rect.height) * 100))
        dragPosRef.current = { x, y }
        setLocalPos((prev) => ({ ...prev, [draggingRoomIdRef.current!]: { x, y } }))
    }, [])

    const handleMapMouseUp = useCallback(() => {
        if (draggingRoomIdRef.current === null) return
        const roomId = draggingRoomIdRef.current
        const pos = dragPosRef.current
        if (pos) {
            lsSave(roomId, pos.x, pos.y)
            setSavedPos((prev) => ({ ...prev, [roomId]: pos }))
            dispatch(updateRoomMapPosition({ id: roomId, mapX: pos.x, mapY: pos.y }))
        }
        draggingRoomIdRef.current = null
        dragPosRef.current = null
        setDraggingId(null)
    }, [dispatch])

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_-4px_rgba(8,33,135,0.08)] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Plan de l&apos;étage</span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        {rooms.length} salle{rooms.length > 1 ? "s" : ""}
                    </span>
                </div>
                {canReposition && (
                    <button
                        onClick={() => setPositionMode((v) => !v)}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                            positionMode
                                ? "bg-[#082187] text-white border-[#082187] shadow"
                                : "bg-white text-gray-500 border-gray-200 hover:border-[#082187] hover:text-[#082187]"
                        }`}
                    >
                        {positionMode ? <CheckIcon style={{ fontSize: 14 }} /> : <OpenWithIcon style={{ fontSize: 14 }} />}
                        {positionMode ? "Terminer" : "Repositionner"}
                    </button>
                )}
            </div>

            {/* Position mode hint */}
            {positionMode && (
                <div className="bg-[#082187]/5 border-b border-[#082187]/10 px-5 py-2 flex items-center gap-2 text-[#082187] text-xs font-medium">
                    <OpenWithIcon style={{ fontSize: 14 }} />
                    Glissez les points pour repositionner les salles. La position est sauvegardée automatiquement.
                </div>
            )}

            {/* Map */}
            <div className="flex justify-center bg-[#f8fafc] px-4 py-3">
                <div
                    ref={mapRef}
                    className={`relative w-full max-w-3xl select-none ${positionMode ? "cursor-crosshair" : ""}`}
                    onMouseMove={handleMapMouseMove}
                    onMouseUp={handleMapMouseUp}
                    onMouseLeave={handleMapMouseUp}
                >
                    <img
                        src={FLOOR_PLAN_URL}
                        alt="Plan interactif des salles"
                        className="w-full h-auto object-contain block rounded-lg"
                        draggable={false}
                    />

                    {!loading && rooms.map((room) => {
                        const pos = getPinPos(room)
                        const isDraggingThis = draggingId === room.id

                        return (
                            <div
                                key={`pin-${room.id}`}
                                className="absolute group"
                                style={{
                                    top: `${pos.y}%`,
                                    left: `${pos.x}%`,
                                    transform: "translate(-50%, -50%)",
                                    zIndex: isDraggingThis ? 50 : 10,
                                }}
                                onMouseDown={(e) => handlePinMouseDown(e, room)}
                            >
                                <div
                                    className={`relative flex items-center justify-center transition-transform ${
                                        positionMode
                                            ? "cursor-grab active:cursor-grabbing scale-125"
                                            : "cursor-pointer"
                                    } ${isDraggingThis ? "scale-150" : ""}`}
                                >
                                    {room.actif && !positionMode && (
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#5ceb96] opacity-40 animate-ping" />
                                    )}
                                    <div
                                        className={`relative w-4 h-4 rounded-full border-2 shadow-md flex items-center justify-center transition-all group-hover:scale-125 ${
                                            room.actif ? "bg-[#5ceb96] border-white" : "bg-gray-400 border-white"
                                        } ${positionMode ? "ring-2 ring-[#082187]/40 ring-offset-1" : ""}`}
                                    />
                                </div>

                                {/* Tooltip */}
                                {!positionMode && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:flex flex-col items-center z-50">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-56 text-center flex flex-col gap-2 relative">
                                            <h3 className="text-[13px] font-bold text-[#082187] break-words leading-snug">{room.nom}</h3>
                                            <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                                                <PeopleOutlineIcon style={{ fontSize: 14 }} />
                                                {room.capacite ?? 0} Pers.
                                            </p>
                                            {room.actif ? (
                                                <button
                                                    className="w-full bg-[#082187] hover:bg-[#06186b] text-white text-xs font-bold py-1.5 rounded-lg transition"
                                                    onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
                                                >
                                                    Réserver
                                                </button>
                                            ) : (
                                                <span className="w-full bg-gray-100 text-gray-400 text-xs font-bold py-1.5 rounded-lg block">
                                                    Occupée
                                                </span>
                                            )}
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
                                        </div>
                                    </div>
                                )}

                                {/* Position mode label */}
                                {positionMode && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#082187] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none shadow">
                                        {room.nom}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-50 bg-[#fafbff]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-[#5ceb96] border-2 border-white shadow" />
                    Disponible
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow" />
                    Occupée
                </div>
                <div className="ml-auto text-xs text-gray-400 italic">
                    Survolez un point pour voir les détails
                </div>
            </div>
        </div>
    )
}
