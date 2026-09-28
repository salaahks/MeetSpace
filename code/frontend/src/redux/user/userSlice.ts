import {
    FETCH_USERS,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    ADD_USER,
    UPDATE_USER,
    DELETE_USER,
    USER_ACTION_FINISHED,
} from './constants'
import type { User } from './types'

interface UserState {
    loading: boolean
    actionLoading: boolean
    users: User[]
    error: string
}

interface UserAction {
    type: string
    payload?: User[] | string
}

const initialState: UserState = {
    loading: false,
    actionLoading: false,
    users: [],
    error: '',
}

export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case FETCH_USERS:
            return { ...state, loading: true }
        case FETCH_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload as User[], error: '' }
        case FETCH_USERS_FAILURE:
            return { ...state, loading: false, users: [], error: action.payload as string }
        case ADD_USER:
        case UPDATE_USER:
        case DELETE_USER:
            return { ...state, actionLoading: true }
        case USER_ACTION_FINISHED:
            return { ...state, actionLoading: false }
        default:
            return state
    }
}

export default userReducer
