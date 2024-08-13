import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Attendance {
  _id: string;
  employee: {
    _id: string;
    first_name: string;
    last_name: string;
    image: string;
  };
  employee_id: string;
  date: Date;
  status: string;
}

interface attendancesState {
  attendances: Attendance[];
  filteredAttendance: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: attendancesState = {
  attendances: [],
  filteredAttendance: [],
  loading: false,
  error: null,
};

let token: string | null = null;

if (typeof window !== 'undefined') {
  token = localStorage.getItem('token');
}

export const fetchAttendances = createAsyncThunk('attendances/fetchAttendances', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/attendence/get`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch attendances')
  }


  return (await response.json()) as Attendance[]
})

export const attendancesSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {
    filterAttendance(state, action: PayloadAction<{ name: string }>) {
      const { name } = action.payload

      state.filteredAttendance = state.attendances.filter(attendance => {
        return (
          (name ? attendance.employee.first_name.toLowerCase().includes(name.toLowerCase()) || attendance.employee.last_name.toLowerCase().includes(name.toLowerCase()) : true)
        );
      })
    },
    resetFilter(state) {
      state.filteredAttendance = state.attendances;
    }
  },
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

export const { filterAttendance, resetFilter } = attendancesSlice.actions;

export default attendancesSlice.reducer;
