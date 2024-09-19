'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

import { debounce } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid, GridToolbar, type GridColDef } from '@mui/x-data-grid';
import CircleIcon from '@mui/icons-material/Circle';

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
  FormHelperText,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HomeIcon from '@mui/icons-material/Home';

import ContrastIcon from '@mui/icons-material/Contrast';

import { useDispatch, useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import ClearIcon from '@mui/icons-material/Clear';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAttendances, filterAttendance, resetAttendances } from '@/redux/features/attendances/attendancesSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';
import AttendanceSummary from '@/utility/attendancesummry/AttendanceSummary';
import EmployeeStatsWithBlinkingStatus from '@/utility/totalempattendancesummary/EmployeeStatsWithBlinkingStatus';
import { AttendanceSummaryColumns } from '@/utility/attendancesummry/AttendanceSummaryColumns';

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
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



  function getLastSundayOfMonth(month: number, year: number): number {
    const lastDayOfMonth = new Date(year, month, 0);
    const dayOfWeek = lastDayOfMonth.getDay();


    return lastDayOfMonth.getDate() - dayOfWeek;
  }

  const attendanceStatus = attendanceData?.[day.format('YYYY-MM-DD')] || '';
  const isSunday = day.day() === 0;
  const lastSunday = getLastSundayOfMonth(day.month() + 1, day.year());
  const isLastSunday = day.date() === lastSunday && isSunday;

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
  } else if (attendanceStatus === 'On Field') {
    backgroundColor = '#110720';
    color = 'white';
  } else if (attendanceStatus === 'On Wfh') {
    backgroundColor = 'rgb(247, 51, 120)';
    color = 'white';
  }
  else if (isSunday && !isLastSunday) {
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

function DateCalendarServerRequest({ attendanceData, selectedMonth, onMonthChange }) {
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
    onMonthChange(date);
  };

  return (
    <Box>
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
              backgroundColor: '#1976d2',
              color: 'white',
            },
            '.MuiPickersCalendarHeader-label': {
              color: 'white',
            },
            '.MuiPickersDay-day': {
              fontSize: '1.2em',
            },
            '.MuiPickersCalendarHeader-switchViewIcon': {
              color: 'white',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '1.2em',
              fontWeight: 'bold',
            },
            '.MuiPickersCalendarHeader-iconButton': {
              color: 'white',
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

function Legend() {
  return (
    <Box>
      <Box display='flex' gap={2} mb={2}>
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
      </Box>
      <Box display='flex' gap={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box width={15} height={15} bgcolor="#110720" mr={1} />
          <Typography>On Field</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Box width={15} height={15} bgcolor="rgb(247, 51, 120)" mr={1} />
          <Typography>WFH</Typography>
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
    </Box>
  );
}

function AttendanceStatusList({ attendanceData, selectedMonth }) {
  const filteredData = Object.entries(attendanceData).filter(([date]) => {
    const month = dayjs(date).month() + 1;


    return month === selectedMonth;
  });

  return (
    <Box sx={{ ml: 20 }}>
      <Typography variant="h5" gutterBottom>
        Attendance Status
      </Typography>
      <Grid container spacing={2}>
        {filteredData.length > 0 ? (
          filteredData.map(([date, status]) => (
            <Grid item xs={12} sm={6} key={date}>
              <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Typography sx={{ width: '50%' }}>{date}</Typography>
                <Typography sx={{ width: '50%' }}>{status}</Typography>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography>No attendance data for this month.</Typography>
        )}
      </Grid>
    </Box>
  );
}

export default function AttendanceGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { attendances, loading, error, filteredAttendance } = useSelector((state: RootState) => state.attendances);

  const [showForm, setShowForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [viewAttendanceData, setViewAttendanceData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [daysToShow, setDaysToShow] = useState(7);
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLoaction] = useState('All');

  const [employees, setEmployees] = useState([]);

  const [prefillEmployee, setPrefillEmployee] = useState('');
  const [prefillEmployeeName, setPrefillEmployeeName] = useState('');
  const [prefillDate, setPrefillDate] = useState('');

  console.log('attendances issss', attendances)

  const debouncedSearch = useCallback(
    debounce(() => {
      console.log('debounce triggered');
      dispatch(filterAttendance({ name: searchName, location: searchLocation }));
    }, 300),
    [searchName, searchLocation]
  );

  useEffect(() => {
    debouncedSearch();

    return debouncedSearch.cancel;
  }, [searchName, searchLocation, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleLocationInputChange = (e) => {
    setSearchLoaction(e.target.value);
  };

  useEffect(() => {
    if (attendances.length === 0) {
      dispatch(fetchAttendances());
    }

    const fetchEmployees = async () => {
      const data = await apiResponse();

      setEmployees(data);
    };

    fetchEmployees();
  }, [dispatch, attendances.length]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setUserRole(user.role);
    setUserId(user.id);
  }, []);

  function AddAttendanceForm({ handleClose, attendance, prefillEmployee, prefillEmployeeName, prefillDate }) {
    const [formData, setFormData] = useState({
      employee: prefillEmployee || '',
      date: prefillDate || '',
      status: '',
      timeComplete: '',
    });

    const [errors, setErrors] = useState({
      employee: '',
      date: '',
      status: ''
    });

    useEffect(() => {
      if (attendance) {
        const selected = attendances.find(attend => attend._id === attendance);

        if (selected) {
          setFormData({
            employee: selected.employee._id,
            date: selected.date,
            status: selected.status,
            timeComplete: selected.timeComplete || '',
          });
        }
      } else if (prefillEmployee && prefillDate) {
        setFormData({
          employee: prefillEmployee,
          date: prefillDate,
          status: '',
          timeComplete: '',
        });
      }
    }, [attendance, attendances, prefillEmployee, prefillDate]);

    const validateForm = () => {
      let isValid = true;

      const newErrors = {
        employee: '',
        date: '',
        status: ''
      };

      if (!formData.employee) {
        newErrors.employee = 'Employee selection is required';
        isValid = false;
      }

      if (!formData.date) {
        newErrors.date = 'Date is required';
        isValid = false;
      }

      if (!formData.status) {
        newErrors.status = 'Status selection is required';
        isValid = false;
      }

      setErrors(newErrors);

      return isValid;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = () => {
      if (validateForm()) {
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
            dispatch(resetAttendances());
            dispatch(fetchAttendances());
          })
          .catch(error => {
            console.log('Error', error);
          });
      }
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
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.employee}>
              <Autocomplete
                id="employee-autocomplete"
                options={employees}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                value={employees.find((emp) => emp._id === formData.employee) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'employee',
                      value: newValue ? newValue._id : '',
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    variant="outlined"
                    required
                    error={!!errors.employee}
                    helperText={errors.employee}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.status}>
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
                <MenuItem value='On Field'>ON_FIELD</MenuItem>
                <MenuItem value='On Wfh'>ON_WFH</MenuItem>
              </Select>
              <Typography variant="caption" color="error">{errors.status}</Typography>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              error={!!errors.timeComplete}
              sx={{
                position: 'relative',
              }}
            >
              <InputLabel id="time-complete-select-label">Time Completion</InputLabel> {/* Remove the required prop */}
              <Select
                label="Select Time Completion"
                labelId="time-complete-select-label"
                id="time-complete-select"
                name="timeComplete"
                value={formData.timeComplete}
                onChange={handleChange}
                endAdornment={
                  formData.timeComplete && (
                    <IconButton
                      aria-label="clear"
                      onClick={() => handleChange({ target: { name: 'timeComplete', value: '' } })}
                      sx={{
                        visibility: 'visible',
                        position: 'absolute',
                        right: 40,
                        color: 'black',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0.7,
                        padding: 0,
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )
                }
                sx={{
                  pr: 6,
                }}
              >
                <MenuItem value="Not Completed">Not Completed</MenuItem>
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



  const handleAttendanceAddClick = (employeeId = '', employeeName = '', day) => {
    const date = dayjs(new Date(new Date().getFullYear(), month - 1, day)).format('YYYY-MM-DD');

    setSelectedAttendance(null);
    setShowForm(true);
    setPrefillEmployee(employeeId);
    setPrefillEmployeeName(employeeName);
    setPrefillDate(date);
  };


  const handleAttendanceEditClick = (id: React.SetStateAction<null>) => {
    setSelectedAttendance(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setViewAttendanceData(null);
  };

  const handleViewClick = (id: string) => {

    const employeeAttendances = attendances
      .filter(att => {
        return att.employee._id === id;
      })

      .reduce((acc, { date, status }) => {
        acc[date] = status;

        return acc;
      }, {} as Record<string, string>);

    console.log('Aggregated attendance data:', employeeAttendances);

    if (Object.keys(employeeAttendances).length > 0) {
      setViewAttendanceData(employeeAttendances);
    } else {
      console.log('No attendance found for Employee ID:', id);
    }
  };


  const handleNextDaysClick = () => {
    setStartDayIndex((prev) => Math.min(prev + daysToShow, 31 - daysToShow));
  };

  const handlePreviousDaysClick = () => {
    setStartDayIndex((prev) => Math.max(prev - daysToShow, 0));
  };

  const attendanceData = attendances
    .filter(att => att.employee?._id === userId)
    .reduce((acc, { date, status }) => {
      acc[date] = status;

      return acc;
    }, {});

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getLastSundayOfMonth = (month: number, year: number) => {
    const lastDayOfMonth = new Date(year, month, 0);
    const dayOfWeek = lastDayOfMonth.getDay();
    const lastSunday = lastDayOfMonth.getDate() - dayOfWeek;

    return lastSunday;
  };

  const generateColumns = () => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(month, today.getFullYear());
    const visibleDays: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1).slice(startDayIndex, startDayIndex + daysToShow);
    const lastSunday = getLastSundayOfMonth(month, today.getFullYear());

    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Employee',
        width: 170,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <Avatar src={params.row.image} alt={params.row.name} sx={{ m: 2, mt: 8 }} />
            <Typography>{params.row.name}</Typography>
          </Box>
        ),
      },
      ...visibleDays.map(day => {
        const cellDate = new Date(today.getFullYear(), month - 1, day);
        const isFutureDate = cellDate > today;

        return {
          field: `day_${day}`,
          headerName: `${day}`,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'super-app-theme--header',
          renderCell: (params) => {
            const status = params.row[`day_${day}`];
            const attendanceId = params.row[`day_${day}_id`];
            const employeeId = params.row.employee_id;
            const employeeName = params.row.name;
            const isSunday = cellDate.getDay() === 0;


            if (!status && !isSunday && !isFutureDate) {
              return (
                <Button
                  style={{ color: 'blue', marginTop: '30%' }}
                  onClick={() => handleAttendanceAddClick(employeeId, employeeName, day)}
                >
                  Mark
                </Button>
              );
            }

            if (isSunday && !status) {

              return (
                <WeekendIcon
                  style={{ color: 'blue', marginTop: '35%', cursor: 'pointer' }}
                  onClick={() => handleAttendanceAddClick(employeeId, employeeName, day)}
                />
              );
            } else if (day === lastSunday) {

              if (status === 'Present') {
                return <CheckCircleIcon style={{ color: 'green', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'Absent') {
                return <CancelIcon style={{ color: 'red', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Leave') {
                return <PauseCircleOutlineIcon style={{ color: 'orange', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Half') {
                return <ContrastIcon style={{ color: 'green', fontSize: '1.5em', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Field') {
                return <DirectionsRunIcon style={{ color: '##673ab7', fontSize: '1.5em', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Wfh') {
                return <HomeIcon style={{ color: 'rgb(247, 51, 120)', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              }
              else if (!status && !isFutureDate) {
                return (
                  <Button
                    style={{ color: 'blue', marginTop: '35%' }}
                    onClick={() => handleAttendanceAddClick(employeeId, employeeName, day)}
                  >
                    Mark
                  </Button>
                );
              }
            } else {

              if (status === 'Present') {
                return <CheckCircleIcon style={{ color: 'green', marginTop: '35%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'Absent') {
                return <CancelIcon style={{ color: 'red', marginTop: '35%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Leave') {
                return <PauseCircleOutlineIcon style={{ color: 'orange', marginTop: '35%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Field') {
                return <DirectionsRunIcon style={{ color: '##673ab7', fontSize: '1.5em', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else if (status === 'On Wfh') {
                return <HomeIcon style={{ color: 'rgb(247, 51, 120)', marginTop: '30%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              }
              else if (status === 'On Half') {
                return <ContrastIcon style={{ color: 'green', fontSize: '1.5em', marginTop: '35%' }} onClick={() => handleAttendanceEditClick(attendanceId)} />;
              } else {
                return null;
              }
            }
          }
        };
      }),


      ...AttendanceSummaryColumns,
    ];

    return columns;
  };


  const transformData = () => {
    const attendanceSource = filteredAttendance.length > 0 ? filteredAttendance : attendances;

    const groupedData = attendanceSource.reduce((acc, curr) => {
      const { employee, date, status, timeComplete, _id } = curr;

      if (!employee) {
        return acc;
      }



      const attendanceDate = new Date(date);
      const day = attendanceDate.getDate();
      const attendanceMonth = attendanceDate.getMonth() + 1;

      const uniqueKey = `${employee._id}-${day}-${attendanceMonth}`;

      if (attendanceMonth !== month) {
        return acc;
      }

      if (!acc[employee._id]) {
        acc[employee._id] = {
          employee_id: employee._id,
          name: `${employee.first_name} ${employee.last_name}`,
          image: employee.image,
          present: 0,
          presentNotCompleted: 0,
          absent: 0,
          onHalf: 0,
          onHalfNotCompleted: 0,
          onLeave: 0,
          onField: 0,
          onWfh: 0,
          _id,
        };
      }

      if (!acc[employee._id][uniqueKey]) {
        acc[employee._id][uniqueKey] = true;

        acc[employee._id][`day_${day}`] = status;
        acc[employee._id][`day_${day}_id`] = _id;
        acc[employee._id][`day_${day}_timeComplete`] = timeComplete;



        if (status === 'Present') {
          acc[employee._id].present += 1;

          if (timeComplete === 'Not Completed') {
            acc[employee._id].presentNotCompleted += 1;
          }
        } else if (status === 'Absent') {
          acc[employee._id].absent += 1;
        } else if (status === 'On Half') {
          acc[employee._id].onHalf += 1;

          if (timeComplete === 'Not Completed') {
            acc[employee._id].onHalfNotCompleted += 1;
          }
        } else if (status === 'On Leave') {
          acc[employee._id].onLeave += 1;
        } else if (status === 'On Field') {
          acc[employee._id].onField += 1;
        } else if (status === 'On Wfh') {
          acc[employee._id].onWfh += 1;
        }
      }

      return acc;
    }, {});

    const sortedData = Object.values(groupedData).sort((a, b) => a.name.localeCompare(b.name));

    return sortedData;
  };

  const columns = generateColumns();
  const rows = transformData();

  const handleMonthChange = (date: Dayjs) => {
    const newMonth = date.month() + 1;

    setMonth(newMonth);
  };

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddAttendanceForm
              attendance={selectedAttendance}
              handleClose={handleClose}
              prefillEmployee={prefillEmployee}
              prefillEmployeeName={prefillEmployeeName}
              prefillDate={prefillDate}
            />

          </DialogContent>
        </Dialog>

        {/* Attendance Summary View */}
        <Dialog open={!!viewAttendanceData} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            {viewAttendanceData && (
              <AttendanceSummary
                attendanceData={viewAttendanceData}
                selectedMonth={month}
                onClose={handleClose}
              />
            )}
          </DialogContent>
        </Dialog>

        {userRole === '1' && <EmployeeStatsWithBlinkingStatus />}


        <Box mb={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={6}>
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
            </Grid>

            {userRole === "1" && (
              <Grid spacing={3} item xs={12} sm={6} md={6} container justifyContent="flex-end" alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
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
                </Grid>

                <Grid item xs={12} sm={6} md={4} container spacing={1} justifyContent="flex-end">
                  <Button
                    fullWidth
                    style={{ borderRadius: 50, backgroundColor: '#ff902f', padding: '15px' }}
                    variant='contained'
                    color='warning'
                    startIcon={<AddIcon />}
                    onClick={handleAttendanceAddClick}
                  >
                    Add Attendance
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    style={{ borderRadius: 50, backgroundColor: '#ff902f', padding: '15px' }}
                    variant='contained'
                    color='warning'
                    onClick={handlePreviousDaysClick}
                    disabled={startDayIndex === 0}
                  >
                    {'<'}
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    style={{ borderRadius: 50, backgroundColor: '#ff902f', padding: '15px' }}
                    variant='contained'
                    color='warning'
                    onClick={handleNextDaysClick}
                    disabled={startDayIndex + daysToShow >= 30}
                  >
                    {'>'}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
        {userRole === "1" && <Grid container spacing={6} alignItems='center' mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Employee Name'
              variant='outlined'
              value={searchName}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel required id='demo-simple-select-label'>
                Search Location
              </InputLabel>
              <Select
                label='Select Location'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={searchLocation}
                onChange={handleLocationInputChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="noida">Noida</MenuItem>
                <MenuItem value="bareilly">Bareilly</MenuItem>
                <MenuItem value="patel Nagar">Patel Nagar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>}
      </Box>
      <Box sx={{ display: 'flex' }}>
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

              // components={{
              //   Toolbar: () => {
              //     return (
              //       <GridToolbar />
              //     )
              //   }


              // ... other components
              // }}
              slots={{ toolbar: GridToolbar }}
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
            <Box display="flex">
              <Box display="flex" flexDirection="column" flexShrink={0}>
                <DateCalendarServerRequest
                  attendanceData={attendanceData}
                  selectedMonth={month}
                  onMonthChange={handleMonthChange}
                />
                <Legend />
              </Box>
              <AttendanceStatusList
                attendanceData={attendanceData}
                selectedMonth={month}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
