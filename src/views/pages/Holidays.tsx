'use client'

import React, { useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'
import {
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'

const holidays = [
  { id: 1, title: 'New Year', start_date: '1 Jan 2023', end_date: '2 Jan 2023', day: 'Sunday' },
  { id: 2, title: 'Good Friday', start_date: '14 Apr 2023', end_date: '14 Apr 2023', day: 'Friday' },
  { id: 3, title: 'May Day', start_date: '1 May 2023', end_date: '1 May 2023', day: 'Monday' },
  { id: 4, title: 'Memorial Day', start_date: '28 May 2023', end_date: '28 May 2023', day: 'Monday' },
  { id: 5, title: 'Ramzon', start_date: '26 Jun 2023', end_date: '26 Jun 2023', day: 'Monday' },
  { id: 6, title: 'Bakrid', start_date: '2 Sep 2023', end_date: '2 Sep 2023', day: 'Saturday' },
  { id: 7, title: 'New Year', start_date: '1 Jan 2023', end_date: '2 Jan 2023', day: 'Sunday' },
  { id: 8, title: 'Good Friday', start_date: '14 Apr 2023', end_date: '14 Apr 2023', day: 'Friday' },
  { id: 9, title: 'May Day', start_date: '1 May 2023', end_date: '1 May 2023', day: 'Monday' },
  { id: 10, title: 'Memorial Day', start_date: '28 May 2023', end_date: '28 May 2023', day: 'Monday' },
  { id: 11, title: 'Ramzon', start_date: '26 Jun 2023', end_date: '26 Jun 2023', day: 'Monday' },
  { id: 12, title: 'Bakrid', start_date: '2 Sep 2023', end_date: '2 Sep 2023', day: 'Saturday' }
]

const columns = [
  { field: 'id', headerName: 'Emp Id', headerClassName: 'super-app-theme--header', width: 70 },
  { field: 'title', headerName: 'Title', headerClassName: 'super-app-theme--header', width: 200, headerAlign: 'center', align: 'center', sortable: false },
  { field: 'start_date', headerName: 'Holiday Start Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
  { field: 'end_date', headerName: 'Holiday End Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
  { field: 'day', headerName: 'Day', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },

  {
    field: 'edit',
    headerName: 'Edit',
    headerClassName: 'super-app-theme--header',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    renderCell: ({ row: { id } }) => {
      return (
        <Box width="85%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="space-around">

          <Button color="info" variant="contained"
            sx={{ minWidth: "50px" }}
          >
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      );
    }
  },
]

function AddHolidayForm({ handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Add Holiday
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Title' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Note' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Year' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Start Date' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='End Date' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>


        <Grid item xs={12}>
          <Button
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'white',
              padding: 15,
              backgroundColor: '#ff902f',
              width: 200
            }}
            variant='contained'
            fullWidth
          >
            ADD HOLIDAY
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

function EditHolidayForm({ employee, handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Edit Holiday
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Title' defaultValue={employee.title} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Start Date'
            type='date'
            defaultValue={employee.start_date}
            InputLabelProps={{ shrink: true }}

          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='End Date'
            type='date'
            defaultValue={employee.end_date}
            InputLabelProps={{ shrink: true }}

          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Note' defaultValue={employee.note} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Year' defaultValue={employee.year} />
        </Grid>

        <Grid item xs={12}>
          <Button
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'white',
              padding: 15,
              backgroundColor: '#ff902f',
              width: 200
            }}
            variant='contained'
            fullWidth
          >
            SAVE CHANGES
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function HolidayGrid() {
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const handleHolidayAddClick = () => {
    setShowForm(true)
    setEditMode(false)
  }

  const handleHolidayEditClick = employee => {
    setSelectedEmployee(employee)
    setShowForm(true)
    setEditMode(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            {editMode ? (
              <EditHolidayForm employee={selectedEmployee} handleClose={handleClose} />
            ) : (
              <AddHolidayForm handleClose={handleClose} />
            )}
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
              Holiday
            </Typography>
            <Typography
              style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Holiday
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleHolidayAddClick}
            >
              Add Holiday
            </Button>
          </Box>
        </Box>
        <Grid container spacing={6} alignItems='center' mb={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label='Employee ID' variant='outlined' />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label='Employee Name' variant='outlined' />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button style={{ padding: 15, backgroundColor: '#198754' }} variant='contained' fullWidth>
              SEARCH
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          sx={{
            '& .super-app-theme--header': {
              fontSize: 15,
              color: 'rgba(0, 0, 0, 0.88)',
              fontWeight: 600
            },
          }}

          // getRowHeight={() => 'auto'}

          rows={holidays}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'title', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection
          disableRowSelectionOnClick />
      </Box>
    </Box>

  );
}
