'use client'

import React, { useEffect, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Typography,
  Box,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Pagination,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { Add, Remove } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchEmployees, filterEmployees } from '@/redux/features/employees/employeesSlice';
import { fetchTimeSheet, filterTimesheet, resetFilter } from '@/redux/features/timesheet/timesheetSlice';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';

console.log("filter time sheet", filterTimesheet);

const ITEMS_PER_PAGE = 6;

export default function TimeSheetGrid() {
  const dispatch: AppDispatch = useDispatch();

  const { timesheets, attendances, filteredTimesheet } = useSelector((state: RootState) => ({
    timesheets: state.timesheets.timesheets,
    employees: state.employees.employees,
    attendances: state.attendances.attendances,
    filteredTimesheet: state.timesheets.filteredTimesheet
  }));

  console.log("filter time sheets", filteredTimesheet)

  const [editableRows, setEditableRows] = useState({});
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [dirty, setDirty] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [searchName, setSearchName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [employees, setEmployees] = useState([])


  const handleSearch = () => {
    console.log("aayay ither")
    dispatch(filterTimesheet({ name: searchName, status: selectedStatus, month }));
  };

  const handleInputChange = (e, field) => {
    if (field === 'searchName') {
      setSearchName(e.target.value);
    } else if (field === 'selectedStatus') {
      setSelectedStatus(e.target.value === 'All' ? '' : e.target.value); // Set to empty string for "All"
    }
  };

  useEffect(() => {
    setPage(1); // Reset to first page after search or filter change
    handleSearch();
  }, [searchName, selectedStatus, month]);


  useEffect(() => {
    if (timesheets.length === 0) {
      dispatch(fetchTimeSheet())
    }

    const fetchEmployees = async () => {
      const data = await apiResponse();

      setEmployees(data);
    };

    fetchEmployees();

    if (attendances.length === 0) {
      dispatch(fetchAttendances())
    }
  }, [dispatch, timesheets.length, employees.length, attendances.length])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}')

    setUserRole(user.role)
    setUserId(user.id)
  }, [])



  const handleEditClick = (row) => {

    const isAttendance = row.attendance_status === 'Present' || row.attendance_status === 'On Half';
    const isTimeSheet = row._id !== null;

    if (isAttendance || isTimeSheet) {
      setEditableRows(prev => ({
        ...prev,
        [row._id || row.attendance_id]: {
          time: row.time || '0',
          status: row.status || 'Pending',
          note: row.note || '',
          submission_date: row.submission_date || '',
          attendance: row.attendance_id,
          employee: row.employee_id
        }
      }));
    }

    setDirty(false);
  }


  const handleChange = (e, id) => {
    const { name, value } = e.target;

    setEditableRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value
      }
    }));
  }

  const handleIncrementTime = (id) => {
    setEditableRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        time: (parseInt(prev[id].time, 10) + 1).toString()
      }
    }));
  }

  const handleDecrementTime = (id) => {
    setEditableRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        time: Math.max(0, parseInt(prev[id].time, 10) - 1).toString()
      }
    }));
  }

  const handleSaveAll = () => {

    const savePromises = Object.keys(editableRows).map(id => {

      const method = id.toString() !== editableRows[id].attendance ? 'PUT' : 'POST'
      const url = id.toString() !== editableRows[id].attendance ? `${process.env.NEXT_PUBLIC_APP_URL}/timesheets/update/${id}` : `${process.env.NEXT_PUBLIC_APP_URL}/timesheets/create`



      return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableRows[id]),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message) });
          }

          return response.json();
        })
    });

    Promise.all(savePromises)
      .then(results => {
        console.log("result is", results);

        toast.success(results[0].message, {
          position: 'top-center',
        });
        setDirty(true);
        setEditableRows({});
        dispatch(fetchTimeSheet()).then(() => {
          dispatch(filterTimesheet({ name: searchName, status: selectedStatus, month }));
          setPage(1); // Reset to first page after filtering
        });
      })
      .catch(error => {
        console.log('Error', error);
        toast.error('Error: ' + error.message, {
          position: 'top-center',
        });
      });
  }

  console.log('user role ', userRole, Number(userRole));

  const transformData = () => {
    const filteredAttendances = Number(userRole) >= 3
      ? attendances.filter(att => att.employee._id === userId && new Date(att.date).getMonth() + 1 === month)
      : attendances.filter(att => new Date(att.date).getMonth() + 1 === month);

    const updatedData = filteredAttendances.map(attendance => {
      const timesheet = timesheets.find(ts => ts.attendance._id === attendance._id);
      const employee = employees.find(emp => emp._id === attendance.employee._id);

      return {
        _id: timesheet ? timesheet._id : null,
        employee_id: employee ? employee._id : '',
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
        employee_image: employee ? employee.image : '',
        attendance_id: attendance._id,
        attendance_date: attendance.date,
        attendance_status: attendance.status,
        time: timesheet ? timesheet.time : '0',
        status: timesheet ? timesheet.status : 'Pending',
        note: timesheet ? timesheet.note : '',
        submission_date: timesheet ? timesheet.submission_date : ''
      };
    });

    return updatedData;
  };

  const rows = transformData();

  console.log("rows", rows)

  const pageCount = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedRows = (searchName !== '' || selectedStatus !== '' ? filteredTimesheet : rows)
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);


  ;

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
              Time Sheet
            </Typography>
            <Typography
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Time Sheet
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
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
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              sx={{ mt: { xs: 2, md: 0 } }}
            />
          </Box>

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <Button
            variant="contained"
            disabled={dirty}
            color="primary"
            onClick={handleSaveAll}
            sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' }, mb: { xs: 2, md: 0 } }}
          >
            Save
          </Button>
          <Grid container spacing={2}>
            {Number(userRole) <= 2 && <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Employee Name'
                variant='outlined'
                value={searchName}
                onChange={(e) => handleInputChange(e, 'searchName')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id='status-select-label'>Status</InputLabel>
                <Select
                  labelId='status-select-label'
                  id='status-select'
                  value={selectedStatus === '' ? 'All' : selectedStatus}
                  label='Status'
                  onChange={(e) => handleInputChange(e, 'selectedStatus')}
                >
                  <MenuItem value='All'>All</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>
                  <MenuItem value='Approved'>Approved</MenuItem>
                  <MenuItem value='Rejected'>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <Button
                variant='contained'
                fullWidth
                onClick={handleSearch}
                sx={{ padding: 4, backgroundColor: '#198754' }}
              >
                SEARCH
              </Button>
            </Grid> */}
          </Grid>
        </Box>

      </Box>
      <Box sx={{ flexGrow: 1, padding: 2, }}>
        <TableContainer sx={{}} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Number(userRole) <= 2 && <TableCell sx={{ fontSize: '1.1em' }}>Employee</TableCell>}
                <TableCell sx={{ fontSize: '1.1em', textAlign: 'center' }}>Attendance Date</TableCell>
                <TableCell sx={{ fontSize: '1.1em', textAlign: 'center' }}>Attendance Status</TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: '1.1em' }}>Time Hours</TableCell>
                <TableCell sx={{ fontSize: '1.1em', textAlign: 'center' }}>TimeSheet Status</TableCell>
                <TableCell sx={{ fontSize: '1.1em', textAlign: 'center' }}>Note</TableCell>
                <TableCell sx={{ fontSize: '1.1em', textAlign: 'center' }}>Submission Date</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchName !== '' || selectedStatus !== '' ? filteredTimesheet : paginatedRows).map((row) => (
                <TableRow key={row._id || row.attendance_id}>
                  {Number(userRole) <= 2 && <TableCell sx={{ textAlign: 'center', fontSize: '1em' }}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={searchName !== '' || selectedStatus !== '' ? row.employee.image : row.employee_image} alt={row.employee_name} sx={{ mr: 2 }} />
                      {searchName !== '' || selectedStatus !== ''
                        ? `${row.employee.first_name} ${row.employee.last_name}`
                        : row.employee_name}
                    </Box>
                  </TableCell>}
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >{searchName !== '' || selectedStatus !== '' ? row.attendance.date : row.attendance_date}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >{searchName !== '' || selectedStatus !== '' ? row.attendance.status : row.attendance_status}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em', cursor: 'pointer' }} >
                    {Number(userRole) >= 3 && editableRows[row._id || row.attendance_id] ? (
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => handleDecrementTime(row._id || row.attendance_id)}>
                          <Remove />
                        </IconButton>
                        <TextField
                          name="time"
                          value={editableRows[row._id || row.attendance_id].time}
                          onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                          style={{ width: '50px' }}
                        />
                        <IconButton onClick={() => handleIncrementTime(row._id || row.attendance_id)}>
                          <Add />
                        </IconButton>
                      </Box>
                    ) : (
                      <span style={Number(userRole) >= 3 ? { border: '1px black solid', padding: '5px 10px 5px 10px' } : {}} onClick={() => Number(userRole) >= 3 && handleEditClick(row)}>{row.time || '0'}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em', cursor: 'pointer' }} >
                    {editableRows[row._id || row.attendance_id] ? (
                      Number(userRole) <= 2 ? (
                        <Select
                          name="status"
                          value={editableRows[row._id || row.attendance_id].status}
                          onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                        >
                          <MenuItem value="Pending">PENDING</MenuItem>
                          <MenuItem value="Approved">APPROVED</MenuItem>
                          <MenuItem value="Rejected">REJECTED</MenuItem>
                        </Select>
                      ) : (
                        <span>{row.status || 'Pending'}</span>
                      )
                    ) : (
                      <span
                        style={Number(userRole) <= 2 ? { border: '1px black solid', padding: '5px 10px 5px 10px' } : {}}
                        onClick={() => handleEditClick(row)}
                      >
                        {row.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em', cursor: 'pointer' }} >
                    {Number(userRole) >= 3 && editableRows[row._id || row.attendance_id] ? (
                      <TextField
                        name="note"
                        value={editableRows[row._id || row.attendance_id].note}
                        onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                      />
                    ) : (
                      <span onClick={() => Number(userRole) >= 3 && handleEditClick(row)}>{row.note || ''}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em', cursor: 'pointer' }} >
                    {Number(userRole) >= 3 && editableRows[row._id || row.attendance_id] ? (
                      <TextField
                        name="submission_date"
                        type="date"
                        value={editableRows[row._id || row.attendance_id].submission_date}
                        onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                      />
                    ) : (
                      <span style={Number(userRole) >= 3 ? { border: '1px black solid', padding: '5px 10px 5px 10px' } : {}} onClick={() => Number(userRole) >= 3 && handleEditClick(row)}>{row.submission_date || ''}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </Box >
  );
}
