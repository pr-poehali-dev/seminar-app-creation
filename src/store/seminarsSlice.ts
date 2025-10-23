import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
  userId: number;
  status: 'application' | 'upcoming' | 'history';
  likes?: number;
}

interface SeminarsState {
  seminars: Seminar[];
  searchQuery: string;
  currentTab: 'application' | 'upcoming' | 'history';
  page: number;
  rowsPerPage: number;
}

const initialState: SeminarsState = {
  seminars: [],
  searchQuery: '',
  currentTab: 'application',
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
    setCurrentTab: (state, action: PayloadAction<'application' | 'upcoming' | 'history'>) => {
      state.currentTab = action.payload;
      state.page = 0;
    },
    addSeminar: (state, action: PayloadAction<Seminar>) => {
      state.seminars.push(action.payload);
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
  addSeminar,
} = seminarsSlice.actions;

export default seminarsSlice.reducer;