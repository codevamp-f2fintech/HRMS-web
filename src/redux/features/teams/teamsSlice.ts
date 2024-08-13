/* eslint-disable newline-before-return */
/* eslint-disable padding-line-between-statements */
// features/teams/teamsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Team {
  _id: string;
  name: string;
  manager_id: string;
  employee_ids: string;
  code: string;
}

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  total: number
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  total: 0
};

// Thunk for fetching teams
export const fetchTeams = createAsyncThunk('teams/fetchTeams', async ({ page, limit, keyword }: { page: number; limit: number; keyword: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/teams/get?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  return (await response.json()) as { teams: Team[], total: number };
});

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // You can add more reducers here for additional actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload.teams;
        state.total = action.payload.total; // Set total number of records
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default teamsSlice.reducer;
