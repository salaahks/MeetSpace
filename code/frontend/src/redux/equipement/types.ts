export type EquipementType =
    | 'PROJECTEUR'
    | 'ECRAN_PROJECTEUR'
    | 'CLIMATISATION'
    | 'TABLEAU_BLANC'
    | 'TELEVISEUR'
    | 'SYSTEME_AUDIO'
    | 'VISIOCONFERENCE'
    | 'MICROPHONE'

export interface Equipement {
    id: number
    name: string
    quantity: number
    equipementType: EquipementType
    roomId: number | null
}
