import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import { fetchHolidays } from '@/redux/features/holidays/holidaysSlice';

import { Card, CardHeader, CardContent, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  // maxHeight: 440,
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
    <StyledCard>
      <CardHeader
        title={<Typography variant="h6">Holidays</Typography>}
      />
      <CardContent>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="holidays table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Days</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: '340px' }}>
              {holidays.map((row, index) => (
                <TableRow key={index} hover>
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
          sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
        />
      </CardContent>
    </StyledCard>
  );
};

export default HolidaysTable;
