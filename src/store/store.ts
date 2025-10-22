import { configureStore } from '@reduxjs/toolkit';
import seminarsReducer from './seminarsSlice';
import brandsReducer from './brandsSlice';

export const store = configureStore({
  reducer: {
    seminars: seminarsReducer,
    brands: brandsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;