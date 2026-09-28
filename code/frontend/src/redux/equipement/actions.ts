import axiosInstance from '../axios-instance'
import { URL_EQUIPEMENTS } from '../endpoints'
import {
    FETCH_EQUIPEMENTS,
    FETCH_EQUIPEMENTS_SUCCESS,
    FETCH_EQUIPEMENTS_FAILURE,
    ADD_EQUIPEMENT,
    UPDATE_EQUIPEMENT,
    DELETE_EQUIPEMENT,
    ACTION_FINISHED,
} from './constants'
import type { AppDispatch } from '../store'
import type { Equipement } from './types'

export const fetchEquipements = (filter = {}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: FETCH_EQUIPEMENTS })
        axiosInstance
            .get(`${URL_EQUIPEMENTS}`, { params: filter })
            .then((res) => {
                dispatch({
                    type: FETCH_EQUIPEMENTS_SUCCESS,
                    payload: res.data,
                })
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_EQUIPEMENTS_FAILURE,
                    payload: error?.response?.status,
                })
            })
    }
}

export const addEquipement = ({
    equipementData,
    onSuccess = () => { },
    onError = () => { },
}: {
    equipementData: Omit<Equipement, 'id'>
    onSuccess?: (data?: Equipement) => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: ADD_EQUIPEMENT })
        axiosInstance
            .post(`${URL_EQUIPEMENTS}`, equipementData)
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

export const updateEquipement = ({
    id,
    equipementData,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    equipementData: Partial<Equipement>
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: UPDATE_EQUIPEMENT })
        axiosInstance
            .put(`${URL_EQUIPEMENTS}/${id}`, equipementData)
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

export const deleteEquipement = ({
    id,
    onSuccess = () => { },
    onError = () => { },
}: {
    id: number
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => {
    return (dispatch: AppDispatch) => {
        dispatch({ type: DELETE_EQUIPEMENT })
        axiosInstance
            .delete(`${URL_EQUIPEMENTS}/${id}`)
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