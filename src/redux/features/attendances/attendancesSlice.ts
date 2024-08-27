import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Attendance {
  _id: string;
  employee: {
    _id: string;
    first_name: string;
    last_name: string;
    image: string;
    location: string;
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



export const fetchAttendances = createAsyncThunk('attendances/fetchAttendances', async () => {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

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
    resetAttendances(state) {
      state.attendances = [];
      state.filteredAttendance = [];
    },
    filterAttendance(state, action: PayloadAction<{ name: string, location: string }>) {
      const { name, location } = action.payload;

      state.filteredAttendance = state.attendances.filter(attendance => {
        // Safeguard against null or undefined employee objects
        const employee = attendance.employee;

        // If employee is null or undefined, skip this attendance record
        if (!employee) return false;

        const nameMatch = name
          ? employee.first_name?.toLowerCase().includes(name.toLowerCase()) ||
          employee.last_name?.toLowerCase().includes(name.toLowerCase())
          : true;

        const locationMatch = location && location.toLowerCase() !== 'all'
          ? employee.location?.toLowerCase().includes(location.toLowerCase())
          : true;

        return nameMatch && locationMatch;
      });
    },

    resetFilter(state) {
      state.filteredAttendance = state.attendances;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAttendances.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.attendances = action.payload;
        state.loading = false;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});


export const { filterAttendance, resetFilter, resetAttendances } = attendancesSlice.actions;

export default attendancesSlice.reducer;
