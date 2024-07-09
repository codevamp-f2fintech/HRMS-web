'use client'

import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
  Box
} from '@mui/material'

const holidays = [
  { id: 1, title: 'New Year', start_date: '1 Jan 2023', end_date: '2 jan 2023', day: 'Sunday' },
  { id: 2, title: 'Good Friday', start_date: '14 Apr 2023', end_date: '2 jan 2023', day: 'Friday' },
  { id: 3, title: 'May Day', start_date: '1 May 2023', end_date: '2 jan 2023', day: 'Monday' },
  { id: 4, title: 'Memorial Day', start_date: '28 May 2023', end_date: '2 jan 2023', day: 'Monday' },
  { id: 5, title: 'Ramzon', start_date: '26 Jun 2023', end_date: '2 jan 2023', day: 'Monday' },
  { id: 6, title: 'Bakrid', start_date: '2 Sep 2023', end_date: '2 jan 2023', day: 'Saturday' }
]

export default function HolidayGrid() {
  return (
    <Container>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h4' gutterBottom>
          Holidays
        </Typography>
        <Button variant='contained' color='primary'>
          + Add Holiday
        </Button>
      </Box>
      <Typography variant='subtitle1' gutterBottom>
        Dashboard / Holidays
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: 18 }}>Title</TableCell>
              <TableCell>Holiday Start Date</TableCell>
              <TableCell>Holiday End Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidays.map(holiday => (
              <TableRow key={holiday.id}>
                <TableCell>{holiday.id}</TableCell>
                <TableCell>{holiday.title}</TableCell>
                <TableCell>{holiday.start_date}</TableCell>
                <TableCell>{holiday.end_date}</TableCell>
                <TableCell>{holiday.day}</TableCell>
                <TableCell>
                  <Button>...</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
