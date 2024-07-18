"use client"

import React, { useEffect, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  InputLabel
} from '@mui/material'


import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import type { RootState, AppDispatch } from '../redux/store';
import { fetchTeams } from '../redux/features/teams/teamsSlice';

export default function TeamGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { teams, loading, error } = useSelector((state: RootState) => state.teams);

  const [showForm, setShowForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    if (teams.length === 0) {
      dispatch(fetchTeams());
    }
  }, [dispatch, teams.length]);

  function AddTeamForm({ handleClose, team }) {
    const [formData, setFormData] = useState({
      manager_id: '',
      employee_ids: '',
      name: '',
      code: ''
    })

    useEffect(() => {
      if (team) {
        const selected = teams.find(t => t._id === team)

        if (selected) {
          setFormData({
            manager_id: selected.manager_id,
            employee_ids: selected.employee_ids,
            name: selected.name,
            code: selected.code
          })
        }
      }
    }, [team, teams])

    const handleChange = (e) => {
      const { name, value } = e.target

      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = team ? 'PUT' : 'POST'
      const url = team ? `${process.env.NEXT_PUBLIC_APP_URL}/teams/update/${team}` : `${process.env.NEXT_PUBLIC_APP_URL}/teams/create`

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
          dispatch(fetchTeams());
        })
        .catch(error => {
          console.log('Error', error);
        });
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {team ? 'Edit Team' : 'Add Team'}
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
              label='Manager ID'
              name='manager_id'
              value={formData.manager_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Employee IDs'
              name='employee_ids'
              value={formData.employee_ids}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Code'
              name='code'
              value={formData.code}
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
              {team ? 'UPDATE TEAM' : 'ADD TEAM'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleAddTeamClick = () => {
    setSelectedTeam(null)
    setShowForm(true)
  }

  const handleEditTeamClick = (id) => {
    setSelectedTeam(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 150 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    {
      field: 'manager_id',
      headerName: 'Manager ID',
      width: 200,
      editable: true,
    },
    {
      field: 'employee_ids',
      headerName: 'Employee IDs',
      width: 200,
      editable: true,
    },
    {
      field: 'code',
      headerName: 'Code',
      width: 200,
      editable: true,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 200,
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleEditTeamClick(_id)}>
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <ToastContainer />
      <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent>
          <AddTeamForm team={selectedTeam} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Box>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            Team
          </Typography>
          <Typography style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }} variant='subtitle1' gutterBottom>
            Dashboard / Team
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <IconButton style={{ backgroundColor: '#ff902f', borderRadius: 10, color: 'white', marginRight: 10 }} aria-label='grid view'>
            <ViewModuleIcon />
          </IconButton>
          <IconButton style={{ backgroundColor: '#fff', color: '#4d5154', borderRadius: 10, marginRight: 10 }} aria-label='list view'>
            <ViewListIcon />
          </IconButton>
          <Button
            style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
            variant='contained'
            color='warning'
            startIcon={<AddIcon />}
            onClick={handleAddTeamClick}
          >
            Add Team
          </Button>
        </Box>
      </Box>
      <Grid container spacing={6} alignItems='center' mb={2}>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label='Team ID' variant='outlined' />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label='Team Name' variant='outlined' />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Designation</InputLabel>
            <Select
              label='Select Designation'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue=''
            >
              <MenuItem value='1'>Admin</MenuItem>
              <MenuItem value='2'>Manager</MenuItem>
              <MenuItem value='3'>Team</MenuItem>
              <MenuItem value='4'>Channel Partner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button style={{ padding: 15, backgroundColor: '#198754' }} variant='contained' fullWidth>
            SEARCH
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={12}>
          <DataGrid
            sx={{
              '& .mui-yrdy0g-MuiDataGrid-columnHeaderRow ': {
                background: 'linear-gradient(270deg, var(--mui-palette-primary-main), rgb(197, 171, 255) 100%) !important',
              },
              '& .mui-wop1k0-MuiDataGrid-footerContainer': {
                background: 'linear-gradient(270deg, var(--mui-palette-primary-main), rgb(197, 171, 255) 100%) !important',
              }
            }}
            rows={teams}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </Box>
  )
}
