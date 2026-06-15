import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

// Safe storage wrapper to handle localStorage availability
const safeStorage = {
    getItem: (key) => {
        return new Promise((resolve, reject) => {
            try {
                const item = typeof window !== 'undefined' && localStorage ? localStorage.getItem(key) : null;
                resolve(item);
            } catch (e) {
                reject(e);
            }
        });
    },
    setItem: (key, value) => {
        return new Promise((resolve, reject) => {
            try {
                if (typeof window !== 'undefined' && localStorage) {
                    localStorage.setItem(key, value);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
    removeItem: (key) => {
        return new Promise((resolve, reject) => {
            try {
                if (typeof window !== 'undefined' && localStorage) {
                    localStorage.removeItem(key);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
};

const persistConfig = {
    key: 'root',
    version: 1,
    storage: safeStorage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    job:jobSlice,
    company:companySlice,
    application:applicationSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;