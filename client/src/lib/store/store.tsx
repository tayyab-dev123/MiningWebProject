'use client'
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { adminApiSlice } from '../feature/auth/adminApiSlice';


import authReducer from '../feature/auth/authSlice';
import userMachineReducer from '../feature/userMachine/usermachineApi';
import { baseApiSlice } from './apiSlice';
import { miningMachinesApiSlice } from '../feature/Machines/miningMachinesApiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'userMachine'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserMachineReducer = persistReducer(persistConfig, userMachineReducer);

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,

    auth: persistedAuthReducer,
    userMachine: persistedUserMachineReducer,
    [miningMachinesApiSlice.reducerPath]: miningMachinesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      baseApiSlice.middleware, 
      miningMachinesApiSlice.middleware
    ),
});

export const persistor = persistStore(store);

// Export types for use in other files
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;