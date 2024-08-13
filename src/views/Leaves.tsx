/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { debounce } from 'lodash';

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
  Avatar,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchLeaves, filterLeave } from '@/redux/features/leaves/leavesSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';

export default function LeavesGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { leaves, loading, error, filteredLeave, total } = useSelector((state: RootState) => state.leaves)

  // const { employees } = useSelector((state: RootState) => state.employees)
  const [showForm, setShowForm] = useState(false)
  const [selectedLeaves, setSelectedLeaves] = useState(null)
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [searchName, setSearchName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [employees, setEmployees] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // const limit = 10;

  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }));
    }, 300),
    [page, limit, selectedKeyword]
  );

  useEffect(() => {
    debouncedFetch();

    return debouncedFetch.cancel;
  }, [page, limit, selectedKeyword, debouncedFetch]);

  const handleInputChange = (e) => {
    setSelectedKeyword(e.target.value);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage + 1);
    setLimit(newPageSize);

  };
  console.log('limit', setLimit)

  const handlePaginationModelChange = (params: { page: number; pageSize: number }) => {
    handlePageChange(params.page, params.pageSize);
    debouncedFetch();
  };


  // useEffect(() => {
  //   dispatch(fetchLeaves({ page, limit }))
  //   console.log('page', page, limit)
  // }, [dispatch, page])

  useEffect(() => {
    if (leaves.length === 0) {
      dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }))
    }

    // Fetch employees and set the state
    const fetchEmployees = async () => {
      const data = await apiResponse();

      setEmployees(data);
    };

    fetchEmployees();
  }, [dispatch, leaves.length, page])


  // useEffect(() => {
  //   // Fetch employees and set the state
  //   const fetchEmployees = async () => {
  //     const data = await apiResponse();

  //     setEmployees(data);
  //   };

  //   fetchEmployees();
  // }, [dispatch])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}')
    setUserRole(user.role)
    setUserId(user.id)
  }, [])

  function AddLeavesForm({ handleClose, leave }) {
    const [formData, setFormData] = useState({
      employee: '',
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
            employee: selected.employee._id,
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
      const url = leave ? `${process.env.NEXT_PUBLIC_APP_URL}/leaves/update/${leave}` : `${process.env.NEXT_PUBLIC_APP_URL}/leaves/create`
      console.log("submitted form data", formData);

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
          dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }));
        })
        .catch(error => {
          console.log('Error', error);
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
            {leave ? 'Edit Leave' : 'Add Leave'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
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
            <TextField
              fullWidth
              label='Start Date'
              name='start_date'
              value={formData.start_date}
              type='date'
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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


  const generateColumns = () => {
    const columns: GridColDef[] = [
      {
        field: 'employee_name',
        headerName: 'Employee',
        width: 220,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        align: 'center',
        renderCell: (params) => {
          // Define basic styles
          const textStyle = {
            fontSize: '1em', // Example styling
            fontWeight: 'bold', // Example styling
            // Example styling
          };

          return (
            <Box display="flex" alignItems="center">
              <Avatar src={params.row.employee_image} alt={params.row.employee_name} sx={{ mr: 2 }} />
              <Typography sx={textStyle}>{params.row.employee_name}</Typography>
            </Box>
          );
        },
      },
      { field: 'start_date', headerName: 'Start Date', headerClassName: 'super-app-theme--header', width: 130, sortable: false },
      { field: 'end_date', headerName: 'End Date', headerClassName: 'super-app-theme--header', width: 130, sortable: false },
      { field: 'status', headerName: 'Status', headerClassName: 'super-app-theme--header', width: 110, sortable: false },
      { field: 'application', headerName: 'Application', headerClassName: 'super-app-theme--header', width: 150, sortable: false },
      { field: 'type', headerName: 'Type', headerClassName: 'super-app-theme--header', width: 100, sortable: false },
      { field: 'day', headerName: 'Day', headerClassName: 'super-app-theme--header', width: 180, sortable: false },
      ...(userRole === '1' ? [{
        field: 'edit',
        headerName: 'Edit',
        sortable: false,
        headerAlign: 'center',
        width: 160,
        headerClassName: 'super-app-theme--header',
        renderCell: ({ row: { _id } }) => (
          <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
            <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleLeaveEditClick(_id)}>
              <DriveFileRenameOutlineOutlined />
            </Button>
          </Box>
        ),
      }] : [])
    ];

    return columns;
  }

  const transformData = () => {

    const dataToUse = searchName || selectedStatus ? filteredLeave : leaves;
    const filteredLeaves = userRole === '3'
      ? dataToUse.filter(leave => leave.employee._id === userId)
      : dataToUse;
    const groupedData = filteredLeaves.reduce((acc, curr) => {
      const { employee, start_date, end_date, status, application, type, day, _id } = curr;

      if (!employee) {
        // If employee is null or undefined, skip this attendance record
        return acc;
      }

      acc.push({
        _id,
        employee_id: employee._id,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        employee_image: employee.image,
        start_date,
        end_date,
        status,
        application,
        type,
        day,
      });

      return acc;
    }, []);

    return groupedData;
  };

  const columns = generateColumns();
  const rows = transformData();

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddLeavesForm leave={selectedLeaves} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
              Leave
            </Typography>
            <Typography
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Leave
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            {userRole === "1" ? (
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                variant='contained'
                color='warning'
                startIcon={<AddIcon />}
                onClick={handleLeaveAddClick}
              >
                Add Leave
              </Button>
            ) : userRole === "3" ? (
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                variant='contained'
                color='warning'
                startIcon={<AddIcon />}
                onClick={handleLeaveAddClick}
              >
                Apply Leave
              </Button>
            ) : null}
          </Box>

        </Box>
        <Grid container spacing={6} alignItems='center' mb={2}>
          {/* <Grid item xs={12} md={3}>
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
          </Grid> */}
          {userRole === "1" && (
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label='Employee Name'
                variant='outlined'
                value={selectedKeyword}
                onChange={handleInputChange}
              />
            </Grid>
          )}
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
              fontSize: 17,

              fontWeight: 600,
              alignItems: 'center'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '10',

              align: 'center',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: 'rgb(46 38 61 / 12%)',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#fffff',
              },

              fontWeight: '600',
              fontSize: '14px',
              boxSizing: 'border-box'
            },
          }}
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          paginationMode="server"
          rowCount={total}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={{ page: page - 1, pageSize: limit }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
