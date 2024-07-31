import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TimeSheet {
  _id: string;
  employee: {
    _id: string;
    first_name: string;
    last_name: string;
    image: string;
  };
  attendance: {
    _id: string;
    date: string;
    status: string;
  };
  employee_id: string;
  time: string;
  date: string;
  note: string;
  submission_date: string;
  status: string;
}

interface timesheetState {
  timesheets: TimeSheet[];
  loading: boolean;
  error: string | null;
}

const initialState: timesheetState = {
  timesheets: [],
  loading: false,
  error: null,
};

export const fetchTimeSheet = createAsyncThunk('timesheets/fetchTimeSheet', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/timesheets/get`);

  if (!response.ok) {
    throw new Error('Failed to fetch time sheets');
  }


  return (await response.json()) as TimeSheet[]
})

export const timesheetSlice = createSlice({
  name: 'timesheets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTimeSheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchTimeSheet.fulfilled, (state, action) => {
        state.timesheets = action.payload;
        state.loading = false;
      })
      .addCase(fetchTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong'
      })
  }
})

export default timesheetSlice.reducer;
