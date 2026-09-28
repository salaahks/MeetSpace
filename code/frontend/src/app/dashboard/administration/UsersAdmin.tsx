"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { addUser, updateUser, deleteUser, fetchUsers } from "@/redux/user/actions"
import type { User, UserRole } from "@/redux/user/types"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckIcon from "@mui/icons-material/Check"
import DeleteModal from "./components/DeleteModal"
import { TENANT_DOMAIN } from "@/utils/constants"

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "RH", "USER", "GUEST"]

const ROLE_STYLES: Record<UserRole, string> = {
    ADMIN:   "bg-purple-50 text-purple-700",
    MANAGER: "bg-blue-50 text-blue-700",
    RH:      "bg-green-50 text-green-700",
    USER:    "bg-gray-100 text-gray-600",
    GUEST:   "bg-orange-50 text-orange-600",
}

const DOMAIN = `@${TENANT_DOMAIN}`

const emptyUser: Omit<User, 'id'> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "USER",
}

function toUsername(email: string) {
    return email.endsWith(DOMAIN) ? email.slice(0, -DOMAIN.length) : email
}

interface ModalState {
    open: boolean
    data: User | null
}

interface DeleteState {
    open: boolean
    id: number | null
    label: string
}

interface Props {
    search: string
}

export default function UsersAdmin({ search }: Props) {
    const dispatch = useDispatch<AppDispatch>()
    const { users, loading, actionLoading } = useSelector((state: RootState) => state.userState)

    const [modal, setModal] = useState<ModalState>({ open: false, data: null })
    const [deleteState, setDeleteState] = useState<DeleteState>({ open: false, id: null, label: "" })
    const [form, setForm] = useState<Omit<User, 'id'>>(emptyUser)
    const [createdPassword, setCreatedPassword] = useState<{ name: string; password: string } | null>(null)
    const [copied, setCopied] = useState(false)

    const filtered = users.filter((u) =>
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )

    const openAdd = () => {
        setForm(emptyUser)
        setModal({ open: true, data: null })
    }

    const openEdit = (u: User) => {
        setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone ?? "", role: u.role })
        setModal({ open: true, data: u })
    }

    const handleSave = () => {
        if (modal.data) {
            dispatch(updateUser({
                id: modal.data.id,
                userData: form,
                onSuccess: () => { dispatch(fetchUsers()); setModal({ open: false, data: null }) },
            }))
        } else {
            dispatch(addUser({
                userData: form,
                onSuccess: (data) => {
                    dispatch(fetchUsers())
                    setModal({ open: false, data: null })
                    if (data?.temporaryPassword) {
                        setCreatedPassword({ name: `${form.firstName} ${form.lastName}`, password: data.temporaryPassword })
                    }
                },
            }))
        }
    }

    const handleCopy = () => {
        if (!createdPassword) return
        navigator.clipboard.writeText(createdPassword.password)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDelete = () => {
        if (!deleteState.id) return
        dispatch(deleteUser({
            id: deleteState.id,
            onSuccess: () => { dispatch(fetchUsers()); setDeleteState({ open: false, id: null, label: "" }) },
        }))
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.06)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">
                    Utilisateurs ({filtered.length})
                </h2>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-[#082187] hover:bg-[#06186b] text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                >
                    <AddIcon fontSize="small" /> Ajouter un utilisateur
                </button>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#f8fafc] text-gray-500 text-xs uppercase tracking-wide">
                        <th className="text-left px-6 py-3 font-semibold">Utilisateur</th>
                        <th className="text-left px-6 py-3 font-semibold">Email</th>
                        <th className="text-left px-6 py-3 font-semibold">Téléphone</th>
                        <th className="text-left px-6 py-3 font-semibold">Rôle</th>
                        <th className="text-left px-6 py-3 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr><td colSpan={5} className="text-center py-12 text-gray-400">Chargement...</td></tr>
                    )}
                    {!loading && filtered.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun utilisateur trouvé.</td></tr>
                    )}
                    {!loading && filtered.map((u) => (
                        <tr key={u.id} className="border-t border-gray-50 hover:bg-[#f8fafc] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#082187]/10 flex items-center justify-center text-[#082187] font-bold text-sm">
                                        {u.firstName?.charAt(0).toUpperCase()}{u.lastName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800">{u.firstName} {u.lastName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                            <td className="px-6 py-4 text-gray-500">{u.phone || "—"}</td>
                            <td className="px-6 py-4">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${ROLE_STYLES[u.role]}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEdit(u)}
                                        className="p-2 rounded-lg text-[#082187] hover:bg-[#082187]/10 transition"
                                        title="Modifier"
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteState({ open: true, id: u.id, label: `${u.firstName} ${u.lastName}` })}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#082187]/10 flex items-center justify-center">
                                <PersonIcon className="text-[#082187]" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                {modal.data ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500">Prénom</label>
                                <input
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#082187]"
                                    placeholder="Prénom"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500">Nom</label>
                                <input
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#082187]"
                                    placeholder="Nom"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Email</label>
                            <div className={`flex items-center border rounded-lg overflow-hidden text-sm ${modal.data ? "bg-gray-50 border-gray-100" : "border-gray-200"}`}>
                                <input
                                    value={toUsername(form.email)}
                                    onChange={(e) => setForm({ ...form, email: e.target.value + DOMAIN })}
                                    className="flex-1 px-3 py-2 focus:outline-none bg-transparent disabled:text-gray-400"
                                    placeholder="prenom.nom"
                                    disabled={!!modal.data}
                                />
                                <span className="px-3 py-2 bg-[#f1f5f9] text-gray-400 text-xs font-medium border-l border-gray-200 select-none whitespace-nowrap">
                                    {DOMAIN}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Téléphone</label>
                            <input
                                value={form.phone ?? ""}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#082187]"
                                placeholder="+212 6..."
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Rôle</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#082187]"
                            >
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setModal({ open: false, data: null })}
                                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={actionLoading || !form.firstName || !form.lastName || !form.email}
                                className="flex-1 py-2.5 rounded-lg bg-[#082187] hover:bg-[#06186b] text-white font-bold transition disabled:opacity-50"
                            >
                                {actionLoading ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteState.open && (
                <DeleteModal
                    label={deleteState.label}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteState({ open: false, id: null, label: "" })}
                />
            )}

            {createdPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-5">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckIcon className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Compte créé !</h3>
                            <p className="text-sm text-gray-500">
                                Envoyez ce mot de passe temporaire à <span className="font-semibold text-gray-700">{createdPassword.name}</span>. Il devra le changer à la première connexion.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#f1f5f9] rounded-xl px-4 py-3">
                            <span className="flex-1 font-mono text-sm font-bold text-gray-800 tracking-widest">{createdPassword.password}</span>
                            <button
                                onClick={handleCopy}
                                className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-500"
                                title="Copier"
                            >
                                {copied ? <CheckIcon fontSize="small" className="text-green-600" /> : <ContentCopyIcon fontSize="small" />}
                            </button>
                        </div>
                        <button
                            onClick={() => { setCreatedPassword(null); setCopied(false) }}
                            className="w-full py-2.5 rounded-lg bg-[#082187] hover:bg-[#06186b] text-white font-bold transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
