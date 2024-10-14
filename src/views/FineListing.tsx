'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Dialog, DialogContent, Typography, TextField, InputAdornment, Grid, Avatar } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { debounce } from 'lodash'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import type { RootState, AppDispatch } from '@/redux/store'
import { fetchFines } from '@/redux/features/fines/fineSlice'
import FineForm from '@/components/fine/FineForm'

const FineListing = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { fines, total, loading } = useSelector((state: RootState) => state.fines)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [selectedFine, setSelectedFine] = useState(null)
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [toasts, setToast] = useState('')

  const [userRole, setUserRole] = useState<string>('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    setUserRole(user.role)

    setUserId(user.id)
  }, [])

  useEffect(() => {
    if (toasts) {
      toast.success(`${toasts}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })

      if (toasts === 'Something went wrong') {
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
    }
  }, [toasts])

  const debouncedFetchFines = useMemo(
    () =>
      debounce(() => {
        dispatch(fetchFines({ page, limit, keyword: selectedKeyword }))
      }, 300),
    [dispatch, page, limit, selectedKeyword]
  )

  useEffect(() => {
    debouncedFetchFines()

    return () => {
      debouncedFetchFines.cancel()
    }
  }, [debouncedFetchFines])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedKeyword(e.target.value)
  }

  const handlePageChange = (params: { page: number; pageSize: number }) => {
    setPage(params.page + 1)
    setLimit(params.pageSize)
  }

  const handleAddFine = () => {
    setSelectedFine(null)
    setShowForm(true)
  }

  const handleEditFine = (id: string) => {
    const fine = fines.find(fine => fine._id === id)

    setSelectedFine(fine)
    setShowForm(true)
  }

  const handleDeleteFines = id => {
    if (window.confirm('Are you sure you want to delete this fine?')) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/fines/delete/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            toast.success(data.message, {
              position: 'top-center'
            })
            debouncedFetchFines()
          } else {
            toast.error('Error deleting fines', {
              position: 'top-center'
            })
          }
        })
        .catch(error => {
          console.log('Error', error)
          toast.error('Unexpected error occurred', {
            position: 'top-center'
          })
        })
    }
  }


  const handleCloseForm = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      flex: 1,
      minWidth: 150,
      renderCell: params => (
        <Box display='flex' alignItems='center' sx={{ width: '100%' }}>
          {userRole === '1' && (
            <Avatar
              src={params.row.employee?.image}
              alt={`${params.row.employee?.first_name} ${params.row.employee?.last_name}`}
              sx={{ mr: 2 }}
            />
          )}

          <Typography
            sx={{
              mt: userRole !== '1' ? '12px' : 0,
              mb: userRole !== '1' ? '12px' : 0
            }}
          >
            {`${params.row.employee?.first_name || ''} ${params.row.employee?.last_name || ''}`}
          </Typography>
        </Box>
      )
    },
    { field: 'fineType', headerName: 'Fine Type', flex: 1, minWidth: 150 },
    { field: 'fineAmount', headerName: 'Fine Amount', flex: 1, minWidth: 100 },
    { field: 'fineDate', headerName: 'Fine Date', flex: 1, minWidth: 100 },

    ...(userRole === '1'
      ? [
        {
          field: 'edit',
          headerName: 'Actions',
          flex: 1,
          minWidth: 100,
          renderCell: (params) => {
            return (
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#2c3ce3', marginRight: '8px' }}
                  onClick={() => handleEditFine(params.row._id)}
                >
                  <EditIcon />
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleDeleteFines(params.row._id)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            );
          }
        }
      ]
      : [])
  ];


  const rows = fines
    ?.filter(fine => userRole === '1' || fine.employee._id === userId)
    .map(fine => ({
      _id: fine._id,
      employee: fine.employee,
      fineType: fine.fineType,
      fineAmount: fine.fineAmount,
      fineDate: fine.fineDate
    }))

  return (
    <Box>
      <ToastContainer />
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Box>
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
            Fines
          </Typography>
          <Typography style={{ fontSize: '1em', fontWeight: 'bold' }} variant='subtitle1' gutterBottom>
            Dashboard / Fine
          </Typography>
        </Box>
        {userRole === '1' && (
          <Button
            sx={{ backgroundColor: '#ff902f' }}
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleAddFine}
          >
            Add Fine
          </Button>
        )}
      </Box>

      <Grid container>
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            sx={{ mb: '1em' }}
            fullWidth
            label='search'
            variant='outlined'
            value={selectedKeyword}
            onChange={handleInputChange}
            InputProps={{
              sx: {
                borderRadius: '50px'
              },
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          sx={{
            '& .mui-yrdy0g-MuiDataGrid-columnHeaderRow ': {
              background: '#2c3ce3 !important',
              color: 'white'
            }
          }}
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 20, 30]}
          paginationMode='server'
          rowCount={total}
          loading={loading}
          getRowId={row => row._id}
          paginationModel={{ page: page - 1, pageSize: limit }}
          onPaginationModelChange={handlePageChange}
        />
      </Box>

      <Dialog open={showForm} onClose={handleCloseForm} fullWidth maxWidth='md'>
        <DialogContent>
          <FineForm fine={selectedFine} onClose={handleCloseForm} setToast={setToast} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default FineListing
