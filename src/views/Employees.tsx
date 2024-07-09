'use client'

import React, { useState } from 'react'

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  Menu
} from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

const employees = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Web Designer',
    image: 'https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-6.jpg'
  },
  {
    id: 2,
    name: 'Richard Miles',
    designation: 'Web Developer',
    image:
      'https://media.istockphoto.com/id/647830296/photo/man-with-a-serious-expression.jpg?s=612x612&w=0&k=20&c=JUpBJSpN5eRwt_7CH5ZtYK8OBIVi5uHHjSrj2pRUeuk='
  },
  {
    id: 3,
    name: 'John Smith',
    designation: 'Android Developer',
    image: 'https://th.bing.com/th/id/OIP.gjQflYUHMYUWZ3yjw36wCAAAAA?w=285&h=285&rs=1&pid=ImgDetMain'
  },
  {
    id: 4,
    name: 'Mike Litorus',
    designation: 'IOS Developer',
    image: 'https://th.bing.com/th/id/OIP.PSsfhMrp02gLrCRtChEmvwHaI8?w=1200&h=1450&rs=1&pid=ImgDetMain'
  },
  {
    id: 5,
    name: 'John Doe',
    designation: 'Web Designer',
    image: 'https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-6.jpg'
  },
  {
    id: 6,
    name: 'Richard Miles',
    designation: 'Web Developer',
    image:
      'https://media.istockphoto.com/id/647830296/photo/man-with-a-serious-expression.jpg?s=612x612&w=0&k=20&c=JUpBJSpN5eRwt_7CH5ZtYK8OBIVi5uHHjSrj2pRUeuk='
  },
  {
    id: 7,
    name: 'John Smith',
    designation: 'Android Developer',
    image: 'https://th.bing.com/th/id/OIP.gjQflYUHMYUWZ3yjw36wCAAAAA?w=285&h=285&rs=1&pid=ImgDetMain'
  },
  {
    id: 8,
    name: 'Mike Litorus',
    designation: 'IOS Developer',
    image: 'https://th.bing.com/th/id/OIP.PSsfhMrp02gLrCRtChEmvwHaI8?w=1200&h=1450&rs=1&pid=ImgDetMain'
  },
  {
    id: 9,
    name: 'John Doe',
    designation: 'Web Designer',
    image: 'https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-6.jpg'
  },
  {
    id: 10,
    name: 'Richard Miles',
    designation: 'Web Developer',
    image:
      'https://media.istockphoto.com/id/647830296/photo/man-with-a-serious-expression.jpg?s=612x612&w=0&k=20&c=JUpBJSpN5eRwt_7CH5ZtYK8OBIVi5uHHjSrj2pRUeuk='
  },
  {
    id: 11,
    name: 'John Smith',
    designation: 'Android Developer',
    image: 'https://th.bing.com/th/id/OIP.gjQflYUHMYUWZ3yjw36wCAAAAA?w=285&h=285&rs=1&pid=ImgDetMain'
  },
  {
    id: 12,
    name: 'Mike Litorus',
    designation: 'IOS Developer',
    image: 'https://th.bing.com/th/id/OIP.PSsfhMrp02gLrCRtChEmvwHaI8?w=1200&h=1450&rs=1&pid=ImgDetMain'
  }
]

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

function EmployeeCard({ employee, onEdit }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='flex-end'>
          <IconButton aria-label='settings' onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose()
                onEdit(employee)
              }}
            >
              <EditIcon fontSize='small' style={{ marginRight: 8 }} />
              Edit
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>
              <DeleteIcon fontSize='small' style={{ marginRight: 8 }} />
              Delete
            </MenuItem> */}
          </Menu>
        </Box>
        <Avatar alt={employee.name} src={employee.image} sx={{ width: 56, height: 56, margin: '0 auto' }} />
        <Typography style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }} variant='h6' component='div'>
          {employee.name}
        </Typography>
        <Typography style={{ fontWeight: 'bold', textAlign: 'center' }} variant='body2' color='text.secondary'>
          {employee.designation}
        </Typography>
      </CardContent>
    </Card>
  )
}

function AddEmployeeForm({ handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Add Employee
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='First Name' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Last Name' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Contact' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Email' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='DOB' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel required id='demo-simple-select-label'>
              Select Gender
            </InputLabel>
            <Select
              label='Select Gender'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue=''
            >
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
              <MenuItem value='other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Password' type='password' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Confirm Password' type='password' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Employee ID' required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Joining Date' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Leaving Date' type='date' InputLabelProps={{ shrink: true }} required />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Status' />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Department</InputLabel>
            <Select
              label='Select Department'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue=''
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
              defaultValue=''
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
            ADD EMPLOYEE
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
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
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

export default function EmployeeGrid() {
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const handleAddEmployeeClick = () => {
    setShowForm(true)
    setEditMode(false)
  }

  const handleEditEmployeeClick = employee => {
    setSelectedEmployee(employee)
    setShowForm(true)
    setEditMode(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  return (
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
            Employee
          </Typography>
          <Typography
            style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
            variant='subtitle1'
            gutterBottom
          >
            Dashboard / Employee
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <IconButton
            style={{ backgroundColor: '#ff902f', borderRadius: 10, color: 'white', marginRight: 10 }}
            aria-label='grid view'
          >
            <ViewModuleIcon />
          </IconButton>
          <IconButton
            style={{ backgroundColor: '#fff', color: '#4d5154', borderRadius: 10, marginRight: 10 }}
            aria-label='list view'
          >
            <ViewListIcon />
          </IconButton>
          <Button
            style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
            variant='contained'
            color='warning'
            startIcon={<AddIcon />}
            onClick={handleAddEmployeeClick}
          >
            Add Employee
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
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Designation</InputLabel>
            <Select
              label='Select Designation'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue=''
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
        <Grid item xs={12} md={3}>
          <Button style={{ padding: 15, backgroundColor: '#198754' }} variant='contained' fullWidth>
            SEARCH
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        {employees.map(employee => (
          <Grid item xs={12} sm={6} md={3} key={employee.id}>
            <EmployeeCard employee={employee} onEdit={handleEditEmployeeClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
