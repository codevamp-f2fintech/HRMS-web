/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'
import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { debounce } from 'lodash';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  Avatar,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search';
import ContrastIcon from '@mui/icons-material/Contrast';

import InputAdornment from '@mui/material/InputAdornment';
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchLeaves } from '@/redux/features/leaves/leavesSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';
import AddLeavesForm from '@/components/leave/LeaveForm';

export default function LeavesGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const { leaves, total } = useSelector((state: RootState) => state.leaves);

  console.log(leaves)

  const [showForm, setShowForm] = useState(false)
  const [selectedLeaves, setSelectedLeaves] = useState(null)
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [employees, setEmployees] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedFetch = useMemo(
    () => debounce(() => {
      dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }));
    }, 300),
    [dispatch]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedKeyword(e.target.value);
  }, []);

  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage + 1);
    setLimit(newPageSize);
  }, []);

  const handlePaginationModelChange = useCallback((params: { page: number; pageSize: number }) => {
    handlePageChange(params.page, params.pageSize);
    debouncedFetch();
  }, [handlePageChange, debouncedFetch]);

  useEffect(() => {
    debouncedFetch();

    if (leaves.length === 0) {
      dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }));
    }

    const user = JSON.parse(localStorage.getItem("user") || '{}');
    setUserRole(user.role);
    setUserId(user.id);

    return debouncedFetch.cancel;
  }, [debouncedFetch, dispatch, leaves.length, limit, page, selectedKeyword]);

  useEffect(() => {
    if (Number(userRole) < 3 && employees.length === 0) {
      const fetchEmployees = async () => {
        const employeeData = await apiResponse();
        setEmployees(employeeData);
      };
      fetchEmployees();
    }
  }, [userRole, employees.length]);

  const handleLeaveAddClick = useCallback(() => {
    setSelectedLeaves(null)
    setShowForm(true)
  }, []);

  const handleLeaveEditClick = useCallback((id) => {
    setSelectedLeaves(id)
    setShowForm(true)
  }, []);

  const handleClose = useCallback(() => {
    setShowForm(false)
  }, []);

  function capitalizeFirstLetterEachWord(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  const generateColumns = useMemo(() => {
    return [
      ...(userRole === '1' ? [{
        field: 'employee_name',
        headerName: 'Employee',
        flex: 1,
        minWidth: 200,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        align: 'center',
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <Avatar src={params.row.employee_image} alt={params.row.employee_name} sx={{ mr: 2 }} />
            <Typography sx={{ fontSize: '1em', fontWeight: 'bold' }}>{params.row.employee_name}</Typography>
          </Box>
        ),
      }] : []),
      {
        field: 'day',
        headerName: 'Day',
        flex: 0.5,
        headerAlign: 'center',
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          const dayValue = parseFloat(params.value);
          const halfDayPeriod = params.row.half_day_period;

          if (dayValue === 0.5 && halfDayPeriod) {
            return (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ContrastIcon
                  sx={{
                    color: '#989c9a',
                    fontSize: 40,
                  }}
                />

                <Typography
                  fontWeight="bold"
                  fontSize="0.9em"
                  color="black"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {halfDayPeriod === 'First Half' ? 'FH' : 'SH'}
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Typography fontWeight="bold">
                {dayValue}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'start_date',
        headerName: 'Start Date',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          if (params.value) {
            try {
              const date = new Date(params.value);

              return !isNaN(date.getTime()) ? format(date, 'dd-MMM-yyyy').toUpperCase() : 'Invalid Date';
            } catch (error) {
              return 'Invalid Date';
            }
          }

          return 'No Date';
        },
      },
      {
        field: 'end_date',
        headerName: 'End Date',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
          const endDateValue = params.value || params.row.start_date;
          if (endDateValue) {
            try {
              const date = new Date(endDateValue);

              return !isNaN(date.getTime()) ? format(date, 'dd-MMM-yyyy').toUpperCase() : 'Invalid Date';
            } catch (error) {
              return 'Invalid Date';
            }
          }

          return 'No End Date';
        },
      },
      { field: 'type', headerName: 'Type', flex: 0.6, headerClassName: 'super-app-theme--header' },
      { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'super-app-theme--header' },
      { field: 'application', headerName: 'Reason', flex: 1, minWidth: 150, headerClassName: 'super-app-theme--header', renderCell: (params) => capitalizeFirstLetterEachWord(params.value || ''), },
      ...(userRole === '1' ? [{
        field: 'edit',
        headerName: 'Edit',
        flex: 0.5,
        headerAlign: 'center',
        headerClassName: 'super-app-theme--header',
        renderCell: ({ row: { _id } }) => (
          <Box display="flex" justifyContent="space-around">
            <Button color="info" variant="contained" onClick={() => handleLeaveEditClick(_id)}>
              <DriveFileRenameOutlineOutlined />
            </Button>
          </Box>
        ),
      }] : []),
    ];
  }, [userRole]);

  const rows = useMemo(() => {
    return leaves.map((leave) => ({
      _id: leave._id,
      employee_name: `${leave.employee?.first_name} ${leave.employee?.last_name}`,
      employee_image: leave.employee?.image,
      start_date: leave.start_date,
      end_date: leave.end_date,
      type: leave.type,
      status: leave.status,
      day: leave.day,
      application: leave.application,
      half_day_period: leave.half_day_period,
    }));
  }, [leaves]);

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            {/* <AddLeavesForm leave={selectedLeaves} handleClose={handleClose} /> */}
            <AddLeavesForm
              handleClose={handleClose}
              leave={selectedLeaves}
              leaves={leaves}
              userRole={userRole}
              userId={userId}
              employees={employees}
              page={page}
              limit={limit}
              selectedKeyword={selectedKeyword} />
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
            {Number(userRole) >= 2 && (
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                variant='contained'
                color='warning'
                startIcon={<AddIcon />}
                onClick={handleLeaveAddClick}
              >
                Apply Leave
              </Button>
            )}
          </Box>

        </Box>
        <Grid container spacing={6} alignItems='center' mb={2}>
          {userRole === "1" && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="search"
                variant="outlined"
                value={selectedKeyword}
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

          )}
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
          columns={generateColumns}
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
