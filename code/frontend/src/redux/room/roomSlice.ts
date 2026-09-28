import {
    FETCH_ROOMS,
    FETCH_ROOMS_SUCCESS,
    FETCH_ROOMS_FAILURE,
    FETCH_ROOM_BY_ID,
    FETCH_ROOM_BY_ID_SUCCESS,
    FETCH_ROOM_BY_ID_FAILURE,
    ADD_ROOM,
    UPDATE_ROOM,
    DELETE_ROOM,
    TOGGLE_ROOM_ACTIF,
    ACTION_FINISHED,
} from './constants'
import type { Room } from './types'

export type { Room, RoomEquipement, RoomType } from './types'

interface RoomState {
    loading: boolean
    actionLoading: boolean
    rooms: Room[]
    room: Room | null
    error: string
}

interface RoomAction {
    type: string
    payload?: Room | Room[] | string
}

const initialState: RoomState = {
    loading: true,
    actionLoading: false,
    rooms: [],
    room: null,
    error: '',
}

export const roomReducer = (state = initialState, action: RoomAction): RoomState => {
    switch (action.type) {
        case FETCH_ROOMS:
            return {
                ...state,
                loading: true,
            }

        case FETCH_ROOMS_SUCCESS:
            return {
                ...state,
                loading: false,
                rooms: action.payload as Room[],
                error: '',
            }

        case FETCH_ROOMS_FAILURE:
            return {
                ...state,
                loading: false,
                rooms: [],
                error: action.payload as string,
            }

        case FETCH_ROOM_BY_ID:
            return {
                ...state,
                loading: true,
            }

        case FETCH_ROOM_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                room: action.payload as Room,
                error: '',
            }

        case FETCH_ROOM_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                room: null,
                error: action.payload as string,
            }

        case ADD_ROOM:
        case UPDATE_ROOM:
        case DELETE_ROOM:
        case TOGGLE_ROOM_ACTIF:
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

export default roomReducer