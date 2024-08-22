'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, Avatar, Typography, Button, Box, Grid, Chip, IconButton, Tabs, Tab, LinearProgress, TextField } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const [tabValue, setTabValue] = useState(0);
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', ifscCode: '', panCardNumber: '', panCardImage: null });
  const [addressDetails, setAddressDetails] = useState({ address: '', aadhaarCardNumber: '', aadhaarFrontImage: null, aadhaarBackImage: null });
  const [academics, setAcademics] = useState({ tenthDetails: '', twelfthDetails: '', graduationDetails: '' });
  const [pastExperience, setPastExperience] = useState([{ companyName: '', fromYear: '', toYear: '', duration: '' }]);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileChange = (e, section, field) => {
    const file = e.target.files[0];
    if (section === 'bankDetails') {
      setBankDetails({ ...bankDetails, [field]: file });
    } else if (section === 'addressDetails') {
      setAddressDetails({ ...addressDetails, [field]: file });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('bankDetails', JSON.stringify(bankDetails));
    formData.append('addressDetails', JSON.stringify(addressDetails));
    formData.append('academics', JSON.stringify(academics));
    formData.append('pastExperience', JSON.stringify(pastExperience));
    formData.append('panCardImage', bankDetails.panCardImage);
    formData.append('aadhaarFrontImage', addressDetails.aadhaarFrontImage);
    formData.append('aadhaarBackImage', addressDetails.aadhaarBackImage);

    console.log("formData", formData);

    // const response = await fetch('/employee-verification', {
    //   method: 'POST',
    //   body: formData,
    // });

    // if (response.ok) {
    //   // Handle success
    // }
  };

  if (!userData) return null;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8C57FF 0%, #5B3AFF 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <StyledCard>
        <StyledAvatar src={userData.image} alt={`${userData.first_name} ${userData.last_name}`} />
        <CardContent sx={{ mt: 10 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            {userData.first_name} {userData.last_name} {userData.verified && <CheckCircleIcon color="success" />}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 1, width: "200px", padding: "5px", background: "#e4e4e4", borderRadius: "20px" }}>
            Code: {userData.code}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 1 }}>
            {userData.location}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {userData.designation}
          </Typography>

          <Box sx={{ display: 'flex', mb: 3 }}>
            <InfoChip icon={<EmailIcon />} label={userData.email} />
            <InfoChip icon={<PhoneIcon />} label={userData.contact} />
            {/* <InfoChip icon={<LocationOnIcon />} label="Bareilly, UP, India" /> */}
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {userData.bio || "No bio available"}
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>40</Typography>
              <Typography variant="body2" color="text.secondary">Projects</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>15</Typography>
              <Typography variant="body2" color="text.secondary">Skills</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>12</Typography>
              <Typography variant="body2" color="text.secondary">Awards</Typography>
            </Grid>
          </Grid>

          {/* <LinearProgress variant="determinate" value={userData.profileCompletion} sx={{ mb: 2 }} /> */}
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Verification" />
            <Tab label="Bank Details" />
            <Tab label="Address" />
            <Tab label="Academics" />
            <Tab label="Experience" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            {/* Verification Tab Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {/* Bank Details Form */}
            <TextField
              label="Bank Name"
              fullWidth
              margin="normal"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            />
            <TextField
              label="Account Number"
              fullWidth
              margin="normal"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            />
            <TextField
              label="IFSC Code"
              fullWidth
              margin="normal"
              value={bankDetails.ifscCode}
              onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
            />
            <TextField
              label="PAN Card Number"
              fullWidth
              margin="normal"
              value={bankDetails.panCardNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, panCardNumber: e.target.value })}
            />
            <input type="file" onChange={(e) => handleFileChange(e, 'bankDetails', 'panCardImage')} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {/* Address Form */}
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={addressDetails.address}
              onChange={(e) => setAddressDetails({ ...addressDetails, address: e.target.value })}
            />
            <TextField
              label="Aadhaar Card Number"
              fullWidth
              margin="normal"
              value={addressDetails.aadhaarCardNumber}
              onChange={(e) => setAddressDetails({ ...addressDetails, aadhaarCardNumber: e.target.value })}
            />
            <input type="file" onChange={(e) => handleFileChange(e, 'addressDetails', 'aadhaarFrontImage')} />
            <input type="file" onChange={(e) => handleFileChange(e, 'addressDetails', 'aadhaarBackImage')} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {/* Academics Form */}
            <TextField
              label="10th Details"
              fullWidth
              margin="normal"
              value={academics.tenthDetails}
              onChange={(e) => setAcademics({ ...academics, tenthDetails: e.target.value })}
            />
            <TextField
              label="12th Details"
              fullWidth
              margin="normal"
              value={academics.twelfthDetails}
              onChange={(e) => setAcademics({ ...academics, twelfthDetails: e.target.value })}
            />
            <TextField
              label="Graduation Details"
              fullWidth
              margin="normal"
              value={academics.graduationDetails}
              onChange={(e) => setAcademics({ ...academics, graduationDetails: e.target.value })}
            />
            <input type="file" onChange={(e) => handleFileChange(e, 'academics', 'graduationDetails')} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {/* Past Experience Form */}
            <TextField
              label="Company Name"
              fullWidth
              margin="normal"
              value={pastExperience[0].companyName}
              onChange={(e) => setPastExperience([{ ...pastExperience[0], companyName: e.target.value }])}
            />
            <TextField
              label="From Year"
              fullWidth
              margin="normal"
              value={pastExperience[0].fromYear}
              onChange={(e) => setPastExperience([{ ...pastExperience[0], fromYear: e.target.value }])}
            />
            <TextField
              label="To Year"
              fullWidth
              margin="normal"
              value={pastExperience[0].toYear}
              onChange={(e) => setPastExperience([{ ...pastExperience[0], toYear: e.target.value }])}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </TabPanel>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default Profile;
