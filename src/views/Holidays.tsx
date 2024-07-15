/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
'use client'

import React, { useEffect, useState } from 'react'

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
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidays } from '@/redux/features/holidays/holidaysSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function HolidayGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { holidays, loading, error } = useSelector((state: RootState) => state.holidays)
  const [showForm, setShowForm] = useState(false)
  const [selectedHoliday, setSelectedHoliday] = useState(null)

  useEffect(() => {
    if (holidays.length === 0) {
      dispatch(fetchHolidays())
    }
  }, [dispatch, holidays.length]);

  function AddHolidayForm({ handleClose, holiday }) {
    const [formData, setFormData] = useState({
      title: '',
      note: '',
      year: '',
      start_date: '',
      end_date: '',
    })

    useEffect(() => {
      if (holiday) {
        const selected = holidays.find(h => h._id === holiday)
        if (selected) {
          setFormData({
            title: selected.title,
            note: selected.note,
            year: selected.year,
            start_date: selected.start_date,
            end_date: selected.end_date,
          })
        }
      }
    }, [holiday, holidays])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = holiday ? 'PUT' : 'POST'
      const url = holiday ? `${process.env.NEXT_PUBLIC_APP_URL}/holidays/update/${holiday}` : `${process.env.NEXT_PUBLIC_APP_URL}/holidays/create`
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
          dispatch(fetchHolidays());
        })
        .catch(error => {
          toast.error('Error: ' + error.message, {
            position: 'top-center',
          });
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {holiday ? 'Edit Holiday' : 'Add Holiday'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Start Date'
              name='start_date'
              value={formData.start_date}
              type='date'
              onChange={handleChange}
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
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Note'
              name='note'
              value={formData.note}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Year'
              name='year'
              value={formData.year}
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
              {holiday ? 'UPDATE HOLIDAY' : 'ADD HOLIDAY'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleHolidayAddClick = () => {
    setSelectedHoliday(null)
    setShowForm(true)
  }

  const handleHolidayEditClick = (id) => {
    setSelectedHoliday(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', headerClassName: 'super-app-theme--header', width: 200, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'start_date', headerName: 'Holiday Start Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'end_date', headerName: 'Holiday End Date', headerClassName: 'super-app-theme--header', width: 150, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'note', headerName: 'Note', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'year', headerName: 'Year', headerClassName: 'super-app-theme--header', width: 100, headerAlign: 'center', align: 'center', sortable: false },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 160,
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleHolidayEditClick(_id)}>
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
            <AddHolidayForm holiday={selectedHoliday} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
              Holiday
            </Typography>
            <Typography
              style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Holiday
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleHolidayAddClick}
            >
              Add Holiday
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
          rows={holidays}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'title', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection
          disableRowSelectionOnClick />
      </Box>
    </Box>
  );
}
