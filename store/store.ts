import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import historyReducer from './historySlice';

enableMapSet();

const store = configureStore({
  reducer: {
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
