/* eslint-disable react/jsx-no-undef */
'use client'

import { useState } from 'react';

import { Button, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
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
    type: 'string',
    width: 110,
    editable: true,
  },
  {
    field: 'sno',
    headerName: 'Sno',
    type: 'string',
    width: 110,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    type: 'string',
    width: 130,
    editable: true,
  },
  {
    field: 'type',
    headerName: 'Type',
    type: 'string',
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

];

const rows = [
  { id: 1, name: 'hp laptop', employee_id: '1', model: '14', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 2, name: 'dell', employee_id: '2', model: '31', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 3, name: 'dell', employee_id: '3', model: '31', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 4, name: 'Stark', employee_id: '4', model: '11', sno: '124', description: 'this is hp laptop', type: 'test' },
  { id: 5, name: 'Targaryen', employee_id: '5', model: 'null', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 6, name: 'Melisandre', employee_id: '5', model: '150', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 7, name: 'Clifford', employee_id: '7', model: '44', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 8, name: 'Frances', employee_id: '8', model: '36', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 9, name: 'Roxie', employee_id: '9', model: '65', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 10, name: 'Melisandre', employee_id: '5', model: '150', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 11, name: 'Clifford', employee_id: '7', model: '44', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 12, name: 'Frances', employee_id: '8', model: '36', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
  { id: 13, name: 'Roxie', employee_id: '9', model: '65', sno: '124', description: 'this is hp laptop', type: 'test', assignment_date: '2024-07-01', return_date: '024-07-06' },
];

function AddEmployeeForm({ handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Add Assets
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Employee Id' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Model' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Contact' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Assets Name' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='SNO' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Type' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Assignment Date' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Return Date' type='date' InputLabelProps={{ shrink: true }} required />
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
          >
            ADD ASSETS
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

function EditEmployeeForm({ employee, handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Edit Employee
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='First Name' defaultValue={employee.first_name} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Last Name' defaultValue={employee.last_name} required />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Email' defaultValue={employee.email} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Joining Date'
            type='date'
            defaultValue={employee.dob}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Gender</InputLabel>
            <Select
              label='Select Gender'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue={employee.gender}
            >
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
              <MenuItem value='other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Password' type='password' defaultValue={employee.password} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Confirm Password' type='password' defaultValue={employee.password} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Employee ID' defaultValue={employee.employeeId} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Joining Date'
            type='date'
            defaultValue={employee.joining_date}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Leaving Date'
            type='date'
            defaultValue={employee.leaving_date}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Status' defaultValue={employee.status} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Department</InputLabel>
            <Select
              label='Select Department'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue={employee.department}
            >
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
              <MenuItem value={10}>IT</MenuItem>
              <MenuItem value={20}>Credit</MenuItem>
              <MenuItem value={30}>Operation</MenuItem>
              <MenuItem value={40}>Marketing</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Designation</InputLabel>
            <Select
              label='Select Designation'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue={employee.designation}
            >
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
              <MenuItem value='1'>Admin</MenuItem>
              <MenuItem value='2'>Manager</MenuItem>
              <MenuItem value='3'>Employee</MenuItem>
              <MenuItem value='4'>Channel Partner</MenuItem>
            </Select>
          </FormControl>
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
          >
            SAVE CHANGES
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function AssetsGrid() {

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const handleAssetAdd = () => {
    setShowForm(true)
    setEditMode(false)
  }

  const handleEditAssetClick = employee => {
    setSelectedEmployee(employee)
    setShowForm(true)
    setEditMode(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  return (

    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            {editMode ? (
              <EditEmployeeForm employee={selectedEmployee} handleClose={handleClose} />
            ) : (
              <AddEmployeeForm handleClose={handleClose} />
            )}
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
              onClick={handleAssetAdd}
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

          rows={rows}
          columns={columns}
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
