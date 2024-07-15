/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'

import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';

export default function AttendenceGrid() {
  const dispatch: AppDispatch = useDispatch()
  const { attendances, loading, error } = useSelector((state: RootState) => state.attendances)

  const [showForm, setShowForm] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)

  useEffect(() => {
    if (attendances.length === 0) {
      dispatch(fetchAttendances())
    }
  }, [dispatch, attendances.length])

  function AddAttendanceForm({ handleClose, attendance }) {
    const [formData, setFormData] = useState({
      employee_id: '',
      date: '',
      status: '',
    })

    useEffect(() => {
      if (attendance) {
        const selected = attendances.find(attend => attend._id === attendance)
        if (selected) {
          setFormData({
            employee_id: selected.employee_id,
            date: selected.date,
            status: selected.status,
          })
        }
      }
    }, [attendance, attendances])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = attendance ? 'PUT' : 'POST'
      const url = attendance ? `${process.env.NEXT_PUBLIC_APP_URL}/attendence/update/${attendance}` : `${process.env.NEXT_PUBLIC_APP_URL}/attendence/create`
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            if (data.message.includes('success')) {
              toast.success(data.message, {
                position: 'top-center',
              });
            } else {
              toast.error('Error: ' + data.message, {
                position: 'top-center',
              });
            }
          } else {
            toast.error('Unexpected error occurred', {
              position: 'top-center',
            });
          }
          handleClose();
          dispatch(fetchAttendances());
        })
        .catch(error => {
          console.log('Error', error);
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {attendance ? 'Edit Attendance' : 'Add Attendance'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Date'
              name='date'
              type='date'
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Grid>
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
                <MenuItem value='Present'>PRESENT</MenuItem>
                <MenuItem value='Absent'>ABSENT</MenuItem>
                <MenuItem value='On Leave'>ON_LEAVE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
                padding: 15,
                backgroundColor: '#ff902f',
                width: 250
              }}
              variant='contained'
              fullWidth
              onClick={handleSubmit}
            >
              {attendance ? 'UPDATE ATTENDANCE' : 'ADD ATTENDANCE'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleAttendanceAddClick = () => {
    setSelectedAttendance(null)
    setShowForm(true)
  }

  const handleAttendanceEditClick = (id) => {
    setSelectedAttendance(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    { field: 'employee_id', headerName: 'Employee_id', headerClassName: 'super-app-theme--header', width: 200, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'date', headerName: 'Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'status', headerName: 'Status', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 160,
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleAttendanceEditClick(_id)}>
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      ),
    },
  ]

  return (

    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddAttendanceForm attendance={selectedAttendance} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
              Attendance
            </Typography>
            <Typography
              style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Attendance
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleAttendanceAddClick}
            >
              Add Attendance
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
          rows={attendances}
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
  );
}
