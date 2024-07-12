// store.ts (for TypeScript)

import { configureStore } from '@reduxjs/toolkit';

import teamsReducer from './features/teams/teamsSlice';

const store = configureStore({
    reducer: {
        // Add your reducers here
        teams: teamsReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
