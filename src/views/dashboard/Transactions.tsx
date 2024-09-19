'use client'
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

// Icon Imports
import EditIcon from '@mui/icons-material/Edit'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  border: `3px solid ${theme.palette.primary.main}`,
}))

const Welcome = () => {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${user.id}`)
        const data = await response.json()

        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (user.id) {
      fetchUserData()
    }
  }, [])

  if (!userData) return null

  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Welcome Back, {userData.first_name}!👋
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          {/* <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <StyledAvatar src={userData.image} alt={`${userData.first_name} ${userData.last_name}`} />
              <Typography variant="h6" fontWeight="bold">
                {userData.first_name} {userData.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userData.designation}
              </Typography>
            </Box>
          </Grid> */}
          <Grid item xs={12} sm={8}>
            <Typography variant="body1" gutterBottom>
              We're excited to have you back! Explore your dashboard, track progress, and manage your tasks efficiently.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Let's make today productive!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  )
}

export default Welcome
