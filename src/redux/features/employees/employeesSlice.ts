// features/employees/employeesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: EmployeesState = {
  employees: [],
  filteredEmployees: [],
  loading: false,
  error: null,
};

// Thunk for fetching employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get`);

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }


  return (await response.json()) as Employee[];
});

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
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { filterEmployees, resetFilter } = employeesSlice.actions;
export default employeesSlice.reducer;
