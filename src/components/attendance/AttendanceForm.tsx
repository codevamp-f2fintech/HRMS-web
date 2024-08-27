// AddAttendanceForm.tsx

import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, TextField, IconButton, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { fetchAttendances, resetAttendances } from '@/redux/features/attendances/attendancesSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';

interface AddAttendanceFormProps {
  handleClose: () => void;
  attendance: string | null;
}

export default function AddAttendanceForm({ handleClose, attendance }: AddAttendanceFormProps) {
  const dispatch: AppDispatch = useDispatch();
  const { attendances } = useSelector((state: RootState) => state.attendances);

  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    status: '',
  });

  const [errors, setErrors] = useState({
    employee: '',
    date: '',
    status: ''
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await apiResponse();

      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (attendance) {
      const selected = attendances.find(attend => attend._id === attendance);

      if (selected) {
        setFormData({
          employee: selected.employee._id,
          date: selected.date,
          status: selected.status,
        });
      }
    }
  }, [attendance, attendances]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { employee: '', date: '', status: '' };

    if (!formData.employee) {
      newErrors.employee = 'Employee selection is required';
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = 'Status selection is required';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name as string]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const method = attendance ? 'PUT' : 'POST';

      const url = attendance
        ? `${process.env.NEXT_PUBLIC_APP_URL}/attendence/update/${attendance}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/attendence/create`;

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            if (data.message.includes('success')) {
              toast.success(data.message, { position: 'top-center' });
            } else {
              toast.error('Error: ' + data.message, { position: 'top-center' });
            }
          } else {
            toast.error('Unexpected error occurred', { position: 'top-center' });
          }

          handleClose();
          dispatch(resetAttendances());
          dispatch(fetchAttendances());
        })
        .catch(error => {
          console.log('Error', error);
        });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <ToastContainer />
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
          {attendance ? 'Edit Attendance' : 'Add Attendance'}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Date'
            name='date'
            type='date'
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.date}
            helperText={errors.date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.employee}>
            <InputLabel required id='demo-simple-select-label'>Employee</InputLabel>
            <Select
              label='Select Employee'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.first_name} {employee.last_name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="error">{errors.employee}</Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.status}>
            <InputLabel required id='demo-simple-select-label'>Status</InputLabel>
            <Select
              label='Select Status'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name='status'
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value='Present'>PRESENT</MenuItem>
              <MenuItem value='Absent'>ABSENT</MenuItem>
              <MenuItem value='On Half'>ON_HALF</MenuItem>
              <MenuItem value='On Leave'>ON_LEAVE</MenuItem>
            </Select>
            <Typography variant="caption" color="error">{errors.status}</Typography>
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
              width: 250
            }}
            variant='contained'
            fullWidth
            onClick={handleSubmit}
          >
            {attendance ? 'UPDATE ATTENDANCE' : 'ADD ATTENDANCE'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
