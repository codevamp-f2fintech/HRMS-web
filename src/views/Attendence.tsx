/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'

import React, { useEffect, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import WeekendIcon from '@mui/icons-material/Weekend';
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
  Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';

export default function AttendanceGrid() {
  const dispatch: AppDispatch = useDispatch()
  const { attendances, loading, error } = useSelector((state: RootState) => state.attendances)
  const { employees } = useSelector((state: RootState) => state.employees)

  const [showForm, setShowForm] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1) // Default to current month

  useEffect(() => {
    if (attendances.length === 0) {
      dispatch(fetchAttendances())
    }
    if (employees.length === 0) {
      dispatch(fetchEmployees())
    }
  }, [dispatch, attendances.length, employees.length])

  function AddAttendanceForm({ handleClose, attendance }) {
    const [formData, setFormData] = useState({
      employee: '',
      date: '',
      status: '',
    })

    useEffect(() => {
      if (attendance) {
        const selected = attendances.find(attend => attend._id === attendance)
        if (selected) {
          setFormData({
            employee: selected.employee._id,
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
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id='demo-simple-select-label'>Employee</InputLabel>
              <Select
                label='Select Employee'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.first_name} {employee.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

  const getSundaysInMonth = (month, year) => {
    const date = new Date(year, month - 1, 1);
    const sundays = [];

    while (date.getMonth() === month - 1) {
      if (date.getDay() === 0) {
        sundays.push(date.getDate());
      }
      date.setDate(date.getDate() + 1);
    }

    return sundays;
  }

  const generateColumns = () => {
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const sundays = getSundaysInMonth(month, new Date().getFullYear());

    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Employee',
        width: 250,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <Avatar src={params.row.image} alt={params.row.name} sx={{ mr: 2 }} />
            <Typography>{params.row.name}</Typography>
          </Box>
        ),
      },
      ...daysInMonth.map(day => ({
        field: `day_${day}`,
        headerName: `${day}`,
        width: 50,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          if (sundays.includes(day)) {
            return <WeekendIcon style={{ color: 'blue' }} />;
          }
          const status = params.row[`day_${day}`];
          if (status === 'Present') {
            return <CheckCircleIcon style={{ color: 'green' }} />;
          } else if (status === 'Absent') {
            return <CancelIcon style={{ color: 'red' }} />;
          } else if (status === 'On Leave') {
            return <PauseCircleOutlineIcon style={{ color: 'orange' }} />;
          }
          else {
            return null;
          }
        }
      })),
      {
        field: 'edit',
        headerName: 'Edit',
        sortable: false,
        width: 100,
        headerAlign: 'center',
        headerClassName: 'super-app-theme--header',
        align: 'center',
        renderCell: ({ row: { _id } }) => (
          <Box display="flex" justifyContent="center">
            <Button color="info" variant="contained" onClick={() => handleAttendanceEditClick(_id)}>
              <DriveFileRenameOutlineOutlined />
            </Button>
          </Box>
        ),
      },
    ];

    return columns;
  };

  const transformData = () => {
    const groupedData = attendances.reduce((acc, curr) => {
      const { employee, date, status, _id } = curr;

      if (!employee) {
        // If employee is null or undefined, skip this attendance record
        return acc;
      }

      const attendanceDate = new Date(date);
      const day = attendanceDate.getDate();
      const attendanceMonth = attendanceDate.getMonth() + 1;

      if (attendanceMonth !== month) {
        return acc;
      }

      if (!acc[employee._id]) {
        acc[employee._id] = {
          employee_id: employee._id,
          name: `${employee.first_name} ${employee.last_name}`,
          image: employee.image,
          _id, // Ensure the _id is included
        };
      }
      acc[employee._id][`day_${day}`] = status;

      return acc;
    }, {});

    return Object.values(groupedData);
  };


  const columns = generateColumns();
  const rows = transformData();

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
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel required id='demo-simple-select-label'>
                Month
              </InputLabel>
              <Select
                label='Select Month'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
              </Select>
            </FormControl>

            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f', width: '300px', padding: '15px' }}
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
            '& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon': {
              color: 'white', // Change this to your desired color
            },
            '& .MuiDataGrid-columnHeader .MuiDataGrid-menuIconButton': {
              color: 'white', // Maintain the color on hover
            },
            '& .super-app-theme--header': {
              fontSize: 15,
              backgroundColor: '#8C57FF',
              color: 'white',
              padding: '4',
              fontWeight: '20px',
              alignItems: 'center',

            },
            '& .MuiDataGrid-cell': {
              fontSize: '1.2em',
              color: '#633030',
              align: 'center',
            }
          }}
          components={{
            Toolbar: GridToolbar,
          }}
          rows={rows}
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
