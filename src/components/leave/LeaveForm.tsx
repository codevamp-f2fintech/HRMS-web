import React, { useEffect, useState } from 'react';

import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { fetchLeaves } from '../../redux/features/leaves/leavesSlice';

const AddLeavesForm = ({ handleClose, leave, leaves, userRole, userId, employees, page, limit, selectedKeyword }) => {
  const [formData, setFormData] = useState({
    employee: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
    application: '',
    type: '',
    day: ''
  });

  const [errors, setErrors] = useState({
    employee: '',
    start_date: '',
    end_date: '',
    status: '',
    application: '',
    type: '',
    day: ''
  });

  const [isHalfDay, setIsHalfDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (leave) {
      const selected = leaves.find(l => l._id === leave);

      if (selected) {
        setFormData({
          employee: selected.employee._id,
          start_date: selected.start_date,
          end_date: selected.end_date,
          status: selected.status,
          application: selected.application,
          type: selected.type,
          day: selected ? selected.day : calculateDaysDifference(selected.start_date, selected.end_date)
        });

        if (selected.day === "0.5") {
          setIsHalfDay(true);
        }
      }
    } else if (userRole !== '1') {
      setFormData(prevState => ({
        ...prevState,
        employee: userId
      }));
    }
  }, [leave, leaves, userRole, userId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach((key) => {
      if (!formData[key] || formData[key].trim() === '') {
        newErrors[key] = `${key.replace('_', ' ').toUpperCase()} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => {
      const updatedFormData = { ...prevState, [name]: value };

      if (name === 'start_date' || name === 'end_date') {
        const days = calculateDaysDifference(updatedFormData.start_date, updatedFormData.end_date);

        updatedFormData.day = isHalfDay ? (days / 2).toString() : days.toString();
      }

      return updatedFormData;
    });
  };

  const calculateDaysDifference = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      return differenceInDays > 0 ? differenceInDays : 0;
    }


    return 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);  // Start loading spinner
      const method = leave ? 'PUT' : 'POST';
      const url = leave ? `${process.env.NEXT_PUBLIC_APP_URL}/leaves/update/${leave}` : `${process.env.NEXT_PUBLIC_APP_URL}/leaves/create`;

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            toast[data.message.includes('success') ? 'success' : 'error'](data.message, {
              position: 'top-center',
            });
          } else {
            toast.error('Unexpected error occurred', {
              position: 'top-center',
            });
          }

          handleClose();
          dispatch(fetchLeaves({ page, limit, keyword: selectedKeyword }));
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoading(false);  // Stop loading spinner after API call
        });
    }
  };


  const filteredEmployees = userRole !== '1' ? employees.filter(emp => emp._id === userId) : employees;

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
          {leave ? 'Edit Leave' : 'Add Leave'}
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                name="halfDay"
                color="primary"
              />
            }
            label="Half-day Leave"
          />
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {Number(userRole) < 3 && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id='demo-simple-select-label'>Employee</InputLabel>
              <Select
                label='Select Employee'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
                error={!!errors.employee}
                disabled={userRole !== '1'}
              >
                {filteredEmployees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.first_name} {employee.last_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.employee && <FormHelperText error>{errors.employee}</FormHelperText>}
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Start Date'
            name='start_date'
            value={formData.start_date}
            type='date'
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.start_date}
            helperText={errors.start_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='End Date'
            name='end_date'
            type='date'
            value={formData.end_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.end_date}
            helperText={errors.end_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Day'
            name='day'
            value={formData.day}
            type='text'
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.day}
            helperText={errors.day}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.type}>
            <InputLabel required id='demo-simple-select-label'>Type</InputLabel>
            <Select
              label='Select Type'
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name='type'
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value='Annual'>ANNUAL</MenuItem>
              <MenuItem value='Sick'>SICK</MenuItem>
              <MenuItem value='Unpaid'>UNPAID</MenuItem>
              <MenuItem value='Casual'>CASUAL</MenuItem>
              <MenuItem value='Complimentary'>COMPLIMENTARY</MenuItem>
              <MenuItem value='Maternity'>MATERNITY</MenuItem>
              <MenuItem value='Optional'>OPTIONAL</MenuItem>
            </Select>
            {errors.type && <Typography color="error">{errors.type}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label='Reason'
            name='application'
            value={formData.application}
            onChange={handleChange}
            required
            error={!!errors.application}
            helperText={errors.application}
          />
        </Grid>
        {Number(userRole) < 3 && (
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
                disabled={userRole !== '1'}
              >
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Approved'>Approved</MenuItem>
                <MenuItem value='Rejected'>Rejected</MenuItem>
              </Select>
              {errors.status && <Typography color="error">{errors.status}</Typography>}
            </FormControl>
          </Grid>
        )}
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
            disabled={loading}  // Disable button when loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (leave ? 'UPDATE LEAVE' : 'ADD LEAVE')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddLeavesForm;
