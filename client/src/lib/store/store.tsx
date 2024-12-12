import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './apiSlice';
import { miningMachinesApiSlice } from '../feature/Machines/miningMachinesApiSlice';
import authReducer from '../feature/auth/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // only persist auth
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [miningMachinesApiSlice.reducerPath]: miningMachinesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(apiSlice.middleware, miningMachinesApiSlice.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;