"use client"

import WarningAmberIcon from "@mui/icons-material/WarningAmber"

interface Props {
    label: string
    onConfirm: () => void
    onCancel: () => void
}

export default function DeleteModal({ label, onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <WarningAmberIcon className="text-red-500" fontSize="large" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center">Confirmer la suppression</h3>
                <p className="text-sm text-gray-500 text-center">
                    Voulez-vous vraiment supprimer <span className="font-semibold text-gray-700">{label}</span> ?
                    <br />Cette action est irréversible.
                </p>
                <div className="flex gap-3 w-full mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}
