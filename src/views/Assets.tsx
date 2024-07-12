/* eslint-disable padding-line-between-statements */
/* eslint-disable react/jsx-no-undef */
'use client'

import { useEffect, useState } from 'react';

import { Button, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material';

export default function AssetsGrid() {

  const [showForm, setShowForm] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [assets, setAssets] = useState([])

  const fetchAssets = () => {
    fetch('http://localhost:5500/assests/get')
      .then(response => response.json())
      .then(data => setAssets(data))

      .catch(error => console.error('Error fetching assests data:', error))
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  function AddAssetForm({ handleClose, asset }) {
    const [formData, setFormData] = useState({
      employee_id: '',
      description: '',
      model: '',
      name: '',
      sno: '',
      type: '',
      assignment_date: '',
      return_date: '',
    })

    useEffect(() => {
      if (asset) {
        const selected = assets.find(ast => ast._id === asset)
        if (selected) {
          setFormData({
            employee_id: selected.employee_id,
            description: selected.description,
            model: selected.model,
            name: selected.name,
            sno: selected.sno,
            type: selected.type,
            assignment_date: selected.assignment_date,
            return_date: selected.return_date,
          })
        }
      }
    }, [asset, assets])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleSubmit = () => {
      const method = asset ? 'PUT' : 'POST'
      const url = asset ? `http://localhost:5500/assests/update/${asset}` : `http://localhost:5500/assests/create`
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success', data);
          handleClose();
          fetchAssets();
        })
        .catch(error => {
          console.log('Error', error);

        })
    }

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {asset ? 'Edit Asset' : 'Add Asset'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Emp Id'
              name='employee_id'
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Model'
              name='model'
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Asset Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='SNO'
              name='sno'
              value={formData.sno}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Type'
              name='type'
              value={formData.type}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Assignment Date'
              name='assignment_date'
              value={formData.assignment_date}
              type='date'
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Return Date'
              name='return_date'
              value={formData.return_date}
              type='date'
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
              {asset ? 'UPDATE ASSET' : 'ADD ASSET'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleAssetAddClick = () => {
    setSelectedAsset(null)
    setShowForm(true)
  }

  const handleEditAssetClick = (id) => {
    setSelectedAsset(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'employee_id',
      headerName: 'Employee Id',
      width: 150,
      editable: true,
    },
    {
      field: 'name',
      headerName: 'Assets Name',
      width: 150,
      editable: true,
    },
    {
      field: 'model',
      headerName: 'Model Name',
      width: 110,
      editable: true,
    },
    {
      field: 'sno',
      headerName: 'Sno',

      width: 110,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 130,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 110,
      editable: true,
    },
    {
      field: 'assignment_date',
      headerName: 'Assignment Date',
      type: 'string',
      width: 150,
      editable: true,
    },
    {
      field: 'return_date',
      headerName: 'Return Date',
      type: 'string',
      width: 150,
      editable: true,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 160,
      renderCell: ({ row: { _id } }) => (
        <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
          <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleEditAssetClick(_id)}>
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      ),
    },

  ];


  return (

    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddAssetForm asset={selectedAsset} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
              Assets
            </Typography>
            <Typography
              style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Assets
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleAssetAddClick}
            >
              Add Assests
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

          // getRowHeight={() => 'auto'}

          rows={assets}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection
          disableRowSelectionOnClick />
      </Box>
    </>
  );
}

