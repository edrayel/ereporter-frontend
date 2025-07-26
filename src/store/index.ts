import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import agentsSlice from './slices/agentsSlice';
import authSlice from './slices/authSlice';
import notificationsSlice from './slices/notificationsSlice';
import pollingUnitsSlice from './slices/pollingUnitsSlice';
import reportsSlice from './slices/reportsSlice';
import resultsSlice from './slices/resultsSlice';
import uiSlice from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Persist auth and UI state (including theme)
};

const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  agents: agentsSlice,
  reports: reportsSlice,
  results: resultsSlice,
  pollingUnits: pollingUnitsSlice,
  notifications: notificationsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
