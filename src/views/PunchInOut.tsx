'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button, Typography, Box, Grid, Card, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
    addPunch,
    fetchTotalWorkingHours,
    fetchPunchByEmployeeAndDate,
    updatePunch
} from '@/redux/features/punches/punchesSlice'
import { RootState } from '@/redux/store'

interface PunchInOutProps {
    selectedDate: string,
    selectedEmployeeId?: string
    disablePunch?: boolean
}

const PunchInOut: React.FC<PunchInOutProps> = ({ selectedDate, selectedEmployeeId, disablePunch }) => {
    const dispatch = useDispatch()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const [punchState, setPunchState] = useState({
        isPunchIn: false,
        startTime: '',
        endTime: '',
        totalTime: '00h 00m 00s',
        isPunchOutDisabled: false,
        isPunchInDisabled: false
    })

    const [timer, setTimer] = useState('00h 00m 00s')
    const [currentPunchIndex, setCurrentPunchIndex] = useState(0)
    const [currentDateTime, setCurrentDateTime] = useState(new Date())
    const [isLargeScreen, setIsLargeScreen] = useState(false)

    const employee = JSON.parse(localStorage.getItem('user') || '{}')
    const employeeId = selectedEmployeeId || employee?.id
    const userRole = employee?.role
    const totalWorkingHours = useSelector((state: RootState) => state.punches.totalWorkingHours)
    const punch = useSelector((state: RootState) => state.punches.punches)
    const loading = useSelector((state: RootState) => state.punches.loading)
    const error = useSelector((state: RootState) => state.punches.error)

    const currentDate = new Date().toISOString().split('T')[0]
    const isCurrentDate = selectedDate === currentDate

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)

        return () => clearInterval(timerInterval)
    }, [])

    useEffect(() => {
        if (employeeId && selectedDate) {
            dispatch(fetchPunchByEmployeeAndDate({ employeeId, date: selectedDate }))
                .unwrap()
                .then(punchData => {
                    if (punchData.length > 0) {
                        const latestPunch = punchData[punchData.length - 1]
                        if (latestPunch.punchOut) {
                            setPunchState({
                                ...punchState,
                                isPunchIn: false,
                                startTime: latestPunch.punchIn,
                                endTime: latestPunch.punchOut,
                                isPunchInDisabled: false,
                                isPunchOutDisabled: true
                            })
                        } else {
                            setPunchState({
                                ...punchState,
                                isPunchIn: true,
                                startTime: latestPunch.punchIn,
                                isPunchInDisabled: true,
                                isPunchOutDisabled: false
                            })
                        }
                    }
                })

            dispatch(fetchTotalWorkingHours({ employeeId, date: selectedDate }))
        }
    }, [dispatch, employeeId, selectedDate])

    const startPunchInTimer = (timestamp: number) => {
        intervalRef.current = setInterval(() => {
            const currentTime = Date.now()
            const diff = currentTime - timestamp
            const totalSeconds = Math.floor(diff / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60

            setTimer(
                `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
            )
        }, 1000)
    }

    const stopPunchTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handlePunchIn = async () => {
        const now = new Date()
        const startTime = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })

        const punchData = {
            punchIn: startTime,
            punchOut: '',
            totalTime: '00h 00m 00s',
            date: currentDate,
            employee: employeeId
        }

        await dispatch(addPunch(punchData)).unwrap()

        setPunchState({
            ...punchState,
            isPunchIn: true,
            startTime,
            isPunchInDisabled: true,
            isPunchOutDisabled: false
        })

        startPunchInTimer(now.getTime())
    }

    const handlePunchOut = async () => {
        const now = new Date()
        const endTime = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })

        const confirmation = window.confirm('Are you sure you want to punch out?')

        if (!confirmation) {
            return
        }
        stopPunchTimer()

        const punchData = {
            punchOut: endTime,
            totalTime: timer
        }

        await dispatch(updatePunch({ employeeId, punchData }))

        setPunchState({
            isPunchIn: false,
            startTime: '',
            endTime: '',
            totalTime: '00h 00m 00s',
            isPunchInDisabled: false,
            isPunchOutDisabled: true
        })

        // localStorage.removeItem('punchState')

        await dispatch(fetchPunchByEmployeeAndDate({ employeeId, date: selectedDate }))
        dispatch(fetchTotalWorkingHours({ employeeId, date: selectedDate }))
    }

    useEffect(() => {
        // const savedPunchState = localStorage.getItem('punchState')
        // if (savedPunchState) {
        //     const restoredPunchState = JSON.parse(savedPunchState)

        //     if (restoredPunchState.isPunchIn) {
        //         setPunchState(restoredPunchState)
        //         startPunchInTimer(restoredPunchState.timestamp)
        //     }
        // }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const handlePreviousPunch = () => {
        if (currentPunchIndex > 0) {
            setCurrentPunchIndex(currentPunchIndex - 1)
        }
    }

    const handleNextPunch = () => {
        if (currentPunchIndex < punch.length - 1) {
            setCurrentPunchIndex(currentPunchIndex + 1)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    const currentPunch = punch.length > 0 ? punch[currentPunchIndex] : null

    return (
        <Box sx={{ p: [2, 4], maxWidth: '100%' }}>
            {userRole !== '1' && <Card
                sx={{
                    display: 'flex',
                    flexDirection: ['column', 'row'],
                    justifyContent: 'space-between',
                    p: [2, 3],
                    mb: 4,
                    backgroundColor: '',
                    color: 'white',
                    borderRadius: 3,
                    alignItems: 'center',
                    minHeight: ['auto', '150px']
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: ['100%', '45%'],
                        backgroundColor: '#2c3ce3',
                        padding: 2,
                        borderRadius: 3,
                        marginBottom: [2, 0],
                        marginRight: [0, '1rem'],
                        height: ['auto', '150px'],
                        minHeight: '150px'
                    }}
                >
                    <Typography variant='h4' sx={{ fontSize: ['1.5rem', '2rem'], color: '#fff' }}>
                        {currentDateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography sx={{ fontSize: ['0.875rem', '1rem'], color: '#fff' }}>
                        {currentDateTime.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Typography>

                    {isLargeScreen && (
                        <Tooltip
                            title={
                                disablePunch
                                    ? `Managers can't punch in for team members.`
                                    : !isCurrentDate
                                        ? 'Punch-In available for today only.'
                                        : ''
                            }
                        >
                            <span style={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    sx={{ width: '40%', backgroundColor: '#1e40af', mt: 2, fontSize: '0.875rem' }}
                                    onClick={handlePunchIn}
                                    disabled={punchState.isPunchInDisabled || disablePunch || !isCurrentDate}
                                >
                                    Punch In
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </Box>

                <Box
                    sx={{
                        width: ['100%', '45%'],
                        backgroundColor: '#f0f8ff',
                        color: '#000',
                        borderRadius: 3,
                        textAlign: 'center',
                        padding: 2,
                        marginTop: [2, 0],
                        height: ['auto', '150px'],
                        minHeight: '150px'
                    }}
                >
                    {punchState.isPunchIn && (
                        <Typography sx={{ mt: 2, fontSize: '1rem', color: '#000' }}>
                            Punch In Time: {punchState.startTime}
                        </Typography>
                    )}

                    <Typography variant='h6'>Daily Check</Typography>
                    {isLargeScreen && (
                        <Tooltip
                            title={
                                disablePunch
                                    ? `Managers can't punch out for team members.`
                                    : !isCurrentDate
                                        ? 'Punch-Out available for today only.'
                                        : ''
                            }
                        >
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    sx={{ backgroundColor: '#007bff', width: '40%', mt: 8, fontSize: '0.875rem' }}
                                    onClick={handlePunchOut}
                                    disabled={punchState.isPunchOutDisabled || !isCurrentDate || disablePunch}
                                >
                                    Punch Out
                                </Button>
                            </div>
                        </Tooltip>
                    )}

                </Box>
            </Card>}

            <Box sx={{ display: 'flex', flexDirection: ['column', 'row'], gap: 4 }}>
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: [300, 500],
                        p: [2, 3],
                        backgroundColor: '#2c3ce3',
                        color: 'white',
                        mx: 'auto',
                        borderRadius: 3,
                        marginBottom: [2, 0]
                    }}
                >
                    <Typography variant='h6' textAlign='center' sx={{ mb: 3, color: 'white' }}>
                        Punch Records
                    </Typography>

                    <Grid container justifyContent='center'>
                        <Grid item xs={4}>
                            <Typography variant='h6' textAlign='center' sx={{ color: 'white' }}>
                                Punch In
                            </Typography>
                            <Typography textAlign='center' sx={{ color: 'white' }}>
                                {currentPunch?.punchIn || '-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='h6' textAlign='center' sx={{ color: 'white' }}>
                                Punch Out
                            </Typography>
                            <Typography textAlign='center' sx={{ color: 'white' }}>
                                {currentPunch?.punchOut || '-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='h6' textAlign='center' sx={{ color: 'white' }}>
                                Total Time
                            </Typography>
                            <Typography textAlign='center' sx={{ color: 'white' }}>
                                {currentPunch?.totalTime || '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            disabled={currentPunchIndex === 0}
                            onClick={handlePreviousPunch}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            disabled={currentPunchIndex === punch.length - 1}
                            onClick={handleNextPunch}
                        >
                            Next
                        </Button>
                    </Box>
                </Card>

                <Card
                    sx={{
                        width: '100%',
                        maxWidth: [300, 500],
                        p: [2, 3],
                        backgroundColor: '#2c3ce3',
                        color: 'white',
                        mx: 'auto',
                        borderRadius: 3,
                        marginTop: [2, 0]
                    }}
                >
                    <Typography variant='h5' textAlign='center' sx={{ color: 'white' }}>
                        Total Working Hours of {selectedDate}
                    </Typography>
                    <Typography variant='h2' textAlign='center' sx={{ color: 'white' }}>
                        <span>
                            {' '}
                            {`${totalWorkingHours?.hours || 0}h ${totalWorkingHours?.minutes || 0}m ${totalWorkingHours?.seconds || 0}s`}
                        </span>
                    </Typography>
                </Card>
            </Box>
        </Box>
    )
}

export default PunchInOut
