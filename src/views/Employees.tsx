'use client'

import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux';
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
  Menu,
  Chip
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

import type { RootState, AppDispatch } from '../redux/store';
import { fetchEmployees } from '../redux/features/employees/employeesSlice';



export default function EmployeeGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { employees, loading, error } = useSelector((state: RootState) => state.employees);

  const [showForm, setShowForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const capitalizeWords = (name) => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length]);

  function AddEmployeeForm({ handleClose, employee }) {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      contact: "",
      role_priority: "",
      dob: "",
      gender: "",
      designation: "",
      password: "",
      joining_date: "",
      leaving_date: "",
      status: "active",
      image: ""
    })

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
      if (employee) {
        const selected = employees.find(t => t._id === employee)

        if (selected) {
          setFormData({
            first_name: selected.first_name,
            last_name: selected.last_name,
            email: selected.email,
            contact: selected.contact,
            role_priority: selected.role_priority,
            dob: selected.dob,
            gender: selected.gender,
            designation: selected.designation,
            password: selected.password,
            joining_date: selected.joining_date,
            leaving_date: selected.leaving_date,
            status: selected.status,
            image: selected.image
          })
          setImagePreviewUrl(selected.image);
        }
      }
    }, [employee, employees])

    console.log("formData>>>employee>>>", employee, formData);

    const handleChange = (e) => {
      const { name, value } = e.target

      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    };

    const handleSubmit = () => {
      const method = employee ? 'PUT' : 'POST'
      const url = employee ? `${process.env.NEXT_PUBLIC_APP_URL}/employees/update/${employee}` : `${process.env.NEXT_PUBLIC_APP_URL}/employees/create`;

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      fetch(url, {
        method,
        body: formDataToSend
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data)
          handleClose()
          dispatch(fetchEmployees());
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            {employee ? 'Edit Employee' : 'Add Employee'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='First Name'
              name='first_name'
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Last Name'
              name='last_name'
              value={formData.last_name}
              onChange={handleChange}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Contact'
              name='contact'
              value={formData.contact}
              onChange={handleChange}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type='date'
              label='DOB'
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required />
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
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
                <MenuItem value='Other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Confirm Password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Joining Date'
              type='date'
              name='joining_date'
              value={formData.joining_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Leaving Date'
              type='date'
              name='leaving_date'
              value={formData.leaving_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Select Status</InputLabel>
              <Select
                label='Select Status'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name='status'
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>In Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Select Role</InputLabel>
              <Select
                label='Select Role'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name='role_priority'
                value={formData.role_priority}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value='1'>Admin</MenuItem>
                <MenuItem value='2'>Manager</MenuItem>
                <MenuItem value='3'>Employee</MenuItem>
                <MenuItem value='4'>Channel Partner</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='designation-select-label'>Select Designation</InputLabel>
              <Select
                label='Select Designation'
                labelId='designation-select-label'
                id='designation-select'
                name='designation'
                value={formData.designation}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value='Software Engineer'>Software Engineer</MenuItem>
                <MenuItem value='Product Manager'>Product Manager</MenuItem>
                <MenuItem value='Data Scientist'>Data Scientist</MenuItem>
                <MenuItem value='UI/UX Designer'>UI/UX Designer</MenuItem>
                <MenuItem value='Quality Assurance'>Quality Assurance</MenuItem>
                <MenuItem value='DevOps Engineer'>DevOps Engineer</MenuItem>
                <MenuItem value='HR Manager'>HR Manager</MenuItem>
                <MenuItem value='Sales Executive'>Sales Executive</MenuItem>
              </Select>
            </FormControl>


          </Grid>

          <Grid item xs={12} md={6}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" fullWidth>
                Upload Image
              </Button>
            </label>
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Image Preview" style={{ width: '100%', marginTop: '10px' }} />}
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
              {employee ? "UPDATE EMPLOYEE" : "ADD EMPLOYEE"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleAddEmployeeClick = () => {
    setSelectedEmployee(null)
    setShowForm(true)
  }

  const handleEditEmployeeClick = (id) => {
    console.log("id>>>", id)
    setSelectedEmployee(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  function EmployeeCard({ employee, id }) {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
      setAnchorEl(null)
    }

    return (
      <Card sx={{ height: "100%", borderRadius: "30px" }}>
        <CardContent>
          <Box display='flex' justifyContent='flex-end'>
            <IconButton aria-label='settings' onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                }}
              >
                <Button onClick={() => handleEditEmployeeClick(id)}><EditIcon fontSize='small' style={{ marginRight: 8 }} />Edit</Button>
              </MenuItem>
            </Menu>
          </Box>
          <Avatar alt={employee.first_name} src={employee?.image} sx={{ width: 80, height: 80, margin: '0 auto' }} />
          <Typography style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }} variant='h6' component='div' margin={2}>
            {capitalizeWords(employee.first_name)} {capitalizeWords(employee.last_name)}
          </Typography>
          <Typography style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'center' }} variant='body2' color='text.secondary' margin={2}>
            {employee.designation}
          </Typography>

          <Typography style={{ fontWeight: 'bold', textAlign: 'center' }} variant='body2' color='text.secondary' margin={2}>
            <Chip
              className='capitalize'
              variant='tonal'
              color={employee.status === 'pending' ? 'warning' : employee.status === 'inactive' ? 'secondary' : 'success'}
              label={employee.status}
              size='small'
            />
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent>
          <AddEmployeeForm employee={selectedEmployee} handleClose={handleClose} />
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
          <Grid item xs={12} sm={6} md={3} key={employee._id}>
            <EmployeeCard employee={employee} id={employee._id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
