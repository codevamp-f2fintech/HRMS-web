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
  createTheme,
  Avatar,
  Tooltip,
  Divider,
  DialogContent,
  ListItem,
  Dialog,
  List
} from '@mui/material';
import {
  Person as PersonIcon,
  EventBusy as AbsentIcon,
  EventAvailable as PresentIcon,
  BeachAccess as LeaveIcon,
  AccessTime as HalfDayIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

import { apiResponse } from '@/utility/apiResponse/employeesResponse';

interface Employee {
  _id: string;
  location: string;
}

interface AttendanceCounts {
  Present: number;
  Absent: number;
  OnLeave: number;
  OnHalf: number;
}

interface LocationAttendanceCounts {
  [location: string]: AttendanceCounts;
}

interface RootState {
  attendances: {
    attendances: Array<{
      date: string;
      status: string;
      employee: {
        _id: string;
        location: string;
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
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
  },
});

const StatusCard: React.FC<{ count: number; status: string; employees: string[]; onClick: () => void }> = ({ count, status, employees, onClick }) => {
  const theme = useTheme();

  const getStatusInfo = () => {
    switch (status) {
      case 'Present':
        return { icon: <PresentIcon />, color: theme.palette.success.main, backgroundColor: theme.palette.success.light };
      case 'Absent':
        return { icon: <AbsentIcon />, color: theme.palette.error.main, backgroundColor: theme.palette.error.light };
      case 'On Leave':
        return { icon: <LeaveIcon />, color: theme.palette.warning.main, backgroundColor: theme.palette.warning.light };
      case 'On Half':
        return { icon: <HalfDayIcon />, color: theme.palette.info.main, backgroundColor: theme.palette.info.light };
      default:
        return { icon: <PersonIcon />, color: theme.palette.grey[500], backgroundColor: theme.palette.grey[200] };
    }
  };

  const { icon, color, backgroundColor } = getStatusInfo();

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.15)',
        },
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Avatar sx={{ bgcolor: color, width: 56, height: 56, mb: 2 }}>
        {icon}
      </Avatar>
      <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 1 }}>
        {count}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
        {status}
      </Typography>
    </Paper>
  );
};


const EmployeeAttendanceStatus: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [attendanceCountsByLocation, setAttendanceCountsByLocation] = useState<LocationAttendanceCounts>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('');

  const todayDate = dayjs().format('YYYY-MM-DD');
  const attendances = useSelector((state: RootState) => state.attendances.attendances);


  const handleStatusClick = (status: string, employees: string[]) => {
    setSelectedEmployees(employees);
    setDialogTitle(status);
    setDialogOpen(true);
  };

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
      const countsByLocation: LocationAttendanceCounts = {};
      const uniqueAttendance = new Set<string>();

      attendances.forEach(attendance => {
        if (attendance.date === todayDate) {
          const uniqueKey = `${attendance.date}-${attendance.employee?._id}`;

          if (!uniqueAttendance.has(uniqueKey)) {
            uniqueAttendance.add(uniqueKey);

            const location = attendance.employee?.location || 'Unknown';

            if (location !== 'Unknown') {
              if (!countsByLocation[location]) {
                countsByLocation[location] = {
                  Present: { count: 0, employees: [] },
                  Absent: { count: 0, employees: [] },
                  OnLeave: { count: 0, employees: [] },
                  OnHalf: { count: 0, employees: [] },
                };
              }

              const status = attendance.status.replace(' ', '') as keyof AttendanceCounts;

              if (countsByLocation[location][status]) {
                countsByLocation[location][status].count += 1;


                countsByLocation[location][status].employees.push(`${attendance.employee.first_name} ${attendance.employee.last_name}`);
              }
            }
          }
        }
      });

      setAttendanceCountsByLocation(countsByLocation);
    }
  }, [attendances, todayDate]);


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4" color="primary" gutterBottom>
                Employee Attendance Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Date: {dayjs().format('MMMM D, YYYY')}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Total Employees" placement="left">
                <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: theme.palette.primary.light }}>
                  <PersonIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                  <Typography variant="h5" color="white">
                    {totalEmployees}
                  </Typography>
                </Paper>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={4}>
          {Object.entries(attendanceCountsByLocation).map(([location, counts]) => (
            <Grid item xs={12} md={6} lg={4} key={location}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase' }}>
                    {location}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {Object.entries(counts).map(([status, data]) => (
                    <Grid item xs={6} key={status}>

                      <StatusCard
                        count={data.count}
                        status={status.replace(/([A-Z])/g, ' $1').trim()}
                        employees={data.employees}
                        onClick={() => handleStatusClick(status, data.employees || [])}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Dialog to show employee names */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {dialogTitle}
            </Typography>
            <List>
              {selectedEmployees.map((employee, index) => (
                <ListItem key={index}>{employee}</ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeAttendanceStatus;
