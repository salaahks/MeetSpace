import {
    FETCH_EQUIPEMENTS,
    FETCH_EQUIPEMENTS_SUCCESS,
    FETCH_EQUIPEMENTS_FAILURE,
    ADD_EQUIPEMENT,
    UPDATE_EQUIPEMENT,
    DELETE_EQUIPEMENT,
    ACTION_FINISHED,
} from './constants'
import type { Equipement } from './types'

interface EquipementState {
    loading: boolean
    actionLoading: boolean
    equipements: Equipement[]
    error: string
}

interface EquipementAction {
    type: string
    payload?: Equipement[] | string
}

const initialState: EquipementState = {
    loading: true,
    actionLoading: false,
    equipements: [],
    error: '',
}

export const equipementReducer = (
    state = initialState,
    action: EquipementAction
): EquipementState => {
    switch (action.type) {
        case FETCH_EQUIPEMENTS:
            return {
                ...state,
                loading: true,
            }

        case FETCH_EQUIPEMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                equipements: action.payload as Equipement[],
                error: '',
            }

        case FETCH_EQUIPEMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                equipements: [],
                error: action.payload as string,
            }

        case ADD_EQUIPEMENT:
        case UPDATE_EQUIPEMENT:
        case DELETE_EQUIPEMENT:
            return {
                ...state,
                actionLoading: true,
            }

        case ACTION_FINISHED:
            return {
                ...state,
                actionLoading: false,
            }

        default:
            return state
    }
}

export default equipementReducer