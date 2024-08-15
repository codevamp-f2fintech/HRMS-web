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
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'

import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchPolicies } from '@/redux/features/policies/policiesSlice';

export default function PolicyGrid() {
  const dispatch: AppDispatch = useDispatch()
  const { policies, loading, error, filteredPolicies, total } = useSelector((state: RootState) => state.policies)

  const [showForm, setShowForm] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  console.log('fetchpolicy', policies)

  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchPolicies({ page, limit, keyword: selectedKeyword }));
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

  function AddPolicyForm({ handleClose, policy }) {
    const [formData, setFormData] = useState({
      name: '',
      document_url: '',
      description: ''

    })

    useEffect(() => {
      if (policy) {
        const selected = policies.find(p => p._id === policy)
        if (selected) {
          setFormData({
            name: selected.name,
            document_url: selected.document_url,
            description: selected.description,
          })
        }
      }
    }, [policy, policies])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = policy ? 'PUT' : 'POST'
      const url = policy ? `${process.env.NEXT_PUBLIC_APP_URL}/policies/update/${policy}` : `${process.env.NEXT_PUBLIC_APP_URL}/policies/create`
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
          debouncedFetch();
        })
        .catch(error => {
          console.log('Error', error);
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
            {policy ? 'Edit Policy' : 'Add Policy'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Document_url'
              name='document_url'
              value={formData.document_url}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Description'
              name='description'
              value={formData.description}
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
                width: 250
              }}
              variant='contained'
              fullWidth
              onClick={handleSubmit}
            >
              {policy ? 'UPDATE POICY' : 'ADD POLICY'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handlePolicyAddClick = () => {
    setSelectedPolicy(null)
    setShowForm(true)
  }

  const handlePolicyEditClick = (id) => {
    setSelectedPolicy(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', headerClassName: 'super-app-theme--header', flex: 2, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'document_url', headerName: 'Document Url', headerClassName: 'super-app-theme--header', flex: 2, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'description', headerName: 'Description', headerClassName: 'super-app-theme--header', flex: 2, headerAlign: 'center', align: 'center', sortable: false },
    ...(userRole === '1' ? [{
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      headerAlign: 'center',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handlePolicyEditClick(_id)}>
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      ),
    }] : [])
  ];

  return (

    <Box>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddPolicyForm policy={selectedPolicy} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
              Policy
            </Typography>
            <Typography
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Policy
            </Typography>
          </Box>
          {userRole === "1" && <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handlePolicyAddClick}
            >
              Add Policy
            </Button>
          </Box>}
        </Box>
        <Grid container spacing={6} alignItems='center' mb={2}>

          <Grid item xs={12} md={3}>
            <TextField fullWidth label='Policy Name' variant='outlined' value={selectedKeyword} onChange={handleInputChange} />
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

              fontWeight: 600
            },
            '& .MuiDataGrid-cell': {
              fontSize: '1em',

              align: 'center',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {

              },
            },
          }}
          components={{
            Toolbar: GridToolbar,
          }}
          rows={filteredPolicies.length > 0 ? filteredPolicies : policies}
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
