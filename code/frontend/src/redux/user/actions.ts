import axiosInstance from '../axios-instance'
import {
    FETCH_USERS,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    ADD_USER,
    UPDATE_USER,
    DELETE_USER,
    USER_ACTION_FINISHED,
} from './constants'
import type { AppDispatch } from '../store'
import type { User } from './types'

const URL_USERS = '/users'

export const fetchUsers = () => (dispatch: AppDispatch) => {
    dispatch({ type: FETCH_USERS })
    axiosInstance
        .get(`${URL_USERS}?size=100`)
        .then((res) => dispatch({ type: FETCH_USERS_SUCCESS, payload: res.data.content ?? res.data }))
        .catch((err) => dispatch({ type: FETCH_USERS_FAILURE, payload: err?.response?.status }))
}

export const addUser = ({
    userData,
    onSuccess = () => {},
    onError = () => {},
}: {
    userData: Omit<User, 'id'>
    onSuccess?: (data?: User) => void
    onError?: (error?: unknown) => void
}) => (dispatch: AppDispatch) => {
    dispatch({ type: ADD_USER })
    axiosInstance
        .post(URL_USERS, userData)
        .then((res) => { dispatch({ type: USER_ACTION_FINISHED }); onSuccess(res.data) })
        .catch((err) => { dispatch({ type: USER_ACTION_FINISHED }); onError(err?.response) })
}

export const updateUser = ({
    id,
    userData,
    onSuccess = () => {},
    onError = () => {},
}: {
    id: number
    userData: Partial<User>
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_USER })
    axiosInstance
        .put(`${URL_USERS}/${id}`, userData)
        .then(() => { dispatch({ type: USER_ACTION_FINISHED }); onSuccess() })
        .catch((err) => { dispatch({ type: USER_ACTION_FINISHED }); onError(err?.response) })
}

export const deleteUser = ({
    id,
    onSuccess = () => {},
    onError = () => {},
}: {
    id: number
    onSuccess?: () => void
    onError?: (error?: unknown) => void
}) => (dispatch: AppDispatch) => {
    dispatch({ type: DELETE_USER })
    axiosInstance
        .delete(`${URL_USERS}/${id}`)
        .then(() => { dispatch({ type: USER_ACTION_FINISHED }); onSuccess() })
        .catch((err) => { dispatch({ type: USER_ACTION_FINISHED }); onError(err?.response) })
}
