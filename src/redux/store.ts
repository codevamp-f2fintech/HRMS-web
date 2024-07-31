// store.ts (for TypeScript)

import { configureStore } from '@reduxjs/toolkit';

import teamsReducer from './features/teams/teamsSlice';
import holidaysReducer from './features/holidays/holidaysSlice';
import assestsReducer from './features/assests/assestsSlice';
import leavesReducer from './features/leaves/leavesSlice';
import attendancesReducer from './features/attendances/attendancesSlice';
import policiesReducer from './features/policies/policiesSlice';
import employeesReducer from './features/employees/employeesSlice';
import timesheetsReducer from './features/timesheet/timesheetSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    teams: teamsReducer,
    holidays: holidaysReducer,
    assests: assestsReducer,
    leaves: leavesReducer,
    attendances: attendancesReducer,
    policies: policiesReducer,
    employees: employeesReducer,
    timesheets: timesheetsReducer,
  }
})


export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
