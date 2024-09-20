import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Designation {
  _id: string;
  title: string;
  description: string;
  grade: number;
}

interface designationsState {
  designations: Designation[];
  filteredDesignation: Designation[];
  loading: boolean;
  error: string | null;
  total: number
}

const initialState: designationsState = {
  designations: [],
  filteredDesignation: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchDesignations = createAsyncThunk<{
  designations: Designation[];
  total: number;
}, { page?: number; limit?: number; keyword?: string }>(
  'designation/fetchDesignation',
  async ({ page, limit, keyword }: { page: number; limit: number; keyword: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/designation/get?page=${page}&limit=${limit}&keyword=${encodeURIComponent(
        keyword
      )}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch designations');
    }

    return (await response.json()) as { designations: Designation[], total: number };
  }
)

const designationsSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {
    filteredDesignation(state, action: PayloadAction<{ title: string }>) {
      const { title } = action.payload;

      state.filteredDesignation = state.designations.filter((des) => {
        return title ? des.title.toLowerCase().includes(title.toLowerCase()) : true;
      });
    },
    resetFilter(state) {
      state.filteredDesignation = state.designations;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDesignations.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

      .addCase(fetchDesignations.fulfilled, (state, action) => {
        console.log('action', action)
        state.designations = action.payload.designations;
        state.total = action.payload.total; // Set total number of records
        state.loading = false;
      })

      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
  }
});

export const { filteredDesignation, resetFilter } = designationsSlice.actions;
export default designationsSlice.reducer;
