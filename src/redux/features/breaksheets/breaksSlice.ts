import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

export interface Break {
    id: string
    type: string
    startTime: string
    duration: string
    date: string
}

export const fetchBreaksById = createAsyncThunk('breaks/fetchBreaksById', async (employeeId: string | null) => {
    const token = localStorage.getItem('token');
    const url = employeeId ? `${BASE_URL}/breaksheet/employee?employeeId=${employeeId}` : `${BASE_URL}/breaksheet/employee`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch breaks');
    }

    return await response.json();
});


export const addBreak = createAsyncThunk('breaks/addBreak', async (breakData: Break) => {
    const response = await fetch(`${BASE_URL}/breaksheet/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(breakData)
    })

    if (!response.ok) {
        throw new Error('Failed to add break')
    }

    return await response.json()
})

export const updateBreak = createAsyncThunk(
    'breaks/updateBreak',
    async ({ id, updatedBreak }: { id: string; updatedBreak: Break }) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/breaksheet/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBreak),
        });

        if (!response.ok) {
            throw new Error('Failed to update break');
        }

        return await response.json();
    }
);

const initialState = {
    breaks: [] as Break[],
    loading: false,
    error: null as string | null
}

const breaksSlice = createSlice({
    name: 'breaks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBreaksById.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBreaksById.fulfilled, (state, action) => {
                state.breaks = action.payload
                state.loading = false
            })
            .addCase(fetchBreaksById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch breaks'
            })
            .addCase(addBreak.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(addBreak.fulfilled, (state, action) => {
                state.breaks.push(action.payload)
                state.loading = false
            })
            .addCase(addBreak.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to add break'
            })
    }
})

export default breaksSlice.reducer
