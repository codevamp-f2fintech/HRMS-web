'use client'

import React, { useEffect, useState, useRef } from 'react';

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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ContrastIcon from '@mui/icons-material/Contrast';

import { DriveFileRenameOutlineOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

interface AttendanceRecord {
  [date: string]: string;
}

interface AttendanceData {
  id: string;
  date: string;
  status: string;
}

function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const initialValue = dayjs();

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[], attendanceData?: any }) {
  const { highlightedDays = [], day, outsideCurrentMonth, attendanceData, ...other } = props;

  const attendanceStatus = attendanceData?.[day.format('YYYY-MM-DD')] || '';
  const isSunday = day.day() === 0;
  let backgroundColor;
  let color;

  if (attendanceStatus === 'Present') {
    backgroundColor = 'green';
    color = 'white';
  } else if (attendanceStatus === 'Absent') {
    backgroundColor = 'red';
    color = 'white';
  } else if (attendanceStatus === 'On Leave') {
    backgroundColor = 'yellow';
    color = 'black';
  } else if (attendanceStatus === 'On Half') {
    backgroundColor = '#b7a53a';
    color = 'white';
  }
  else if (isSunday) {
    backgroundColor = 'purple';
    color = 'white';
  }

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={{
        backgroundColor: backgroundColor ? `${backgroundColor} !important` : 'inherit',
        color: color ? `${color} !important` : 'inherit',
        fontSize: '1em'
      }}
    />
  );
}

function DateCalendarServerRequest({ attendanceData }) {
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();

    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(initialValue);

    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <Box >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: (props) => <ServerDay {...props} attendanceData={attendanceData} />,

          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
          sx={{

            '.MuiPickersCalendarHeader-root': {
              backgroundColor: '#1976d2', // Change header background color
              color: 'white', // Change header text color
            },
            '.MuiPickersCalendarHeader-label': {
              color: 'white', // Change month and year text color
            },
            '.MuiPickersDay-day': {
              fontSize: '1.2em', // Increase font size of the days
            },
            '.MuiPickersCalendarHeader-switchViewIcon': {
              color: 'white', // Change the color of the switch view icon
            },
            '& .MuiDayCalendar-weekDayLabel': {
              // Change the color of the weekday labels
              fontSize: '1.2em', // Increase the font size of the weekday labels
              fontWeight: 'bold', // Make the weekday labels bold
            },
            '.MuiPickersCalendarHeader-iconButton': {
              color: 'white', // Change the color of the navigation icon buttons
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

function Legend() {
  return (
    <Box display='flex' gap={2}>

      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="green" mr={1} />
        <Typography>Present</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="red" mr={1} />
        <Typography>Absent</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="#b7a53a" mr={1} />
        <Typography>Half</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="yellow" mr={1} />
        <Typography>Leave</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="purple" mr={1} />
        <Typography>Sunday</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={15} height={15} bgcolor="#8c57ff" mr={1} />
        <Typography>Today</Typography>
      </Box>
    </Box>
  );
}

function AttendanceStatusList({ attendanceData }) {
  return (
    <Box sx={{ ml: 20 }}>
      <Typography variant="h5" gutterBottom>
        Attendance Status
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(attendanceData).map(([date, status]) => (
          <Grid item xs={12} key={date}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Typography sx={{ width: '50%' }}>{date}</Typography>
              <Typography sx={{ width: '50%' }}>{status}</Typography>

            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


export default function AttendanceGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { attendances, loading, error } = useSelector((state: RootState) => state.attendances);
  const { employees } = useSelector((state: RootState) => state.employees);

  const [showForm, setShowForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [daysToShow, setDaysToShow] = useState(7);
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (attendances.length === 0) {
      dispatch(fetchAttendances());
    }

    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, attendances.length, employees.length]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setUserRole(user.role);
    setUserId(user.id);
  }, []);

  function AddAttendanceForm({ handleClose, attendance }) {
    const [formData, setFormData] = useState({
      employee: '',
      date: '',
      status: '',
    });

    useEffect(() => {
      if (attendance) {
        const selected = attendances.find(attend => attend._id === attendance);

        if (selected) {
          setFormData({
            employee: selected.employee._id,
            date: selected.date,
            status: selected.status,
          });
        }
      }
    }, [attendance, attendances]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;

      setFormData(prevState => ({
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
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
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
                <MenuItem value='On Half'>ON_HALF</MenuItem>
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
    );
  }

  const handleAttendanceAddClick = () => {
    setSelectedAttendance(null);
    setShowForm(true);
  };

  const handleAttendanceEditClick = (id: React.SetStateAction<null>) => {
    setSelectedAttendance(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleNextDaysClick = () => {
    setStartDayIndex((prev) => Math.min(prev + daysToShow, 31 - daysToShow));
  };

  const handlePreviousDaysClick = () => {
    setStartDayIndex((prev) => Math.max(prev - daysToShow, 0));
  };

  const attendanceData: AttendanceRecord = attendances
    .filter(att => att.employee._id === userId)
    .reduce<AttendanceRecord>((acc, { date, status }) => {
      acc[date] = status;

      return acc;
    }, {});

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const generateColumns = () => {
    const daysInMonth = getDaysInMonth(month, new Date().getFullYear());
    const visibleDays: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1).slice(startDayIndex, startDayIndex + daysToShow);
    const sundays = getSundaysInMonth(month, new Date().getFullYear());

    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Employee',
        width: 170,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <Avatar src={params.row.image} alt={params.row.name} sx={{ m: 2 }} />
            <Typography>{params.row.name}</Typography>
          </Box>
        ),
      },
      ...visibleDays.map(day => ({
        field: `day_${day}`,
        headerName: `${day}`,
        // width: 50,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          if (sundays.includes(day)) {
            return <WeekendIcon style={{ color: 'blue', marginTop: '20%' }} />;
          }

          const status = params.row[`day_${day}`];

          if (status === 'Present') {
            return <CheckCircleIcon style={{ color: 'green', marginTop: '20%' }} />;
          } else if (status === 'Absent') {
            return <CancelIcon style={{ color: 'red', marginTop: '20%' }} />;
          } else if (status === 'On Leave') {
            return <PauseCircleOutlineIcon style={{ color: 'orange', marginTop: '20%' }} />;
          } else if (status === 'On Half') {
            return <ContrastIcon style={{ color: 'green', fontSize: '1.5em', marginTop: '20%' }} />;
          }
          else {
            return null;
          }
        }
      })),
      {
        field: 'edit',
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: ({ row: { _id } }) => (
          <Box display="flex" justifyContent="center" mt="10%" >
            <Button color="info" variant="contained" onClick={() => handleAttendanceEditClick(_id)}>
              <DriveFileRenameOutlineOutlined />
            </Button>
          </Box>
        ),
      },
    ];

    return columns;
  };

  const getSundaysInMonth = (month: number, year: number) => {
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

  const transformData = () => {
    const groupedData = attendances.reduce((acc, curr) => {
      const { employee, date, status, _id } = curr;

      if (!employee) {
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
          _id,
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
            <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
              Attendance
            </Typography>
            <Typography
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Attendance
            </Typography>
          </Box>

          {userRole === "1" && <Box display='flex' alignItems='center'>
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
              style={{ borderRadius: 50, backgroundColor: '#ff902f', width: '400px', padding: '15px' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleAttendanceAddClick}
            >
              Add Attendance
            </Button>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f', width: '50px', padding: '15px', marginLeft: '10px' }}
              variant='contained'
              color='warning'
              onClick={handlePreviousDaysClick}
              disabled={startDayIndex === 0}
            >
              {'<'}
            </Button>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f', width: '50px', padding: '15px', marginLeft: '10px' }}
              variant='contained'
              color='warning'
              onClick={handleNextDaysClick}
              disabled={startDayIndex + daysToShow >= 30}
            >
              {'>'}
            </Button>
          </Box>}

        </Box>
        {userRole === "1" && <Grid container spacing={6} alignItems='center' mb={2}>
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
        </Grid>}
      </Box>
      <Box sx={{ display: 'flex' }}>
        {/* {userRole === '3' && <Legend />} */}
        <Box sx={{ height: 500, width: '100%' }}>
          {userRole === '1' ? (
            <DataGrid

              getRowHeight={() => 'auto'}

              sx={{
                '& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon': {
                  color: 'white',
                },
                '& .MuiDataGrid-columnHeader .MuiDataGrid-menuIconButton': {
                  color: 'white',
                },
                '& .mui-yrdy0g-MuiDataGrid-columnHeaderRow ': {
                  background: 'linear-gradient(270deg, var(--mui-palette-primary-main), rgb(197, 171, 255) 100%) !important',
                },
                '& .mui-wop1k0-MuiDataGrid-footerContainer': {
                  background: 'linear-gradient(270deg, var(--mui-palette-primary-main), rgb(197, 171, 255) 100%) !important',
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
              disableRowSelectionOnClick
            />
          ) : (
            <>
              <Box display='flex'>
                <DateCalendarServerRequest attendanceData={attendanceData} />
                <AttendanceStatusList attendanceData={attendanceData} />
              </Box>
              <Legend />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
