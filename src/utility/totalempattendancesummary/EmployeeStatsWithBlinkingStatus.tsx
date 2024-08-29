import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';

import { apiResponse } from '@/utility/apiResponse/employeesResponse';

interface Employee {
  _id: string;
}

interface AttendanceCounts {
  Present: number;
  Absent: number;
  OnLeave: number;
  OnHalf: number;
}

interface RootState {
  attendances: {
    attendances: Array<{
      date: string;
      status: string;
      employee: {
        _id: string;
      };
    }>;
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const BlinkingStatus: React.FC<{ count: number; status: string }> = ({ count, status }) => {
  const [blink, setBlink] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setBlink(prev => !prev), 1000);


    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    switch (status) {
      case 'Present': return { backgroundColor: theme.palette.success.main, textColor: theme.palette.common.white };
      case 'Absent': return { backgroundColor: theme.palette.error.main, textColor: theme.palette.common.white };
      case 'On Leave': return { backgroundColor: theme.palette.warning.main, textColor: theme.palette.common.black };
      case 'On Half': return { backgroundColor: theme.palette.info.main, textColor: theme.palette.common.white };
      default: return { backgroundColor: theme.palette.grey[500], textColor: theme.palette.common.white };
    }
  };

  const { backgroundColor, textColor } = getColor();

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        padding: '10px',
        borderRadius: '12px',
        opacity: blink ? 1 : 0.7,
        transition: 'opacity 0.5s ease-in-out',
        height: '100%',
      }}
    >
      <Typography variant="h5" sx={{ color: textColor, fontWeight: 'bold', mb: 1 }}>
        {count}
      </Typography>
      <Typography variant="h6" sx={{ color: textColor }}>
        {status}
      </Typography>
    </Paper>
  );
};

const EmployeeAttendanceStatus: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);

  const [attendanceCounts, setAttendanceCounts] = useState<AttendanceCounts>({
    Present: 0,
    Absent: 0,
    OnLeave: 0,
    OnHalf: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const todayDate = dayjs().format('YYYY-MM-DD');
  const attendances = useSelector((state: RootState) => state.attendances.attendances);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees: Employee[] = await apiResponse();

        setTotalEmployees(employees.length);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (attendances.length > 0) {
      const counts: AttendanceCounts = {
        Present: 0,
        Absent: 0,
        OnLeave: 0,
        OnHalf: 0,
      };

      const uniqueAttendance = new Set<string>(); // Set to track unique employee attendance per day

      attendances.forEach(attendance => {
        if (attendance.date === todayDate) {
          const uniqueKey = `${attendance.date}-${attendance.status}-${attendance.employee?._id}`;

          if (!uniqueAttendance.has(uniqueKey)) {
            uniqueAttendance.add(uniqueKey);

            const status = attendance.status.replace(' ', '') as keyof AttendanceCounts;

            if (status in counts) {
              counts[status] += 1;
            }
          }
        }
      });

      setAttendanceCounts(counts);
    }
  }, [attendances, todayDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Total Employees: {totalEmployees}
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          Date: {dayjs().format('MMMM D, YYYY')}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {Object.entries(attendanceCounts).map(([status, count]) => (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <BlinkingStatus count={count} status={status.replace(/([A-Z])/g, ' $1').trim()} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default EmployeeAttendanceStatus;
