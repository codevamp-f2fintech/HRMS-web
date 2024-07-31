"use client"
import { useEffect, useState } from "react";

import Link from "next/link";

import { Card, CardContent, Avatar, Typography, Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';




const Profile = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${user.id}`)
        const data = await response.json()

        setUserData(data)
        console.log("res>>", data);
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (user.id) {
      fetchUserData()
    }
  }, [])

  if (!userData) return null

  console.log("userdata profile", userData);

  const StyledCard = styled(Card)(({ theme }) => ({
    width: '40vw',
    height: '60vh',
    padding: theme.spacing(2),
    textAlign: 'center',
    borderRadius: '15px',
    position: 'relative',
    overflow: 'visible',
  }));

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${theme.palette.background.paper}`,
    position: 'absolute',
    top: -50,
    left: '50%',
    transform: 'translateX(-50%)',
  }));

  return (
    <>
      <Box
        maxWidth="false"
        sx={{
          backgroundColor: " #8C57FF",
          height: "80vh",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'

        }}
      >
        <StyledCard>
          <StyledAvatar src={userData.image} />
          <CardContent>
            <Typography variant="h3" component="div" sx={{ marginTop: 22, fontSize: 25, fontWeight: 600 }}>
              {userData.first_name} {userData.last_name}
            </Typography>
            <Typography variant="h6">
              Bareilly, UP india
            </Typography>
            <Typography variant="h5" color="textSecondary" sx={{ marginTop: 3 }}>
              {userData.designation}
            </Typography>
            <Grid container spacing={10} justifyContent="center" sx={{ marginTop: 0 }}>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>40</Typography>
                <Typography variant="h6" color="textSecondary">Friends</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>15</Typography>
                <Typography variant="h6" color="textSecondary">Photos</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>12</Typography>
                <Typography variant="h6" color="textSecondary">Comments</Typography>
              </Grid>
            </Grid>
            <Link href={'/account-settings'}>
              <Button variant="contained" color="primary" sx={{ marginTop: 7 }}>Edit</Button>
            </Link>
          </CardContent>
        </StyledCard>
      </Box>
    </>
  )
}

export default Profile

