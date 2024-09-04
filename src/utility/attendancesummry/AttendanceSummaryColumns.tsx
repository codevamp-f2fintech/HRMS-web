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
        gridTemplateColumns="repeat(3, 1fr)" // 3 columns
        gridTemplateRows="repeat(2, 1fr)"  // 2 rows
        gap={1}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {/* Row 1 - Present, Present Not Completed, Absent */}
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

        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <CircleIcon sx={{ color: 'lightgreen', fontSize: 30 }} />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {params.row.presentNotCompleted ?? 0}
          </Typography>
        </Box>

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

        {/* Row 2 - On Half, On Half Not Completed, On Leave */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <ContrastIcon
            sx={{
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

        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <ContrastIcon
            sx={{
              color: '#d0f0c0',
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
            {params.row.onHalfNotCompleted ?? 0}
          </Typography>
        </Box>

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
