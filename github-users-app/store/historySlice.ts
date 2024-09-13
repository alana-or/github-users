import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  visitedUsers: string[];
}

const initialState: HistoryState = {
  visitedUsers: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addVisitedUser: (state, action: PayloadAction<string>) => {
      if (!state.visitedUsers.includes(action.payload)) {
        state.visitedUsers.push(action.payload);
      }
    },
  },
});

export const { addVisitedUser } = historySlice.actions;
export default historySlice.reducer;
