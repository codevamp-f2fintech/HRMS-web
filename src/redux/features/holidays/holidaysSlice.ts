import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface Holiday {
  _id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  note: string;
  year: string;
}

interface holidaysState {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
}

const initialState: holidaysState = {
  holidays: [],
  loading: false,
  error: null,
};

export const fetchHolidays = createAsyncThunk('holidays/fetchHolidays', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/holidays/get`);
  if (!response.ok) {
    throw new Error('Failed to fetch holidays');
  }
  return (await response.json()) as Holiday[];
})

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHolidays.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.holidays = action.payload;
        state.loading = false;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
  }
});


export default holidaysSlice.reducer;
