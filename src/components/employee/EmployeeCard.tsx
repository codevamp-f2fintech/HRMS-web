import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card, CardContent, Box, IconButton, Menu, MenuItem,
    Avatar, Typography, Chip, styled
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import Loader from '../loader/loader';

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
}));

const EmployeeCard = ({ employee, id, handleEditEmployeeClick, capitalizeWords }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMenuOpen = (event) => {
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
        }, 500);
    };

    return (
        <StyledCard onClick={handleCardClick}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Loader />
                </Box>
            ) : (
                <CardContent>
                    <Box display='flex' justifyContent='flex-end'>
                        <IconButton aria-label='settings' onClick={(e) => { e.stopPropagation(); handleMenuOpen(e); }}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {userRole === "1" && (
                                <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleEditEmployeeClick(id); }}>
                                    <EditIcon fontSize='small' style={{ marginRight: 8 }} />
                                    Edit
                                </MenuItem>
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
                            size='small'
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                            <EmailIcon fontSize='small' sx={{ mr: 1 }} />
                            {employee.email}
                        </Typography>
                    </Box>
                </CardContent>
            )}
        </StyledCard>
    );
};

export default EmployeeCard;
