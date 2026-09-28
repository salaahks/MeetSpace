"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useMsal } from "@azure/msal-react"
import SearchIcon from "@mui/icons-material/Search"
import ReportProblemIcon from "@mui/icons-material/ReportProblem"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import { fetchEquipements } from "@/redux/equipement/actions"
import { EQ_TYPE_LABELS } from "@/app/dashboard/administration/constants"
import { getEqIcon } from "@/utils/equipementUtils"
import { SUPPORT_TICKET_URL } from "@/utils/constants"
import type { RootState, AppDispatch } from "@/redux/store"
import type { Equipement } from "@/redux/equipement/types"

export default function EquipementsPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { instance } = useMsal()
    const { equipements, loading } = useSelector((state: RootState) => state.equipementState)

    const [search, setSearch] = useState("")
    const [filterType, setFilterType] = useState("ALL")
    const [page, setPage] = useState(1)
    const [reclamerLoading] = useState<number | null>(null)
    const [successId, setSuccessId] = useState<number | null>(null)
    const PER_PAGE = 5

    const account = instance.getActiveAccount() || instance.getAllAccounts()[0]
    const userEmail = account?.username || ""

    useEffect(() => {
        dispatch(fetchEquipements())
    }, [dispatch])

    const filtered = equipements.filter((e: Equipement) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
        const matchType = filterType === "ALL" || e.equipementType === filterType
        return matchSearch && matchType
    })

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const handleReclamer = async (eq: Equipement) => {
        const subject = `Problème équipement : ${eq.name}`
        const description =
            `Bonjour,\n\n` +
            `Je signale un problème avec l'équipement suivant :\n\n` +
            `• Nom       : ${eq.name}\n` +
            `• Type      : ${EQ_TYPE_LABELS[eq.equipementType] || eq.equipementType}\n` +
            `• Quantité  : ${eq.quantity}\n` +
            `• Salle     : ${eq.roomId ? `Salle ${eq.roomId}` : "Non assignée"}\n\n` +
            `Merci de traiter cette demande dans les meilleurs délais.\n\n` +
            `Cordialement,\n${account?.name || userEmail}`

        const query = `subject=${encodeURIComponent(subject)}`
        if (SUPPORT_TICKET_URL) {
            window.open(`${SUPPORT_TICKET_URL}?${query}&description=${encodeURIComponent(description)}`, "_blank")
        } else {
            window.open(`mailto:?${query}&body=${encodeURIComponent(description)}`, "_self")
        }
        setSuccessId(eq.id)
        setTimeout(() => setSuccessId(null), 4000)
    }

    return (
        <div className="flex flex-col gap-0 -m-8">
            <div className="px-8 py-6 flex flex-col gap-6">
                <div>
                    <h1 className="text-[26px] font-extrabold text-[#082187]">Gestion des Équipements</h1>
                    <p className="text-[14px] text-gray-400 mt-1">Supervisez et gérez l&apos;ensemble de l&apos;inventaire technologique de vos salles.</p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-white border border-gray-200 p-1 rounded-xl shadow-sm gap-0.5">
                            <button
                                onClick={() => { setFilterType("ALL"); setPage(1) }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    filterType === "ALL" ? "bg-[#082187] text-white shadow" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <FormatListBulletedIcon style={{ fontSize: 14 }} /> Tous
                            </button>
                            {Object.entries(EQ_TYPE_LABELS).map(([val, label]) => (
                                <button
                                    key={val}
                                    onClick={() => { setFilterType(val); setPage(1) }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                        filterType === val ? "bg-[#082187] text-white shadow" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="flex items-center [&_svg]:!mb-0">{getEqIcon(val, "small")}</span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                        <input
                            type="text"
                            placeholder="Rechercher un équipement..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            className="pl-9 pr-4 py-2 text-sm rounded-lg bg-[#f1f5f9] border-none focus:outline-none focus:ring-2 focus:ring-[#082187]/10 w-64 text-gray-600"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-gray-500 font-semibold">Nom de l&apos;équipement</th>
                                <th className="text-left px-4 py-4 text-gray-500 font-semibold">Type</th>
                                <th className="text-left px-4 py-4 text-gray-500 font-semibold">Quantité</th>
                                <th className="text-left px-4 py-4 text-gray-500 font-semibold">Salle assignée</th>
                                <th className="text-left px-4 py-4 text-gray-500 font-semibold">Statut</th>
                                <th className="text-left px-4 py-4 text-gray-500 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Chargement...</td></tr>
                            )}
                            {!loading && paginated.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Aucun équipement trouvé.</td></tr>
                            )}
                            {!loading && paginated.map((eq: Equipement) => (
                                <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center">{getEqIcon(eq.equipementType, "small")}</span>
                                            <span className="font-semibold text-gray-800">{eq.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{EQ_TYPE_LABELS[eq.equipementType] || eq.equipementType}</td>
                                    <td className="px-4 py-4 font-bold text-gray-800">{String(eq.quantity).padStart(2, "0")}</td>
                                    <td className="px-4 py-4">
                                        {eq.roomId ? (
                                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-lg">
                                                Salle {eq.roomId}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {eq.quantity > 0 ? (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full w-fit">
                                                <CheckCircleIcon style={{ fontSize: 12 }} /> À JOUR
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full w-fit">
                                                <WarningAmberIcon style={{ fontSize: 12 }} /> REQUIS
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {successId === eq.id ? (
                                            <span className="text-green-500 text-xs font-semibold flex items-center gap-1">
                                                <CheckCircleIcon style={{ fontSize: 14 }} /> Ticket créé !
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleReclamer(eq)}
                                                disabled={reclamerLoading === eq.id}
                                                className="flex items-center gap-1 text-xs font-semibold text-orange-500 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
                                            >
                                                <ReportProblemIcon style={{ fontSize: 14 }} />
                                                {reclamerLoading === eq.id ? "Envoi..." : "Réclamer"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Affichage de {Math.min((page - 1) * PER_PAGE + 1, filtered.length)} à {Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length} équipements
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition text-xs">‹</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${p === page ? "bg-[#1a1a6e] text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}>
                                        {p}
                                    </button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition text-xs">›</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
