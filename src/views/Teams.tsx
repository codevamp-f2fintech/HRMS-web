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
  Menu,
  InputLabel
} from '@mui/material'

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

const teams = [
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

const columns: GridColDef<(typeof teams)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,

  },
  {
    field: 'designation',
    headerName: 'Designation',
    type: 'number',
    width: 110,
    editable: true,

  },
  {
    field: 'image',
    headerName: 'Image',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
  {
    field: 'edit',
    headerName: 'Edit',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    renderCell: ({ row: { id } }) => {
      return (
        <Box width="85%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="space-around">

          <Button color="info" variant="contained"
            sx={{ minWidth: "50px" }}
          >
            <DriveFileRenameOutlineOutlined />
          </Button>
        </Box>
      );
    }
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

function TeamCard({ team, onEdit }) {
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
                onEdit(team)
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
        <Avatar alt={team.name} src={team.image} sx={{ width: 56, height: 56, margin: '0 auto' }} />
        <Typography style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }} variant='h6' component='div'>
          {team.name}
        </Typography>
        <Typography style={{ fontWeight: 'bold', textAlign: 'center' }} variant='body2' color='text.secondary'>
          {team.designation}
        </Typography>
      </CardContent>
    </Card>
  )
}

function AddTeamForm({ handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Add Team
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
          <TextField fullWidth label='Team ID' required />
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
              <MenuItem value='1'>Admin</MenuItem>
              <MenuItem value='2'>Manager</MenuItem>
              <MenuItem value='3'>Team</MenuItem>
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

function EditTeamForm({ team, handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
          Edit Team
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='First Name' defaultValue={team.first_name} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Last Name' defaultValue={team.last_name} required />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Email' defaultValue={team.email} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Joining Date'
            type='date'
            defaultValue={team.dob}
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
              defaultValue={team.gender}
            >
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
              <MenuItem value='other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Password' type='password' defaultValue={team.password} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Confirm Password' type='password' defaultValue={team.password} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Team ID' defaultValue={team.teamId} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Joining Date'
            type='date'
            defaultValue={team.joining_date}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Leaving Date'
            type='date'
            defaultValue={team.leaving_date}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label='Status' defaultValue={team.status} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Department</InputLabel>
            <Select
              label='Select Department'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              defaultValue={team.department}
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
              defaultValue={team.designation}
            >
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
              <MenuItem value='1'>Admin</MenuItem>
              <MenuItem value='2'>Manager</MenuItem>
              <MenuItem value='3'>Team</MenuItem>
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

export default function TeamGrid() {
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  const handleAddTeamClick = () => {
    setShowForm(true)
    setEditMode(false)
  }

  const handleEditTeamClick = team => {
    setSelectedTeam(team)
    setShowForm(true)
    setEditMode(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2, gap: "10" }}>
      <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent>
          {editMode ? (
            <EditTeamForm team={selectedTeam} handleClose={handleClose} />
          ) : (
            <AddTeamForm handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Box>
          <Typography style={{ fontSize: '2em', color: 'black' }} variant='h5' gutterBottom>
            Team
          </Typography>
          <Typography
            style={{ color: '#212529bf', fontSize: '1em', fontWeight: 'bold' }}
            variant='subtitle1'
            gutterBottom
          >
            Dashboard / Team
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
              {/* <MenuItem value=''>
                <em>Select Department</em>
              </MenuItem> */}
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
