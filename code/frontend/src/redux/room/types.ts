export type RoomType =
    | 'CONFERENCE'
    | 'REUNION'
    | 'SALLE_CONSEIL'
    | 'SALON'
    | 'FORMATION'
    | 'EXECUTIF'

export type BuildingType =
    | 'FINANCE'
    | 'IT'
    | 'HORS_FINANCE_IT'

export const BUILDING_LABELS: Record<BuildingType, string> = {
    FINANCE: 'Finance',
    IT: 'IT',
    HORS_FINANCE_IT: 'Hors Finance & IT',
}

export const BUILDING_TYPES: BuildingType[] = ['FINANCE', 'IT', 'HORS_FINANCE_IT']

export interface RoomEquipement {
    id: number
    name?: string
    nom?: string
    quantity?: number
    equipementType?: string
    roomId?: number | null
}

export interface Room {
    id: number
    nom: string
    capacite: number
    actif: boolean
    qrCodeUrl?: string
    localisation?: string
    building?: BuildingType | string
    roomType?: RoomType | string
    mapX?: number | null
    mapY?: number | null
    equipements?: RoomEquipement[]
}