import type { Room } from "@/redux/room/types"
import type { Equipement, EquipementType } from "@/redux/equipement/types"

export type RoomTypeValue = 'CONFERENCE' | 'REUNION' | 'SALLE_CONSEIL' | 'SALON' | 'FORMATION' | 'EXECUTIF'

export const ROOM_TYPES: RoomTypeValue[] = [
    'CONFERENCE', 'REUNION', 'SALLE_CONSEIL', 'SALON', 'FORMATION', 'EXECUTIF',
]

export const EQUIPEMENT_TYPES: EquipementType[] = [
    'PROJECTEUR', 'ECRAN_PROJECTEUR', 'CLIMATISATION', 'TABLEAU_BLANC',
    'TELEVISEUR', 'SYSTEME_AUDIO', 'VISIOCONFERENCE', 'MICROPHONE',
]

export const ROOM_TYPE_LABELS: Record<RoomTypeValue, string> = {
    CONFERENCE: 'Conférence',
    REUNION: 'Réunion',
    SALLE_CONSEIL: 'Salle Conseil',
    SALON: 'Salon',
    FORMATION: 'Formation',
    EXECUTIF: 'Exécutif',
}

export const EQ_TYPE_LABELS: Record<EquipementType, string> = {
    PROJECTEUR: 'Projecteur',
    ECRAN_PROJECTEUR: 'Ecran Projecteur',
    CLIMATISATION: 'Climatisation',
    TABLEAU_BLANC: 'Tableau Blanc',
    TELEVISEUR: 'Téléviseur',
    SYSTEME_AUDIO: 'Système Audio',
    VISIOCONFERENCE: 'Visioconférence',
    MICROPHONE: 'Microphone',
}

export const emptyRoom = (): Omit<Room, 'id'> => ({
    nom: '', capacite: 10, actif: true, localisation: '', building: '', roomType: 'REUNION',
})

export const emptyEquipement = (): Omit<Equipement, 'id'> => ({
    name: '', quantity: 1, equipementType: 'PROJECTEUR', roomId: null,
})
