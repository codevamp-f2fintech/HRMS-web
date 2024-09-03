import React from 'react';

import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ContrastIcon from '@mui/icons-material/Contrast';
import type { GridColDef } from '@mui/x-data-grid';

export const AttendanceSummaryColumns: GridColDef[] = [
  {
    field: 'status',
    headerName: 'Status Count',
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gridTemplateRows="1fr 1fr"
        gap={1}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {/* Present */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <CircleIcon sx={{ color: 'green', fontSize: 30 }} />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {params.row.present}
          </Typography>
        </Box>
        {/* Absent */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <CircleIcon sx={{ color: 'red', fontSize: 30 }} />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {params.row.absent}
          </Typography>
        </Box>
        {/* On Half */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <ContrastIcon
            style={{
              color: '#6fbf73',
              fontSize: 30,
              marginTop: '20%',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              color: '#191919',
              fontWeight: 'bold',
              fontSize: 16,
              mt: 2,
            }}
          >
            {params.row.onHalf}
          </Typography>
        </Box>

        {/* On Leave */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <CircleIcon sx={{ color: 'orange', fontSize: 30 }} />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {params.row.onLeave}
          </Typography>
        </Box>
      </Box>
    ),
  },
];
