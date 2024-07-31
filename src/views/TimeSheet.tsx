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
  Pagination
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { Add, Remove } from '@mui/icons-material';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';
import { fetchTimeSheet } from '@/redux/features/timesheet/timesheetSlice';
import { fetchAttendances } from '@/redux/features/attendances/attendancesSlice';

const ITEMS_PER_PAGE = 6;

export default function TimeSheetGrid() {
  const dispatch: AppDispatch = useDispatch();

  const { timesheets, employees, attendances } = useSelector((state: RootState) => ({
    timesheets: state.timesheets.timesheets,
    employees: state.employees.employees,
    attendances: state.attendances.attendances,
  }));

  const [editableRows, setEditableRows] = useState({});
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [dirty, setDirty] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);



  useEffect(() => {
    if (timesheets.length === 0) {
      dispatch(fetchTimeSheet())
    }

    if (employees.length === 0) {
      dispatch(fetchEmployees())
    }

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


    if (row.attendance_status === 'Present' || row.attendance_status === 'On Half') {
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

    setDirty(false)
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
        setDirty(true)
        setEditableRows({});
        dispatch(fetchTimeSheet());
      })
      .catch(error => {
        console.log('Error', error);
        toast.error('Error: ' + error.message, {
          position: 'top-center',
        });
      });
  }

  const transformData = () => {
    const filteredAttendances = userRole === '3'
      ? attendances.filter(att => att.employee._id === userId)
      : attendances

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

  const pageCount = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedRows = rows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" disabled={dirty} color="primary" onClick={handleSaveAll}>
            Save
          </Button>
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, padding: 2, }}>
        <TableContainer sx={{}} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {userRole === "1" && <TableCell sx={{ fontSize: '1.1em' }}>Employee</TableCell>}
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
              {paginatedRows.map((row) => (
                <TableRow key={row._id || row.attendance_id}>
                  {userRole === "1" && <TableCell sx={{ textAlign: 'center', fontSize: '1em' }}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={row.employee_image} alt={row.employee_name} sx={{ mr: 2 }} />
                      {row.employee_name}
                    </Box>
                  </TableCell>}
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >{row.attendance_date}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >{row.attendance_status}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >
                    {userRole === "3" && editableRows[row._id || row.attendance_id] ? (
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
                      <span onClick={() => userRole === "3" && handleEditClick(row)}>{row.time || '0'}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >
                    {editableRows[row._id || row.attendance_id] ? (
                      userRole === '1' ? (
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
                        <span>{row.status}</span>
                      )
                    ) : (
                      <span onClick={() => handleEditClick(row)}>{row.status || 'Approved'}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >
                    {userRole === "3" && editableRows[row._id || row.attendance_id] ? (
                      <TextField
                        name="note"
                        value={editableRows[row._id || row.attendance_id].note}
                        onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                      />
                    ) : (
                      <span onClick={() => userRole === "3" && handleEditClick(row)}>{row.note || ''}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: '1em' }} >
                    {userRole === "3" && editableRows[row._id || row.attendance_id] ? (
                      <TextField
                        name="submission_date"
                        type="date"
                        value={editableRows[row._id || row.attendance_id].submission_date}
                        onChange={(e) => handleChange(e, row._id || row.attendance_id)}
                      />
                    ) : (
                      <span onClick={() => userRole === "3" && handleEditClick(row)}>{row.submission_date || ''}</span>
                    )}
                  </TableCell>
                  {/* <TableCell>
                    {editableRows[row._id || row.attendance_id] && (
                      <Button onClick={() => handleSaveAll()}>Save All</Button>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
