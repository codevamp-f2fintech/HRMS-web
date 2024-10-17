import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';

import { useRouter } from 'next/navigation';
import {
  Card, CardContent, Box, IconButton, Menu, MenuItem,
  Avatar, Typography, Chip, styled, Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import Loader from '../loader/loader';
import { deleteEmployee } from '@/redux/features/employees/employeesSlice';
import 'react-toastify/dist/ReactToastify.css';


const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px 0 rgba(0,0,0,0.16)',
    cursor: 'pointer',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 10px 0 rgba(0,0,0,0.12)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  margin: theme.spacing(2, 0),
}));

const EmailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginTop: theme.spacing(2),
  wordBreak: 'break-all',
}));

const EmailTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const EmployeeCard = ({ employee, id, handleEditEmployeeClick, capitalizeWords }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();


  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (userRole === "") {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      setUserRole(user.role);
    }
  }, [userRole]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'success';
    }
  };

  const handleCardClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/profile?id=${id}`);
      setLoading(false)
    }, 500);
  };

  const handleEmailClick = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:${employee.email}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer',
        },
      });

      if (response.ok) {
        dispatch(deleteEmployee(id));
        toast.success('Employee deleted successfully.');
      } else {
        const errorResult = await response.json();
        toast.error(`Failed to delete employee: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting employee. Please try again.');
    }
  };


  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <StyledCard onClick={handleCardClick}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Loader />
          </Box>
        ) : (
          <CardContent>
            <Box display='flex' justifyContent='flex-end'>
              <IconButton aria-label='settings' onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {userRole === "1" && (
                  <><MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleEditEmployeeClick(id); }}>
                    <EditIcon fontSize='small' style={{ marginRight: 8 }} />
                    Edit
                  </MenuItem>
                    <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleDelete(id); }}>
                      <DeleteIcon fontSize='small' style={{ marginRight: 8 }} />
                      Delete
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleCardClick(); }}>
                  <PermIdentityIcon fontSize='small' style={{ marginRight: 8 }} />
                  Profile
                </MenuItem>
              </Menu>
            </Box>
            <StyledAvatar alt={employee.first_name} src={employee?.image} />
            <Typography variant='h5' component='div' align='center' sx={{ mt: 2, fontWeight: 'bold' }}>
              {capitalizeWords(employee.first_name)} {capitalizeWords(employee.last_name)}
            </Typography>
            <Typography variant='subtitle1' color='text.secondary' align='center' sx={{ mt: 1 }}>
              {employee.designation}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <StyledChip
                label={employee.status}
                color={getStatusColor(employee.status)}
                size='small' />
            </Box>
            <EmailContainer>
              <Tooltip title="Click to send email" arrow>
                <EmailTypography onClick={handleEmailClick}>
                  <EmailIcon fontSize='small' sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {employee.email}
                </EmailTypography>
              </Tooltip>
            </EmailContainer>
            <Typography variant='subtitle1' color='text.secondary' align='center' sx={{ mt: 2 }}>
              {employee.code}
            </Typography>
          </CardContent>
        )}
      </StyledCard></>
  );
};

export default EmployeeCard;
