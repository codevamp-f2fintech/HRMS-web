'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { fetchEmployees, resetEmployees } from '../redux/features/employees/employeesSlice';
import Loader from "../components/loader/loader";
import EmployeeForm from '@/components/employee/EmployeeForm';
import EmployeeCard from '@/components/employee/EmployeeCard';
import { utility } from '@/utility';

import 'react-toastify/dist/ReactToastify.css';

const { isTokenExpired } = utility();

export default function EmployeeGrid() {
  const dispatch = useDispatch();
  const { employees, hasMore, loading, error } = useSelector((state) => state.employees);

  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [page, setPage] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  const capitalizeWords = (name: String) => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      router.push('/login');
    } else {
      if (userRole === "") {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        setUserRole(user.role);
      }
    }
  }, [token, userRole, router]);

  useEffect(() => {
    if (searchName === '' && selectedDesignation === '') {
      dispatch(fetchEmployees({ page, limit: 12 }));
    }
  }, [dispatch, page]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        dispatch(fetchEmployees({ page: nextPage, limit: 12, search: searchName, designation: selectedDesignation }));
        return nextPage;
      });
    }
  }, [loading, hasMore, searchName, selectedDesignation, dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddEmployeeClick = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployeeClick = (id) => {
    setSelectedEmployee(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      dispatch(resetEmployees());
      dispatch(fetchEmployees({ page: 1, limit: searchName !== '' ? 0 : 12, search: searchName, designation: selectedDesignation }));
    }, 500),
    [searchName, selectedDesignation, dispatch]
  );

  useEffect(() => {
    if (searchName !== '' || selectedDesignation !== '') {
      debouncedSearch();
    }
  }, [searchName, selectedDesignation, debouncedSearch]);

  const handleInputChange = (e) => {
    const searchValue = e.target.value;

    setSelectedDesignation('');
    setSearchName(searchValue);
    if (searchValue === '') {
      setPage(1);
      dispatch(resetEmployees());
    }
  };

  const handleDesignationChange = (e) => {
    const designationValue = e.target.value;

    setSearchName('');
    setSelectedDesignation(designationValue);
    if (designationValue === '') {
      setPage(1);
      dispatch(resetEmployees());
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent>
          <EmployeeForm employee={selectedEmployee} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Box>
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
            Employee
          </Typography>
          <Typography
            style={{ fontSize: '1em', fontWeight: 'bold' }}
            variant='subtitle1'
            gutterBottom
          >
            Dashboard / Employee
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          {userRole === '1' && <Button
            style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
            variant='contained'
            color='warning'
            startIcon={<AddIcon />}
            onClick={handleAddEmployeeClick}
          >
            Add Employee
          </Button>
          }
        </Box>
      </Box>
      <Grid container spacing={6} alignItems='center' mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Employee Name'
            variant='outlined'
            value={searchName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Designation</InputLabel>
            <Select
              label='Select Designation'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              fullWidth
              value={selectedDesignation}
              onChange={handleDesignationChange}
            >
              <MenuItem value="">Discard</MenuItem>
              <MenuItem value='1'>Admin</MenuItem>
              <MenuItem value='2'>Manager</MenuItem>
              <MenuItem value='3'>Employee</MenuItem>
              <MenuItem value='4'>Channel Partner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        {error ? (
          <Typography>Error: {error}</Typography>
        ) : (
          employees.map(employee => (
            <Grid item xs={12} sm={6} md={3} key={employee._id}>
              <EmployeeCard employee={employee} id={employee._id} handleEditEmployeeClick={handleEditEmployeeClick} capitalizeWords={capitalizeWords} />
            </Grid>
          ))
        )}
      </Grid>
      {loading ? <Loader /> : <div></div>}
    </Box>
  );
}
