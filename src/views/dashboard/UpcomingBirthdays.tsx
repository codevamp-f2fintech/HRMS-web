import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUpcomingBirthdays } from '@/redux/features/employees/employeesSlice';
import dayjs from 'dayjs';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// MUI Icons
// import RefreshIcon from '@mui/icons-material/Refresh';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';

const UpcomingBirthdays = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { upcomingBirthdays } = useSelector((state: RootState) => state.upcomingBirthdays);

  useEffect(() => {
    if (upcomingBirthdays.length === 0) {
      dispatch(fetchUpcomingBirthdays(30));
    }
  }, [dispatch, upcomingBirthdays]);

  const handleRefresh = () => {
    dispatch(fetchUpcomingBirthdays(30));
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
            Upcoming Birthdays
          </Typography>
        }
      // action={
      //   <IconButton onClick={handleRefresh} aria-label="refresh">
      //     <RefreshIcon />
      //   </IconButton>
      // }
      />
      <CardContent sx={{ p: 0 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {upcomingBirthdays.map((row, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar src={row._doc.image} alt={`${row._doc.first_name} ${row._doc.last_name}`}>
                    {!row._doc.image && <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${row._doc.first_name} ${row._doc.last_name}`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {dayjs(row._doc.dob).format('D MMM')}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <CakeIcon color="primary" fontSize="small" sx={{ ml: 1, alignSelf: 'center' }} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays;
