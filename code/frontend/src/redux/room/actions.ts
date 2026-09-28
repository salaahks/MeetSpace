import axiosInstance from '../axios-instance'
import { URL_ROOMS } from '../endpoints'
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
import type { AppDispatch } from '../store'
import type { Room } from './roomSlice'

export const fetchRooms = (filter = {}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: FETCH_ROOMS })
        axiosInstance
            .get(`${URL_ROOMS}`, { params: filter })
            .then((res) => {
                dispatch({
                    type: FETCH_ROOMS_SUCCESS,
                    payload: res.data,
                })
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ROOMS_FAILURE,
                    payload: error?.response?.status,
                })
            })
    }
}

export const fetchActiveRooms = () => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: FETCH_ROOMS })
        axiosInstance
            .get(`${URL_ROOMS}/actives`)
            .then((res) => {
                dispatch({
                    type: FETCH_ROOMS_SUCCESS,
                    payload: res.data,
                })
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ROOMS_FAILURE,
                    payload: error?.response?.status,
                })
            })
    }
}

export const fetchRoomById = (id: number) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: FETCH_ROOM_BY_ID })
        axiosInstance
            .get(`${URL_ROOMS}/${id}`)
            .then((res) => {
                dispatch({
                    type: FETCH_ROOM_BY_ID_SUCCESS,
                    payload: res.data,
                })
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ROOM_BY_ID_FAILURE,
                    payload: error?.response?.status,
                })
            })
    }
}

export const addRoom = ({
    roomData,
    onSuccess = () => { },
    onError = () => { },
}: {
    roomData: Omit<Room, 'id'>
    onSuccess?: (data?: Room) => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: ADD_ROOM })
        axiosInstance
            .post(`${URL_ROOMS}`, roomData)
            .then((res) => {
                dispatch({ type: ACTION_FINISHED })
                onSuccess(res.data)
            })
            .catch((error) => {
                dispatch({ type: ACTION_FINISHED })
                onError(error?.response)
            })
    }
}

export const updateRoom = ({
    id,
    roomData,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    roomData: Partial<Room>
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: UPDATE_ROOM })
        axiosInstance
            .put(`${URL_ROOMS}/${id}`, roomData)
            .then(() => {
                dispatch({ type: ACTION_FINISHED })
                onSuccess()
            })
            .catch((error) => {
                dispatch({ type: ACTION_FINISHED })
                onError(error?.response)
            })
    }
}

export const deleteRoom = ({
    id,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: DELETE_ROOM })
        axiosInstance
            .delete(`${URL_ROOMS}/${id}`)
            .then(() => {
                dispatch({ type: ACTION_FINISHED })
                onSuccess()
            })
            .catch((error) => {
                dispatch({ type: ACTION_FINISHED })
                onError(error?.response)
            })
    }
}

export const toggleRoomActif = ({
    id,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: TOGGLE_ROOM_ACTIF })
        axiosInstance
            .patch(`${URL_ROOMS}/${id}/toggle-actif`)
            .then(() => {
                dispatch({ type: ACTION_FINISHED })
                onSuccess()
            })
            .catch((error) => {
                dispatch({ type: ACTION_FINISHED })
                onError(error?.response)
            })
    }
}

export const updateRoomMapPosition = ({
    id,
    mapX,
    mapY,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    mapX: number
    mapY: number
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: UPDATE_ROOM })
        axiosInstance
            .patch(`${URL_ROOMS}/${id}/map-position`, null, { params: { mapX, mapY } })
            .then(() => {
                dispatch({ type: ACTION_FINISHED })
                onSuccess()
            })
            .catch((error) => {
                dispatch({ type: ACTION_FINISHED })
                onError(error?.response)
            })
    }
}