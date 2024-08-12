// features/employees/employeesSlice.ts

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  role_priority: string;
  dob: string;
  gender: string;
  designation: string;
  password: string;
  joining_date: string;
  leaving_date: string;
  status: string;
}

interface EmployeesState {
  employees: Employee[];
  filteredEmployees: Employee[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

const initialState: EmployeesState = {
  employees: [],
  filteredEmployees: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  hasMore: true,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async ({ page = 1, limit = 0 }: { page?: number; limit?: number }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const data = await response.json();


    return data as { employees: Employee[]; total: number };
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    filterEmployees(state, action: PayloadAction<{ name: string; designation: string }>) {
      const { name, designation } = action.payload;

      state.filteredEmployees = state.employees.filter(employee => {
        return (
          (name ? employee.first_name.toLowerCase().includes(name.toLowerCase()) || employee.last_name.toLowerCase().includes(name.toLowerCase()) : true) &&
          (designation ? employee.designation === designation : true)
        );
      });
    },
    resetFilter(state) {
      state.filteredEmployees = state.employees;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.filteredEmployees = action.payload;
        state.total = action.payload.total;
        state.loading = false;
        state.hasMore = state.employees.length < state.total;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { filterEmployees, resetFilter } = employeesSlice.actions;
export default employeesSlice.reducer;
