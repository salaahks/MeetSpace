"use client"

export default function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none ${
                checked ? 'bg-[#082187]' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                    checked ? 'translate-x-5' : 'translate-x-0.5'
                }`}
            />
        </button>
    )
}
