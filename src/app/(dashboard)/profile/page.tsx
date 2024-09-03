'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, Avatar, Typography, Box, Grid, Chip } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProfileForm from '@/components/profileForm/ProfileForm';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '90%',
  maxWidth: '800px',
  padding: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'visible',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
  position: 'absolute',
  top: -75,
  left: '50%',
  transform: 'translateX(-50%)',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

const Profile = () => {

  const [userData, setUserData] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {


    const fetchUserData = async (profile) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${profile}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData(id);
    } else {
      fetchUserData(user.id);
    }
  }, [id]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8C57FF 0%, #5B3AFF 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <StyledCard>
        <StyledAvatar src={userData?.image} alt={`${userData?.first_name} ${userData?.last_name}`} />
        <CardContent sx={{ mt: 10 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            {userData?.first_name} {userData?.last_name} {userData?.verified && <CheckCircleIcon color="success" />}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 1, width: "200px", padding: "5px", background: "#e4e4e4", borderRadius: "20px" }}>
            Code: {userData?.code}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 1 }}>
            {userData?.location}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {userData?.designation}
          </Typography>

          <Box sx={{ display: 'flex', mb: 3 }}>
            <InfoChip icon={<EmailIcon />} label={userData?.email} />
            <InfoChip icon={<PhoneIcon />} label={userData?.contact} />
            {/* <InfoChip icon={<LocationOnIcon />} label="Bareilly, UP, India" /> */}
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {userData?.bio || "No bio available"}
          </Typography>

          <ProfileForm profileId={id ? id : user.id} logedUser={user} />

        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Profile;
