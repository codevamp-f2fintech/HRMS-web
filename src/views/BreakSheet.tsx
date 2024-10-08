'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, TextField, MenuItem, Typography, Box, Autocomplete, IconButton, Tooltip } from '@mui/material'
import { addBreak, Break, fetchBreaksById, updateBreak } from '@/redux/features/breaksheets/breaksSlice'
import { RootState, AppDispatch } from '@/redux/store'
import { apiResponse } from '../utility/apiResponse/employeesResponse'
import { MoreVert } from '@mui/icons-material'
import EditBreakForm from '@/components/breaksheet/BreakSheetForm'

const BreakSheet: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const { breaks, loading, error } = useSelector((state: RootState) => state.breaks)

    const [breakType, setBreakType] = useState<string>('')
    const [otherBreakType, setOtherBreakType] = useState<string>('')
    const [startTime, setStartTime] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [duration, setDuration] = useState<string>('')
    const [filteredBreaks, setFilteredBreaks] = useState<Break[]>([])
    const [timerRunning, setTimerRunning] = useState<boolean>(false)
    const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [isCurrentDate, setIsCurrentDate] = useState<boolean>(true)
    const [employees, setEmployees] = useState([])
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
    const [openEditForm, setOpenEditForm] = useState(false)
    const [currentBreak, setCurrentBreak] = useState(null)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const employee = JSON.parse(localStorage.getItem('user') || '{}')
    const employeeId = employee?.id
    const userRole = employee?.role

    const breakOptions = ['Washroom', 'Lunch', 'Refreshment', 'Tea', 'Personal Call', 'Other']

    useEffect(() => {
        if (Number(userRole) <= 2) {
            const fetchEmployees = async () => {
                try {
                    const employeeData = await apiResponse()
                    setEmployees(employeeData)
                } catch (error) {
                    console.error('Error fetching employees:', error)
                }
            }

            fetchEmployees()
        }
    }, [userRole])

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor((milliseconds / 1000) % 60)
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
        return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
    }

    const convertToMilliseconds = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(/[hms]/).map(Number)
        return hours * 3600000 + minutes * 60000 + seconds * 1000
    }

    const handleStartTime = () => {
        if (breakType) {
            const now = Date.now()
            setStartTimestamp(now)
            setStartTime(new Date(now).toLocaleTimeString())
            setTimerRunning(true)
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now()
                const diff = currentTime - now
                setDuration(formatTime(diff))
            }, 1000)
        } else {
            alert('Please choose a break type first.')
        }
    }

    const handleEndTime = () => {
        if (timerRunning && startTimestamp) {
            const endTimestamp = Date.now()
            const diff = endTimestamp - startTimestamp
            const formattedDuration = formatTime(diff)

            setEndTime(new Date().toLocaleTimeString())
            setDuration(formattedDuration)
            setTimerRunning(false)

            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }

            const idToUse = selectedEmployeeId ? selectedEmployeeId : employeeId
            const finalBreakType = breakType === 'Other' ? otherBreakType : breakType

            dispatch(
                addBreak({
                    type: finalBreakType,
                    startTime,
                    duration: formattedDuration,
                    date: selectedDate,
                    employee: idToUse
                })
            ).then(() => {
                setBreakType('')
                setOtherBreakType('')
                setStartTime('')
                setEndTime('')
                setDuration('')
                setStartTimestamp(null)
            })
        }
    }

    useEffect(() => {
        if (Number(userRole) <= 2 && selectedEmployeeId) {
            dispatch(fetchBreaksById(selectedEmployeeId))
        } else {
            dispatch(fetchBreaksById(null))
        }
    }, [dispatch, selectedEmployeeId, userRole])

    useEffect(() => {
        const filtered = breaks.filter(b => b.date === selectedDate)
        setFilteredBreaks(filtered)

        const today = new Date().toISOString().split('T')[0]
        setIsCurrentDate(selectedDate === today)
    }, [selectedDate, breaks])

    const totalDurationForDate = filteredBreaks.reduce((acc, b) => acc + convertToMilliseconds(b.duration), 0)

    const handleEditClick = (breakToEdit) => {
        const breakWithCorrectIds = {
            ...breakToEdit,
            _id: breakToEdit._id,
            employee: breakToEdit.employee,
        }

        setCurrentBreak(breakWithCorrectIds)
        setOpenEditForm(true)
    }

    const handleEditSubmit = (updatedBreak) => {
        if (updatedBreak && updatedBreak._id) {
            const breakId = updatedBreak._id
            dispatch(updateBreak({ id: breakId, updatedBreak }))
            dispatch(fetchBreaksById(selectedEmployeeId || employeeId));
            setOpenEditForm(false)
        } else {
            console.error('Error: Break ID is undefined.')
        }
    }

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4">Break Sheet</Typography>
                </Grid>

                {Number(userRole) <= 2 && (
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Select Employee" variant="outlined" fullWidth />}
                            value={selectedEmployeeId ? employees.find((emp) => emp._id === selectedEmployeeId) : null}
                            onChange={(e, value) => setSelectedEmployeeId(value ? value._id : null)}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 10,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1rem' },
                                mb: { xs: 1, sm: 0 },
                                flexShrink: 0,
                            }}
                        >
                            Total Break Time for {selectedDate}:
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                mb: { xs: 1, sm: 0 },
                                backgroundColor: totalDurationForDate > 3600000 ? 'red' : 'green',
                                color: 'white',
                                padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
                                borderRadius: '0.5rem',
                                width: 'auto',
                                maxWidth: '10rem',
                                textAlign: 'center',
                            }}
                        >
                            {formatTime(totalDurationForDate)}
                        </Typography>

                        <TextField
                            label="Select Date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                ml: { xs: 0, sm: 2 },
                                flex: 1,
                                maxWidth: '200px',
                                mb: { xs: 0, sm: 3 },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </Grid>

                {userRole !== '1' && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Choose Break Type"
                                value={breakType}
                                onChange={(e) => setBreakType(e.target.value)}
                                fullWidth
                                variant="outlined"
                                disabled={!isCurrentDate}
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                {breakOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {breakType === 'Other' && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Please specify"
                                    value={otherBreakType}
                                    onChange={(e) => setOtherBreakType(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        )}


                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleStartTime}
                                disabled={!isCurrentDate || timerRunning}
                                fullWidth
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                {timerRunning ? 'Break Running...' : 'Start Break'}
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Time"
                                value={startTime}
                                disabled
                                fullWidth
                                variant="outlined"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Duration"
                                value={duration}
                                disabled
                                fullWidth
                                variant="outlined"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleEndTime}
                                disabled={!isCurrentDate || !timerRunning}
                                fullWidth
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                End Break
                            </Button>
                        </Grid>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Typography variant="h6">All Breaks</Typography>
                    <Grid container spacing={2}>
                        {filteredBreaks.map((breakEntry, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Box
                                    sx={{
                                        border: '1px solid #ccc',
                                        p: 2,
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        minHeight: '120px',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ textDecoration: 'underline', color: 'green' }}>
                                        {breakEntry.type}
                                    </Typography>
                                    <Typography variant="body2">Start Time: {breakEntry.startTime}</Typography>
                                    <Typography sx={{ color: 'blue' }} variant="body2">Duration: {breakEntry.duration}</Typography>

                                    {userRole === '1' && <Tooltip title="Edit">
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                            }}
                                            onClick={() => handleEditClick(breakEntry)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Tooltip>}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {currentBreak && (
                <EditBreakForm
                    open={openEditForm}
                    onClose={() => setOpenEditForm(false)}
                    onSubmit={handleEditSubmit}
                    breakToEdit={currentBreak}
                />
            )}
        </Box>
    )

}

export default BreakSheet
