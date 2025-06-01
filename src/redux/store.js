import { configureStore } from '@reduxjs/toolkit';
import photographerReducer from './photoGrapherSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    photographer: photographerReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;