import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';

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

let token: string | null = null;

if (typeof window !== "undefined") {
  token = localStorage?.getItem("token");
}

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async ({ page = 1, limit = 12 }: { page?: number; limit?: number }, { getState }) => {
    const state = getState() as RootState;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const data = await response.json();

    // Filter out employees that are already in the state
    const newEmployees = data.filter((employee: Employee) =>
      !state.employees.employees.some((existingEmployee: Employee) => existingEmployee._id === employee._id)
    );

    return {
      employees: [...state.employees.employees, ...newEmployees],
      hasMore: data.length === limit,
    };
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

export const { filterEmployees, resetFilter } = employeesSlice.actions;
export default employeesSlice.reducer;
