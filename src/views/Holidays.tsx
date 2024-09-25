'use client'

import React, { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Typography,
  Box,
  Grid,
  InputAdornment,
  TextField,
  Dialog,
  DialogContent,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns'

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchHolidays } from '@/redux/features/holidays/holidaysSlice';
import 'react-toastify/dist/ReactToastify.css';
import AddHolidayForm from '@/components/holiday/HolidayForm';

export default function HolidayGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { holidays, loading, error, filteredHoliday, total } = useSelector((state: RootState) => state.holidays);
  const [showForm, setShowForm] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isHalfDay, setIsHalfDay] = useState(false);

  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchHolidays({ page, limit, keyword: selectedKeyword }));
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

  const handlePaginationModelChange = (params: { page: number; pageSize: number }) => {
    handlePageChange(params.page, params.pageSize);
    debouncedFetch();
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');

    setUserRole(user.role);
    setUserId(user.id);
  }, []);

  const handleHolidayAddClick = () => {
    setSelectedHoliday(null);
    setShowForm(true);
  };

  const handleHolidayEditClick = (id) => {
    setSelectedHoliday(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const columns: GridColDef[] = [
    { field: 'day', headerName: 'Day', headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', flex: 0.5 },
    { field: 'title', headerName: 'Title', headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'start_date',
      headerName: 'Closing Date',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const dateValue = params.value ? new Date(params.value) : null;


        return dateValue && !isNaN(dateValue.getTime())
          ? format(dateValue, 'dd-MMM-yyyy').toUpperCase()
          : 'Invalid Date';
      },
    },
    {
      field: 'end_date',
      headerName: 'Opening Date',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const dateValue = params.value ? new Date(params.value) : null;


        return dateValue && !isNaN(dateValue.getTime())
          ? format(dateValue, 'dd-MMM-yyyy').toUpperCase()
          : 'Invalid Date';
      },
    },

    { field: 'note', headerName: 'Note', headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', flex: 1.5 },
    ...(userRole === '1'
      ? [
        {
          field: 'edit',
          headerName: 'Edit',
          sortable: false,
          headerAlign: 'center',
          flex: 0.5,
          headerClassName: 'super-app-theme--header',
          renderCell: ({ row: { _id } }) => (
            <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
              <Button color="info" variant="contained" sx={{ minWidth: '50px' }} onClick={() => handleHolidayEditClick(_id)}>
                <DriveFileRenameOutlineOutlined />
              </Button>
            </Box>
          ),
        },
      ]
      : []),
  ];

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            {/* <AddHolidayForm holiday={selectedHoliday} handleClose={handleClose} /> */}
            <AddHolidayForm holiday={selectedHoliday} handleClose={handleClose} holidays={holidays} debouncedFetch={debouncedFetch} isHalfDay={undefined} />
          </DialogContent>
        </Dialog>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em' }} variant="h5" gutterBottom>
              Holiday
            </Typography>
            <Typography style={{ fontSize: '1em', fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
              Dashboard / Holiday
            </Typography>
          </Box>
          {userRole === '1' && (
            <Box display="flex" alignItems="center">
              <Button
                style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                variant="contained"
                color="warning"
                startIcon={<AddIcon />}
                onClick={handleHolidayAddClick}
              >
                Add Holiday
              </Button>
            </Box>
          )}
        </Box>
        <Grid container spacing={6} alignItems="center" mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={selectedKeyword}
              onChange={handleInputChange}
              InputProps={{
                sx: {
                  borderRadius: "50px", // To make the TextField rounded
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={3}>
            <Button style={{ padding: 15, backgroundColor: '#198754' }} variant="contained" fullWidth>
              SEARCH
            </Button>
          </Grid> */}
        </Grid>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          sx={{
            '& .super-app-theme--header': {
              fontSize: 17,
              fontWeight: 600,
              alignItems: 'center',
            },
            '& .mui-yrdy0g-MuiDataGrid-columnHeaderRow ': {
              background: 'linear-gradient(270deg, var(--mui-palette-primary-main), #2c3ce3 100%) !important',
              color: 'white',
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
              boxSizing: 'border-box',
            },
          }}
          components={{
            Toolbar: GridToolbar,
          }}
          rows={filteredHoliday.length > 0 ? filteredHoliday : holidays}
          columns={columns}
          getRowId={(row) => row._id}
          paginationMode="server"
          rowCount={total}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={{ page: page - 1, pageSize: limit }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
