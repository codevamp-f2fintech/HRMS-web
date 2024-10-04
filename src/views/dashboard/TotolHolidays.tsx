import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from 'react-redux';

import { Card, CardHeader, CardContent, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';

import { styled } from '@mui/material/styles';

import type { AppDispatch, RootState } from "@/redux/store";
import { fetchHolidays } from '@/redux/features/holidays/holidaysSlice';


const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  height: 468,
  '&::-webkit-scrollbar': {
    width: '0.4em',
    height: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
    borderRadius: 4,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const HolidaysTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { holidays, totalPages } = useSelector((state: RootState) => state.holidays);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchHolidays({ page, limit, keyword: "" }));
  }, [dispatch, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getChipColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'success';
    }
  };

  return (
    <StyledCard sx={{ height: '116vh' }}>
      <CardHeader
        sx={{ paddingTop: '5vh', textAlign: 'center' }}
        title={<Typography variant="h3" sx={{ fontWeight: 600 }}>Holidays</Typography>}
      />
      <CardContent sx={{ marginTop: '3vh' }}>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="holidays table">
            <TableHead>
              <TableRow sx={{ height: '12vh' }}>
                <StyledTableCell>Days</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: '340px' }}>
              {holidays.map((row, index) => (
                <TableRow key={index} hover sx={{ height: '12.2vh' }}>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.start_date}</TableCell>
                  <TableCell>{row.end_date}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.title}
                      color={getChipColor(row.title)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            marginTop: 12, display: 'flex', justifyContent: 'center', position: 'relative',

            '.MuiPaginationItem-root': {
              fontSize: '1.5rem',
            },
            'li:first-of-type': {
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            },
            'li:last-of-type': {
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            },
          }}
        />
      </CardContent>
    </StyledCard>
  );
};

export default HolidaysTable;
