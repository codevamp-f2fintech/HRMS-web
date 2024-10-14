'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button, Typography, Box, Grid, Divider, CardContent, Card } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addPunch, fetchTotalWorkingHours, fetchPunchByEmployeeAndDate } from '@/redux/features/punches/punchesSlice'
import { RootState } from '@/redux/store'

interface PunchInOutProps {
    selectedDate: string
}

const PunchInOut: React.FC<PunchInOutProps> = ({ selectedDate }) => {
    const dispatch = useDispatch()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const [punchState, setPunchState] = useState({
        isPunchIn: false,
        startTime: '',
        endTime: '',
        totalTime: '00h 00m 00s'
    })

    const [isLargeScreen, setIsLargeScreen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const employee = JSON.parse(localStorage.getItem('user') || '{}')
    const employeeId = employee?.id
    const totalWorkingHours = useSelector((state: RootState) => state.punches.totalWorkingHours)
    const punch = useSelector((state: RootState) => state.punches.punch)
    const loading = useSelector((state: RootState) => state.punches.loading)
    const error = useSelector((state: RootState) => state.punches.error)

    const currentDate = new Date().toISOString().split('T')[0]

    const isCurrentDate = selectedDate === currentDate

    useEffect(() => {
        if (employeeId && selectedDate) {
            dispatch(fetchPunchByEmployeeAndDate({ employeeId, date: selectedDate }))
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

            setPunchState(prevState => ({
                ...prevState,
                totalTime: `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
            }))
        }, 1000)
    }

    const stopPunchTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handlePunchIn = async () => {
        const now = Date.now()
        const startTime = new Date(now).toLocaleTimeString('en-US', { hour12: false })

        setPunchState({
            ...punchState,
            isPunchIn: true,
            startTime,
            totalTime: '00h 00m 00s'
        })

        startPunchInTimer(now)
        localStorage.setItem(
            'punchState',
            JSON.stringify({
                ...punchState,
                isPunchIn: true,
                startTime,
                timestamp: now
            })
        )
    }

    const handlePunchOut = async () => {

        const now = new Date()
        const endTime = now.toLocaleTimeString('en-US', { hour12: false })

        const confirmation = window.confirm("Are you sure you want to punch out?");

        if (!confirmation) {
            return;
        }

        stopPunchTimer()

        const punchData = {
            punchIn: punchState.startTime,
            punchOut: endTime,
            totalTime: punchState.totalTime,
            date: new Date().toISOString().split('T')[0],
            employee: employeeId
        }

        await dispatch(addPunch(punchData))

        setPunchState({
            isPunchIn: false,
            startTime: '',
            endTime: '',
            totalTime: '00h 00m 00s'
        })

        localStorage.removeItem('punchState')
        dispatch(fetchTotalWorkingHours({ employeeId, date: selectedDate }))
        dispatch(fetchPunchByEmployeeAndDate({ employeeId, date: selectedDate }))
    }

    useEffect(() => {
        const savedPunchState = localStorage.getItem('punchState')
        if (savedPunchState) {
            const restoredPunchState = JSON.parse(savedPunchState)

            if (restoredPunchState.isPunchIn) {
                setPunchState(restoredPunchState)

                const punchInTimestamp = restoredPunchState.timestamp
                startPunchInTimer(punchInTimestamp)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <Box sx={{ p: [2, 4], maxWidth: '100%' }}>
            <Card
                sx={{ width: '100%', maxWidth: [300, 500], p: [2, 3], mb: 4, backgroundColor: '', color: 'white', mx: 'auto' }}
            >
                <Typography variant='h5' gutterBottom textAlign='center' sx={{ fontSize: ['1.2rem', '1.5rem'] }}>
                    <span style={{ color: 'black' }}>Work Hours Of {selectedDate} : </span>
                    <span style={{ color: 'blue', fontSize: ['1.1rem', '1.4rem'] }}>
                        {`${totalWorkingHours?.hours || 0}h ${totalWorkingHours?.minutes || 0}m ${totalWorkingHours?.seconds || 0}s`}
                    </span>
                </Typography>
            </Card>
            {/* Start punch box */}
            <Grid container justifyContent='center'>
                <Grid item xs={12} sm={10} md={8}>
                    <Card sx={{ p: [1, 2], mb: 4, mx: 'auto', width: '100%', maxWidth: [300, 600] }}>
                        <CardContent>
                            {/* Display punchIn, punchOut, and totalTime at the top */}
                            <Typography variant='h6' textAlign='center' sx={{ mb: 3 }}>
                                <span style={{ color: 'blue' }}>
                                    Punch In: {punch?.punchIn || '-'} | Punch Out: {punch?.punchOut || '-'} | Total Time:{' '}
                                    {punch?.totalTime || '-'}
                                </span>
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, width: '100%' }}>
                                <Typography variant='h6' textAlign='center' sx={{ flexGrow: 1, fontSize: ['1rem', '1.3rem'] }}>
                                    Timer
                                </Typography>
                                <Typography variant='h6' textAlign='center' sx={{ flexGrow: 1, fontSize: ['1rem', '1.3rem'] }}>
                                    Start Time
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, width: '100%' }}>
                                <Typography
                                    variant='h5'
                                    color='text.secondary'
                                    textAlign='center'
                                    sx={{ flexGrow: 1, fontSize: ['1rem', '1.3rem'] }}
                                >
                                    {punchState.totalTime}
                                </Typography>
                                <Typography
                                    variant='h5'
                                    color='text.secondary'
                                    textAlign='center'
                                    sx={{ flexGrow: 2, fontSize: ['1rem', '1.3rem'] }}
                                >
                                    {punchState.startTime || '-'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Punch In/Out Button */}
                            {isLargeScreen && isCurrentDate && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    {punchState.isPunchIn ? (
                                        <Button variant='contained' color='primary' onClick={handlePunchOut}>
                                            Punch Out
                                        </Button>
                                    ) : (
                                        <Button variant='contained' color='secondary' onClick={handlePunchIn}>
                                            Punch In
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PunchInOut
