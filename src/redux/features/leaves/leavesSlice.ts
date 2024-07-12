import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Leave {
  _id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  status: string;
  application: string;
  type: string;
  day: string;
}

interface leaveState {
  leaves: Leave[];
  loading: boolean;
  error: string | null;
}

const initialState: leaveState = {
  leaves: [],
  loading: false,
  error: null,
};

export const fetchLeaves = createAsyncThunk('leaves/fetchLeaves', async () => {
  const response = await fetch('http://localhost:5500/leaves/get');
  if (!response.ok) {
    throw new Error('Failed to fetch leaves');
  }
  return (await response.json()) as Leave[]
})

export const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeaves.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong'
      })
  }
})

export default leaveSlice.reducer;
