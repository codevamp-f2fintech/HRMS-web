'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, Avatar, Typography, Box, Grid, Chip, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProfileForm from '@/components/profileForm/ProfileForm';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '90%',
  maxWidth: '800px',
  padding: theme.spacing(3),
  borderRadius: '24px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'visible',
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  border: `5px solid ${theme.palette.background.paper}`,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  position: 'absolute',
  top: -80,
  left: '50%',
  transform: 'translateX(-50%)',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 600,
  borderRadius: '16px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [calculateFilledTabsCount, setCalculateFilledTabsCount] = useState(0);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    const fetchUserData = async (profile) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${profile}`);
        const data = await response.json();
        setUserData(data);
        setBio(data.bio || "");  // Set the initial bio value
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData(id);
    } else {
      fetchUserData(user.id);
    }
  }, [id, user.id]);

  // Function to handle bio change
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Function to handle bio update
  const handleBioUpdate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/${user.id}/update-bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: bio }),
      });
      const data = await response.json();
      console.log('Bio updated successfully:', data);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  // Toggle edit mode for bio
  const toggleEditBio = () => {
    if (isEditingBio) {
      handleBioUpdate(); // If we're exiting edit mode, trigger update
    }
    setIsEditingBio(!isEditingBio);
  };

  // Save changes on blur
  const handleBlur = () => {
    if (isEditingBio) {
      toggleEditBio();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8C57FF 0%, #5B3AFF 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <StyledCard>
        <StyledAvatar src={userData?.image} alt={`${userData?.first_name} ${userData?.last_name}`} />
        <CardContent sx={{ mt: 11 }}>
          <Box display="flex" justifyContent="space-between" alignItems='center'>
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {userData?.first_name} {userData?.last_name} {userData?.verified && <CheckCircleIcon color="primary" sx={{ verticalAlign: 'middle', ml: 1 }} />}
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1, py: 1, px: 2, background: "rgba(228, 228, 228, 0.5)", borderRadius: "20px", display: 'inline-block' }}>
                Code: {userData?.code}
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1, mt: 1 }}>
                {userData?.location}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                {userData?.designation}
              </Typography>

              <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap' }}>
                <InfoChip icon={<EmailIcon />} label={userData?.email} />
                <InfoChip icon={<PhoneIcon />} label={userData?.contact} />
              </Box>

              {/* Editable Bio Field */}
              {isEditingBio ? (
                <TextField
                  label="Bio"
                  multiline
                  fullWidth
                  variant="outlined"
                  value={bio}
                  onChange={handleBioChange}
                  onBlur={handleBlur}
                  autoFocus
                  sx={{ mb: 3 }}
                />
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, flexGrow: 1 }}>
                    {bio || "No bio available"}
                  </Typography>
                  {user.role === '3' && user.id &&
                    <Button onClick={toggleEditBio} sx={{ ml: 2 }}>
                      Edit
                    </Button>
                  }

                </Box>
              )}
            </Box>

            <Box sx={{ marginBottom: 2, width: '120px' }}>
              <CircularProgressbar
                value={calculateFilledTabsCount}
                text={`${Math.round(calculateFilledTabsCount)}%`}
                styles={{
                  path: { stroke: `rgba(92, 107, 192, ${calculateFilledTabsCount / 100})` },
                  text: { fill: '#5C6BC0', fontSize: '16px', fontWeight: 'bold' },
                }}
              />
            </Box>
          </Box>

          <ProfileForm
            profileId={id ? id : user.id}
            logedUser={user}
            calculateFilledTabsCount={calculateFilledTabsCount}
            setCalculateFilledTabsCount={setCalculateFilledTabsCount}
          />
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Profile;
