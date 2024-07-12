/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'

import React, { useEffect, useState } from 'react'

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import {
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves } from '@/redux/features/leaves/leavesSlice';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff902f',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default function LeavesGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { leaves, loading, error } = useSelector((state: RootState) => state.leaves)

  const [showForm, setShowForm] = useState(false)
  const [selectedLeaves, setSelectedLeaves] = useState(null)


  useEffect(() => {
    if (leaves.length === 0) {
      dispatch(fetchLeaves())
    }
  }, [dispatch, leaves.length])

  function AddLeavesForm({ handleClose, leave }) {
    const [formData, setFormData] = useState({
      employee_id: '',
      start_date: '',
      end_date: '',
      status: '',
      application: '',
      type: '',
      day: ''
    })

    useEffect(() => {
      if (leave) {
        const selected = leaves.find(l => l._id === leave)
        if (selected) {
          setFormData({
            employee_id: selected.employee_id,
            start_date: selected.start_date,
            end_date: selected.end_date,
            status: selected.status,
            application: selected.application,
            type: selected.type,
            day: selected.day,
          })
        }
      }
    }, [leave, leaves])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = leave ? 'PUT' : 'POST'
      const url = leave ? `http://localhost:5500/leaves/update/${leave}` : 'http://localhost:5500/leaves/create'
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success', data);
          handleClose();
          dispatch(fetchLeaves());
        })
        .catch(error => {
          console.log('Error', error);
        })
    }

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {leave ? 'Edit Leave' : 'Add Leave'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Emp Id'
              name='employee_id'
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Start Date'
              name='start_date'
              value={formData.start_date}
              type='date'
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='End Date'
              name='end_date'
              type='date'
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id='demo-simple-select-label'>Status</InputLabel>
              <Select
                label='Select Status'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Approved'>Approved</MenuItem>
                <MenuItem value='Rejected'>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Application'
              name='application'
              value={formData.application}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id='demo-simple-select-label'>Type</InputLabel>
              <Select
                label='Select Type'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name='type'
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value='Annual'>ANNUAL</MenuItem>
                <MenuItem value='Sick'>SICK</MenuItem>
                <MenuItem value='Unpaid'>UNPAID</MenuItem>
                <MenuItem value='Other'>OTHER</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Day'
              name='day'
              value={formData.day}
              onChange={handleChange}
              required
            />
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
              onClick={handleSubmit}
            >
              {leave ? 'UPDATE LEAVE' : 'ADD LEAVE'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleLeaveAddClick = () => {
    setSelectedLeaves(null)
    setShowForm(true)
  }

  const handleLeaveEditClick = (id) => {
    setSelectedLeaves(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    { field: 'employee_id', headerName: 'Employee_id', headerClassName: 'super-app-theme--header', width: 200, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'start_date', headerName: 'Holiday Start Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'end_date', headerName: 'Holiday End Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'status', headerName: 'Status', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'application', headerName: 'Application', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'type', headerName: 'Type', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'day', headerName: 'Day', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },

    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 160,
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleLeaveEditClick(_id)}>
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
            <DialogContent>
              <AddLeavesForm leave={selectedLeaves} handleClose={handleClose} />
            </DialogContent>
          </Dialog>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
            <Box>
              <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
                Leave
              </Typography>
              <Typography
                style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
                variant='subtitle1'
                gutterBottom
              >
                Dashboard / Leave
              </Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                variant='contained'
                color='warning'
                startIcon={<AddIcon />}
                onClick={handleLeaveAddClick}
              >
                Add Leave
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
              '& .MuiDataGrid-cell': {
                fontSize: '1em',
                color: '#000',
                align: 'center',
              },
              '& .MuiDataGrid-row': {
                '&:nth-of-type(odd)': {
                  backgroundColor: '#f5f5f5',
                },
              },
            }}
            components={{
              Toolbar: GridToolbar,
            }}
            rows={leaves}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              sorting: {
                sortModel: [{ field: 'employee_id', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            checkboxSelection
            disableRowSelectionOnClick />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
