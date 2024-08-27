import React, { useEffect, useState } from 'react';

import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { apiResponse } from '@/utility/apiResponse/employeesResponse';

interface Employee {
  _id: string;
}

const BlinkingStatus = ({ count, status }: { count: number; status: string }) => {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    switch (status) {
      case 'Present':
        return { backgroundColor: 'green', textColor: 'white' };
      case 'Absent':
        return { backgroundColor: 'red', textColor: 'white' };
      case 'On Leave':
        return { backgroundColor: 'yellow', textColor: 'black' };
      case 'On Half':
        return { backgroundColor: 'orange', textColor: 'white' };
      default:
        return { backgroundColor: 'gray', textColor: 'white' };
    }
  };

  const { backgroundColor, textColor } = getColor();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor,
        padding: '10px',
        borderRadius: '8px',
        opacity: blink ? 1 : 0.5,
        transition: 'opacity 0.5s ease-in-out',
        minWidth: '100px',
      }}
    >
      <Typography variant="h5" sx={{ color: textColor }}>
        {status}: {count}
      </Typography>
    </Box>
  );
};

const EmployeeAttendanceStatus = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);

  const [attendanceCounts, setAttendanceCounts] = useState({
    Present: 0,
    Absent: 0,
    OnLeave: 0,
    OnHalf: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const todayDate = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees: Employee[] = await apiResponse();

        setTotalEmployees(employees.length);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const attendances = useSelector((state: RootState) => state.attendances.attendances);

  useEffect(() => {
    if (attendances.length > 0) {
      const counts = {
        Present: 0,
        Absent: 0,
        OnLeave: 0,
        OnHalf: 0,
      };

      attendances.forEach((attendance) => {
        if (attendance.date === todayDate) {
          if (attendance.status === 'Present') counts.Present += 1;
          else if (attendance.status === 'Absent') counts.Absent += 1;
          else if (attendance.status === 'On Leave') counts.OnLeave += 1;
          else if (attendance.status === 'On Half') counts.OnHalf += 1;
        }
      });

      setAttendanceCounts(counts);
    }
  }, [attendances, todayDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <Typography color="error">{error || 'An unexpected error occurred.'}</Typography>
      </Box>
    );
  }

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Total Employees: {totalEmployees}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <BlinkingStatus count={attendanceCounts.Present} status="Present" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BlinkingStatus count={attendanceCounts.Absent} status="Absent" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BlinkingStatus count={attendanceCounts.OnLeave} status="On Leave" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BlinkingStatus count={attendanceCounts.OnHalf} status="On Half" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeAttendanceStatus;
