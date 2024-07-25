/* eslint-disable padding-line-between-statements */
'use client';

import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DriveFileRenameOutline } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';

const AttendanceGrid = () => {
  const dispatch: AppDispatch = useDispatch();
  const { attendances, loading, error } = useSelector((state: RootState) => state.attendances);
  const { employees } = useSelector((state: RootState) => state.employees);

  const [showForm, setShowForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear());
  const [userRole, setUserRole] = useState<string>('');
  const [loggedInUser, setLoggedInUser] = useState<string>(''); // State for logged-in user

  useEffect(() => {
    if (attendances.length === 0) {
      dispatch(fetchAttendances());
    }

    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.id) {
      setUserRole(user.role);
      setLoggedInUser(user.id); // Use id instead of employee_id
      console.log("Logged in User ID:", user.id);
    } else {
      console.error("User data is missing or incomplete in local storage");
    }

    console.log("Attendance Data:", attendances);
    console.log("Employees Data:", employees);
  }, [dispatch, attendances.length, employees.length]);

  const filterAttendances = () => {
    if (userRole === '1') {
      // Admin role, return all attendances
      return attendances;
    } else if (userRole === '3') {
      // Employee role, return attendances for the logged-in user
      return attendances.filter(att => att.employee._id === loggedInUser);
    }

    return [];
  };

  const filteredAttendances = filterAttendances();

  console.log("filter attendances", filteredAttendances);


  function AddAttendanceForm({ handleClose, attendance }) {
    const [formData, setFormData] = useState({
      employee: '',
      date: '',
      status: '',
    });

    useEffect(() => {
      if (attendance) {
        const selected = attendances.find((attend) => attend._id === attendance);

        if (selected) {
          setFormData({
            employee: selected.employee._id,
            date: selected.date,
            status: selected.status,
          });
        }
      }
    }, [attendance, attendances]);

    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = () => {
      const method = attendance ? 'PUT' : 'POST';

      const url = attendance
        ? `${process.env.NEXT_PUBLIC_APP_URL}/attendence/update/${attendance}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/attendence/create`;

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
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
        .catch((error) => {
          console.log('Error', error);
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: '2em', color: 'black' }} variant="h5" gutterBottom>
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
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id="demo-simple-select-label">
                Employee
              </InputLabel>
              <Select
                label="Select Employee"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
              <InputLabel required id="demo-simple-select-label">
                Status
              </InputLabel>
              <Select
                label="Select Status"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Present">PRESENT</MenuItem>
                <MenuItem value="Absent">ABSENT</MenuItem>
                <MenuItem value="On Leave">ON_LEAVE</MenuItem>
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
                width: 250,
              }}
              variant="contained"
              fullWidth
              onClick={handleSubmit}
            >
              {attendance ? 'UPDATE ATTENDANCE' : 'ADD ATTENDANCE'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const handleAttendanceAddClick = () => {
    setSelectedAttendance(null);
    setShowForm(true);
  };

  const handleAttendanceEditClick = (id) => {
    setSelectedAttendance(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const generateColumns = () => {
    const daysInMonth = new Date(year, month, 0).getDate();

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
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => ({
        field: `day_${day}`,
        headerName: `${day}`,
        width: 50,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          const status = params.row[`day_${day}`];

          if (status === 'Present') {
            return <CheckCircleIcon style={{ color: 'green' }} />;
          } else if (status === 'Absent') {
            return <CancelIcon style={{ color: 'red' }} />;
          } else if (status === 'On Leave') {
            return <PauseCircleOutlineIcon style={{ color: 'orange' }} />;
          } else {
            return null;
          }
        },
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
              <DriveFileRenameOutline />
            </Button>
          </Box>
        ),
      },
    ];

    return columns;
  };

  const transformData = () => {
    const groupedData = filteredAttendances.reduce((acc, curr) => {
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

  console.log("Filtered Rows:", rows);

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            <AddAttendanceForm attendance={selectedAttendance} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant="h5" gutterBottom>
              Attendance
            </Typography>
            <Typography
              style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
              variant="subtitle1"
              gutterBottom
            >
              Dashboard / Attendance
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel required id="demo-simple-select-label">
                Month
              </InputLabel>
              <Select
                label="Select Month"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
            {userRole === '1' && (
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f', width: '400px', padding: '15px' }}
                variant="contained"
                color="warning"
                startIcon={<AddIcon />}
                onClick={handleAttendanceAddClick}
              >
                Add Attendance
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        {userRole === '1' ? (
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
              },
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
            disableRowSelectionOnClick
          />
        ) : (
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant="h5" gutterBottom>
              Attendance Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={new Date(year, month - 1)}
                onChange={(date) => {
                  setMonth(date.getMonth() + 1);
                  setYear(date.getFullYear());
                }}
                renderDay={(day, _value, DayComponentProps) => {
                  console.log("called function")
                  console.log("Day is ", day);
                  const date = day.toISOString().split('T')[0];

                  const attendance = filteredAttendances.find(
                    (att) => new Date(att.date).toISOString().split('T')[0] === date
                  );

                  // console.log("Attendence is", attendance);


                  let backgroundColor = 'inherit';
                  console.log("status is", attendance.status);

                  if (attendance) {

                    if (attendance.status === 'Present') {
                      backgroundColor = 'green';
                    } else if (attendance.status === 'Absent') {
                      backgroundColor = 'red';
                    } else if (attendance.status === 'On Leave') {
                      backgroundColor = 'yellow';
                    }
                  }

                  return (
                    <Box
                      sx={{
                        position: 'relative',
                        backgroundColor: backgroundColor,
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        component="span"
                        color={backgroundColor !== 'inherit' ? 'white' : 'textPrimary'}
                      >
                        {day.getDate()}
                      </Typography>
                    </Box>
                  );
                }}
              />
            </LocalizationProvider>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AttendanceGrid;
