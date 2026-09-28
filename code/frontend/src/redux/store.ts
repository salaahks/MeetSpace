import { combineReducers, configureStore } from "@reduxjs/toolkit";
import roomReducer from "./room/roomSlice";
import equipementReducer from "./equipement/equipementSlice";
import userReducer from "./user/userSlice";

const reducer = combineReducers({
    roomState: roomReducer,
    equipementState: equipementReducer,
    userState: userReducer,
})

const store = configureStore({ reducer })

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;