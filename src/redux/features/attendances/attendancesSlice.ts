import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Attendance {
  _id: string;
  employee_id: string;
  date: Date;
  status: string;
}

interface attendancesState {
  attendances: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: attendancesState = {
  attendances: [],
  loading: false,
  error: null,
};

export const fetchAttendances = createAsyncThunk('attendances/fetchAttendances', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/attendence/get`)
  if (!response.ok) {
    throw new Error('Failed to fetch attendances')
  }
  return (await response.json()) as Attendance[]
})

export const attendancesSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAttendances.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.attendances = action.payload
        state.loading = false
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'  // Assuming error message is stored as a string in the API response
      })
  },
})

export default attendancesSlice.reducer;
