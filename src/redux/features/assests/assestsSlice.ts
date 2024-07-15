import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface Assest {
  _id: string;
  employee_id: string;
  name: string;
  model: string;
  sno: string;
  type: string;
  description: string;
  assignment_date: string;
  return_date: string;
}

interface assestsState {
  assests: Assest[];
  loading: boolean;
  error: string | null;
}

const initialState: assestsState = {
  assests: [],
  loading: false,
  error: null,
}

export const fetchAssests = createAsyncThunk('assests/fethAssests', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/assests/get`)
  if (!response.ok) {
    throw new Error('Failed to fetch assests')
  }
  return (await response.json()) as Assest[]
})

const assestsSlice = createSlice({
  name: 'assests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssests.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchAssests.fulfilled, (state, action) => {
        state.assests = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
  },
})

export default assestsSlice.reducer;
