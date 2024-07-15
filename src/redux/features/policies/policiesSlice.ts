import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Policy {
  _id: string;
  name: string;
  description: string;
  document_url: string;
}

interface policiesState {
  policies: Policy[];
  loading: boolean;
  error: string | null;
}

const initialState: policiesState = {
  policies: [],
  loading: false,
  error: null,
};

export const fetchPolicies = createAsyncThunk('policies/fetchPolicies', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/policies/get`)
  if (!response.ok) {
    throw new Error('Failed to fetch policies')
  }
  return (await response.json()) as Policy[]
})

export const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.policies = action.payload
        state.loading = false
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Something went wrong"
      })
  },
})

export default policiesSlice.reducer;
