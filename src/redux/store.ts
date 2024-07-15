// store.ts (for TypeScript)

import { configureStore } from '@reduxjs/toolkit';

import teamsReducer from './features/teams/teamsSlice';
import employeesReducer from './features/employees/employeesSlice';


const store = configureStore({
    reducer: {
        // Add your reducers here
        teams: teamsReducer,
        employees: employeesReducer
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
