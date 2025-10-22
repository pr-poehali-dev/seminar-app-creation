import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Seminar {
  id: number;
  name: string;
  speaker: string;
  date: string;
  type: 'future' | 'history' | 'request';
  status: string;
  likes?: number;
  requestedBy?: string;
}

interface SeminarsState {
  seminars: Seminar[];
  searchQuery: string;
  currentTab: 'future' | 'history' | 'request';
  page: number;
  rowsPerPage: number;
}

const initialState: SeminarsState = {
  seminars: [],
  searchQuery: '',
  currentTab: 'future',
  page: 0,
  rowsPerPage: 10,
};

const seminarsSlice = createSlice({
  name: 'seminars',
  initialState,
  reducers: {
    setSeminars: (state, action: PayloadAction<Seminar[]>) => {
      state.seminars = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 0;
    },
    setCurrentTab: (state, action: PayloadAction<'future' | 'history' | 'request'>) => {
      state.currentTab = action.payload;
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    deleteSeminar: (state, action: PayloadAction<number>) => {
      state.seminars = state.seminars.filter(seminar => seminar.id !== action.payload);
    },
  },
});

export const {
  setSeminars,
  setSearchQuery,
  setCurrentTab,
  setPage,
  setRowsPerPage,
  deleteSeminar,
} = seminarsSlice.actions;

export default seminarsSlice.reducer;
