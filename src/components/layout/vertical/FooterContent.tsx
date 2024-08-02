'use client'

// Next Imports

// Third-party Imports

// Hook Imports
import { Container, Box, Typography, Link, Stack, Divider } from "@mui/material";

import useVerticalNav from '@menu/hooks/useVerticalNav'




// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <Container
      maxWidth={false}
      sx={{
        background: "linear-gradient(270deg, var(--mui-palette-primary-main), rgb(197, 171, 255) 100%)",
        height: "65vh"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: '0cm 1cm 0cm 1cm'
        }}
      >
        <Box width={350} alignItems="center" sx={{ marginTop: '1cm' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", color: "white", marginBottom: "1rem" }}
          >
            F2-FINTECH
          </Typography>
          <Typography variant="h6" sx={{ color: "white", lineHeight: "3rem" }}>
            Open Financial Technologies Pvt Ltd, Tower 2, 3rd floor, RGA Tech
            Park, Sarjapur Road, Bengaluru Karnataka - 560035
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: '1cm' }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "600", color: "white", marginBottom: "1rem" }}
          >
            Company
          </Typography>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            About us
          </Link>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            Blogs
          </Link>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            Privacy Policy
          </Link>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            Term & Condition
          </Link>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: '1cm' }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "600", color: "white", marginBottom: "1rem" }}
          >
            Let's Talk
          </Typography>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            Have any doubts?
          </Link>
          <Link
            underline="none"
            variant="h6"
            sx={{ color: "white", marginBottom: "1rem" }}
          >
            Contact Us
          </Link>
          <Stack direction="row" spacing={3}>
          </Stack>
        </Box>
      </Box>
      <Typography sx={{ color: 'white', fontSize: '15px', margin: '1cm 1cm 0cm 1cm' }}>
        © 2024 All Rights Reserved by Open
      </Typography>
      <Divider color="white" sx={{ height: "1px", margin: '1cm 1cm 0cm 1cm' }} />
      <Typography sx={{ color: 'white', fontSize: '15px', margin: '1cm 1cm 0cm 1cm' }}>
        Open Capital is a platform that connects businesses with lending options offered by RBI-licensed NBFC partners.
        The loans offered on the platform are subject to the terms and conditions and loan approval process of the NBFC partners
      </Typography>
    </Container>
  )
}

export default FooterContent
