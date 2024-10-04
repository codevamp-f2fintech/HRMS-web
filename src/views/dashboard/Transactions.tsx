'use client';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
  Modal,
  TextField,
  Button,
  Divider,
  Tooltip,
  TextareaAutosize,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const Welcome = () => {
  const [userData, setUserData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [latestQuote, setLatestQuote] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setUserRole(user.role);

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${user.id}`);
        const data = await response.json();

        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchLatestQuote = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/quotes`);
        const result = await response.json();


        console.log('API response for quotes:', result);


        const { data } = result;


        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];

          setLatestQuote(latest);
          setQuote(latest.quote);
          setAuthor(latest.author);
          setIsEditMode(true);
          console.log('Fetched latest quote:', latest);
        } else {
          setLatestQuote(null);
          setQuote('');
          setAuthor('');
          setIsEditMode(false);
          console.log('No quotes available in the response');
        }
      } catch (error) {
        console.error('Error fetching latest quote:', error);
      } finally {
        setLoading(false);
      }
    };


    if (user.id) {
      fetchUserData();
      fetchLatestQuote();
    }
  }, []);

  useEffect(() => {
    console.log('latestQuote state updated:', latestQuote);
  }, [latestQuote]);


  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/quotes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, author }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setQuote('');
        setAuthor('');
        setOpen(false);
        setLatestQuote(result.data);
      } else {
        toast.error(result.message || 'Error saving the quote.');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('An unexpected error occurred');
    }
  };


  const handleEdit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/quotes/update/${latestQuote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, author }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setOpen(false);
        setLatestQuote(result.data);
        setIsEditMode(false);
      } else {
        toast.error(result.message || 'Error updating the quote.');
      }
    } catch (error) {
      console.error('Error editing quote:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <ToastContainer />
      <StyledCard sx={{ height: '40vh' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="#2c3ce3">
              {userData ? `Welcome Back, ${userData.first_name}! 👋` : 'Welcome! 👋'}
            </Typography>
            {userRole === '1' && <Tooltip title="Add daily quotes">
              <IconButton onClick={handleOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            }
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={10}>
              <Typography variant="body1" gutterBottom>
                {latestQuote ? latestQuote.quote : 'No quote available'}
              </Typography>

              <Box sx={{ position: 'relative', minHeight: '50px' }}>
                <Typography
                  variant="body2"
                  sx={{

                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    fontWeight: 'bold',
                    fontSize: '1.3em',


                  }}
                >
                  {latestQuote ? latestQuote.author : 'No author'}
                </Typography>
              </Box>
            </Grid>

          </Grid>
        </CardContent>
      </StyledCard>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ width: 400, margin: 'auto', mt: '15%', padding: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">{isEditMode ? 'Edit Quote' : 'Submit a Quote'}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter your quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderColor: '#ccc',
              borderRadius: '4px',
              marginTop: '16px',
              marginBottom: '16px',
            }}
          />
          <TextField
            fullWidth
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={isEditMode ? handleEdit : handleSubmit} fullWidth>
            {isEditMode ? 'Edit Quote' : 'Submit'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Welcome;
