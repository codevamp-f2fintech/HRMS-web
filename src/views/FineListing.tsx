'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Dialog, DialogContent, Typography, TextField, InputAdornment, Grid, Avatar, TableCell, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableBody } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { debounce } from 'lodash'
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-toastify/dist/ReactToastify.css';
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import type { RootState, AppDispatch } from '@/redux/store';
import { fetchFines } from '@/redux/features/fines/fineSlice';
import FineForm from '@/components/fine/FineForm';
import { format } from 'date-fns';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const FineListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fines, total, loading } = useSelector((state: RootState) => state.fines);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [toasts, setToast] = useState('');

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
        if (userRole === '1') {
          dispatch(fetchFines({ page, limit, keyword: selectedKeyword }));
        } else {
          dispatch(fetchFines({ page, limit, keyword: selectedKeyword, userId }));
        }
      }, 300),
    [dispatch, page, limit, selectedKeyword, userRole, userId]
  );


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
    if (id) {
      const foundFines = fines.find(employee =>
        employee.assets.find(ass => ass._id === id)
      );
      const fine = foundFines.assets.find((asse) => asse._id === id);
      setSelectedFine(fine); // Edit mode
    }

    setShowForm(true);
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

  const generateColumns = () => {
    const columns = [
      ...(userRole === '1' ? [
        {
          field: 'employee_name',
          headerName: 'Employee Name',
          width: 250,
          headerAlign: 'center',
          headerClassName: 'super-app-theme--header',
          align: "center",
          renderCell: (params) => {
            return (
              <Box display="flex" alignItems="center" height="100%">
                <Avatar
                  src={params.row.employee.image}
                  sx={{ marginLeft: 10, width: 40, height: 40 }}
                />
                <Typography sx={{ fontSize: '1em', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {params.row.employee.first_name} {params.row.employee.last_name}
                </Typography>
              </Box>
            )
          }
        },
        {
          field: 'total',
          headerName: 'Total Fine ',
          headerAlign: 'center',
          flex: 1,
          headerClassName: 'super-app-theme--header',
          renderCell: (params) => {

            const assets = Array.isArray(params.row.assets) ? params.row.assets : [];
            const totalFineAmount = assets.reduce((total, asset) => {
              const fineAmount = asset.fineAmount ? parseFloat(asset.fineAmount) : 0;
              return total + fineAmount;
            }, 0);

            return (
              <Box display="flex" alignItems="center" width='100%' height="100%">
                <Typography fontWeight={700} sx={{ marginLeft: '5vw' }}>
                  {totalFineAmount}
                </Typography>
              </Box>
            );
          }
        },



        {
          field: 'fine ',
          headerName: 'Fine Details',
          width: 600,
          headerAlign: 'center',
          headerClassName: 'super-app-theme--header',
          renderCell: (params) => {
            console.log('params', params)
            return (
              <Box>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {`View all Fines (${Array.isArray(params.row.assets) ? params.row.assets.length : 0})`}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Fine Type</StyledTableCell>
                          <StyledTableCell>Fine Amount</StyledTableCell>
                          <StyledTableCell>Fine Date</StyledTableCell>
                          {userRole === '1' ? (
                            <StyledTableCell>Edit</StyledTableCell>
                          ) : ''}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(params.row.assets) && params.row.assets.map((fine, idx) => (
                          <TableRow key={`fine-${idx}`}>
                            <TableCell>{fine.fineType}</TableCell>
                            <TableCell>{fine.fineAmount} </TableCell>
                            <TableCell>
                              {fine.fineDate ? format(new Date(fine.fineDate), 'dd-MMM-yyyy').toUpperCase() : ''}
                            </TableCell>
                            {userRole === '1' ? (
                              <TableCell>
                                <Button variant="contained" style={{ backgroundColor: '#2c3ce3' }} sx={{ minWidth: '50px' }} onClick={() => handleEditFine(fine._id)}>
                                  <DriveFileRenameOutlineOutlined />
                                </Button>
                              </TableCell>
                            ) : ''}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          }
        }


      ] : [
        {
          field: 'fineType',
          headerName: 'Fine Type',
          flex: 1,
          minWidth: 150,
          headerClassName: 'super-app-theme--header',

        },
        {
          field: 'fineAmount',
          headerName: 'Fine Amount',
          flex: 1,
          minWidth: 100,
          headerClassName: 'super-app-theme--header',
        },
        {
          field: 'fineDate',
          headerName: 'Fine Date',
          flex: 1, minWidth: 100,
          headerClassName: 'super-app-theme--header',
        },
        // {
        //   field: 'total',
        //   headerName: 'Total',
        //   headerAlign: 'center',
        //   flex: 1,
        //   headerClassName: 'super-app-theme--header',
        //   align: "center",
        //   renderCell: (params) => {
        //     console.log('params', params)
        //     const amount = params.row.fineAmount
        //     const totalFineAmount = amount.reduce((total, asset) => {
        //       const fineAmount = asset.fineAmount ? parseFloat(asset.fineAmount) : 0;
        //       return total + fineAmount;
        //     }, 0);

        //     return (
        //       <Typography fontWeight={700}>
        //         {totalFineAmount}
        //       </Typography>
        //     );
        //   }
        // },
      ])
    ];
    return columns;
  };
  const columns = generateColumns()
  const userFines = useMemo(() => {
    return fines.map((fine) => ({
      _id: fine._id,
      employee: fine.employee,
      fineType: fine.fineType,
      fineAmount: fine.fineAmount,
      fineDate: fine.fineDate
    }));
  }, [fines])
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
          getRowHeight={() => 'auto'}
          sx={{
            '& .super-app-theme--header': {
              fontSize: 17,

              fontWeight: 600,
              alignItems: 'center'
            },
            '& .mui-yrdy0g-MuiDataGrid-columnHeaderRow ': {
              background: '#2c3ce3 !important',
              color: 'white'
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
          rows={userRole == '1' ? (fines) : (userFines)}
          columns={columns}
          pageSizeOptions={[10, 20, 30]}
          paginationMode='server'
          rowCount={total}
          loading={loading}
          getRowId={(row) => {
            if (userRole === "1") {
              return row._id && row._id._id ? row._id._id : row._id;
            }
            return row._id;
          }}
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
