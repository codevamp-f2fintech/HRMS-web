import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

export interface Punch {
    id: string
    punchIn: string
    punchOut: string
    totalTime: string
    date: string
    employee: string
}

export interface TotalWorkingHours {
    hours: number
    minutes: number
    seconds: number
}

export const fetchTotalWorkingHours = createAsyncThunk(
    'punch/fetchTotalWorkingHours',
    async ({ employeeId, date }: { employeeId: string | null; date: string }) => {
        const token = localStorage.getItem('token')
        const url = `${BASE_URL}/punch/working-hours?employeeId=${employeeId}&date=${date}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch total working hours')
        }

        return await response.json()
    }
)

export const fetchPunchByEmployeeAndDate = createAsyncThunk(
    'punch/fetchPunchByEmployeeAndDate',
    async ({ employeeId, date }: { employeeId: string | null; date: string }) => {
        const token = localStorage.getItem('token')
        const url = `${BASE_URL}/punch/employee/${employeeId}?date=${date}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch punch data')
        }

        const responseData = await response.text()

        if (!responseData) {
            return null
        }

        return JSON.parse(responseData)
    }
)

export const addPunch = createAsyncThunk('punch/addPunch', async (punchData: Punch) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/punch/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(punchData)
    })

    if (!response.ok) {
        throw new Error('Failed to add punch')
    }

    return await response.json()
})

const initialState = {
    punches: [] as Punch[],
    punch: null as Punch | null,
    totalWorkingHours: null as TotalWorkingHours | null,
    loading: false,
    error: null as string | null
}

const punchSlice = createSlice({
    name: 'punch',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTotalWorkingHours.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTotalWorkingHours.fulfilled, (state, action) => {
                state.totalWorkingHours = action.payload
                state.loading = false
            })
            .addCase(fetchTotalWorkingHours.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch total working hours'
            })

            .addCase(fetchPunchByEmployeeAndDate.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPunchByEmployeeAndDate.fulfilled, (state, action) => {
                state.punch = action.payload
                state.loading = false
            })
            .addCase(fetchPunchByEmployeeAndDate.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch punch data'
            })
            .addCase(addPunch.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(addPunch.fulfilled, (state, action) => {
                state.punches.push(action.payload)
                state.loading = false
            })
            .addCase(addPunch.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to add punch'
            })
    }
})

export default punchSlice.reducer
