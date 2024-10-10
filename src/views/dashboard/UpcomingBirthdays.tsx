import React, { useEffect, useState } from "react";
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// MUI Icons
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';

const UpcomingBirthdays = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState()
  const { upcomingBirthdays } = useSelector((state: RootState) => state.upcomingBirthdays);

  useEffect(() => {
    if (upcomingBirthdays.length === 0) {
      dispatch(fetchUpcomingBirthdays(30));
    }
  }, [dispatch, upcomingBirthdays]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    setUserId(user.id)
  }, [])

  const today = dayjs().format('MM-DD'); // Format current date without the year

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
            Upcoming Birthdays
          </Typography>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {upcomingBirthdays.map((row, index) => {
            const birthday = dayjs(row._doc.dob).format('MM-DD'); // Format employee's birthday without the year
            const isToday = birthday === today; // Check if today is the employee's birthday

            return (
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
                          {dayjs(row._doc.dob).format('D MMM')} {/* Display the formatted date */}
                        </Typography>
                        {isToday && (
                          <Typography variant="body2" color="success.main" sx={{ ml: '8vw' }}>
                            {userId === row._id
                              ? "Happy Birthday to you 🎉"
                              : "Wish happy birthday! 🎉"}
                          </Typography>
                        )}

                      </React.Fragment>
                    }
                  />
                  <CakeIcon color="primary" fontSize="small" sx={{ ml: 1, alignSelf: 'center' }} />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays;
