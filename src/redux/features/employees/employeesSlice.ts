import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

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
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  filteredEmployees: [],
  hasMore: true,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (
    { page = 1, limit = 12, search = '' }: { page?: number; limit?: number; search?: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const isSearch = search.trim().length > 0;
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}&search=${search}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const data = await response.json();

    let employees = isSearch ? [] : state.employees.employees;

    const newEmployees = data.filter(
      (employee: Employee) => !employees.some((existingEmployee) => existingEmployee._id === employee._id)
    );

    return {
      employees: [...employees, ...newEmployees],
      hasMore: data.length === limit,
    };
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    resetEmployees(state) {
      state.employees = [];
      state.filteredEmployees = [];
      state.hasMore = true;
      state.error = null;
    },
    updateEmployee(state, action: PayloadAction<Employee>) {
      const updatedEmployee = action.payload;
      const index = state.employees.findIndex(emp => emp._id === updatedEmployee._id);

      if (index !== -1) {
        state.employees[index] = updatedEmployee;
      }
    },
    addOrUpdateEmployee(state, action: PayloadAction<Employee>) {
      const updatedEmployee = action.payload;
      const index = state.employees.findIndex(emp => emp._id === updatedEmployee._id);

      if (index !== -1) {
        state.employees[index] = updatedEmployee;
      } else {
        state.employees.push(updatedEmployee);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.filteredEmployees = action.payload.employees;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { resetEmployees, updateEmployee, addOrUpdateEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
