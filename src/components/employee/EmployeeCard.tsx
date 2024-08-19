import React, { useState } from 'react';
import { Card, CardContent, Box, IconButton, Menu, MenuItem, Button, Avatar, Typography, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';

const EmployeeCard = ({ employee, id, handleEditEmployeeClick, capitalizeWords }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ height: '100%', borderRadius: '30px' }}>
            <CardContent>
                <Box display='flex' justifyContent='flex-end'>
                    <IconButton aria-label='settings' onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                            }}
                        >
                            <Button onClick={() => handleEditEmployeeClick(id)}>
                                <EditIcon fontSize='small' style={{ marginRight: 8 }} />
                                Edit
                            </Button>
                        </MenuItem>
                    </Menu>
                </Box>
                <Avatar
                    alt={employee.first_name}
                    src={employee?.image}
                    sx={{ width: 80, height: 80, margin: '0 auto' }}
                />
                <Typography
                    style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}
                    variant='h6'
                    component='div'
                    margin={2}
                >
                    {capitalizeWords(employee.first_name)} {capitalizeWords(employee.last_name)}
                </Typography>
                <Typography
                    style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'center' }}
                    variant='body2'
                    color='text.secondary'
                    margin={2}
                >
                    {employee.designation}
                </Typography>

                <Typography
                    style={{ fontWeight: 'bold', textAlign: 'center' }}
                    variant='body2'
                    color='text.secondary'
                    margin={2}
                >
                    <Chip
                        className='capitalize'
                        variant='tonal'
                        color={
                            employee.status === 'pending'
                                ? 'warning'
                                : employee.status === 'inactive'
                                    ? 'secondary'
                                    : 'success'
                        }
                        label={employee.status}
                        size='small'
                    />
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EmployeeCard;
