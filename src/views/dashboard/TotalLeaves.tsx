'use client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLeaves } from '@/redux/features/leaves/leavesSlice';
import AddLeavesForm from '@/components/leave/LeaveForm';

// MUI Imports
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogContent } from "@mui/material";
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import tableStyles from '@core/styles/table.module.css';

import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// Third-party Imports
import classnames from 'classnames';

// Components Imports
import OptionMenu from '@core/components/option-menu';

const TotalHolidays = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState(null);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [employees, setEmployees] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { leaves } = useSelector((state: RootState) => state.leaves);

  const handleLeaveAddClick = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  useEffect(() => {
    dispatch(fetchLeaves({ page: 1, limit: 5, keyword: "" }));
  }, [dispatch]);

  return (
    <Card>
      <CardHeader
        title='Leaves'
        action={<OptionMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent>
          <AddLeavesForm
            handleClose={handleClose}
            leave={selectedLeaves}
            leaves={leaves}
            userRole={userRole}
            userId={userId}
            employees={employees}
            page={page}
            limit={limit}
            selectedKeyword={selectedKeyword}
          />
        </DialogContent>
      </Dialog>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves?.length === 0 && userRole !== '1' ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  <Button
                    style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
                    variant='contained'
                    color='warning'
                    startIcon={<AddIcon />}
                    onClick={handleLeaveAddClick}
                  >
                    Apply Leave
                  </Button>
                </td>
              </tr>
            ) : (
              leaves.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <div className='flex gap-2'>
                      <Typography>{row.day}</Typography>
                    </div>
                  </td>
                  <td className='!plb-1'>
                    <div className='flex gap-2'>
                      <Typography>{row.start_date}</Typography>
                    </div>
                  </td>
                  <td className='!plb-1'>
                    <div className='flex gap-2'>
                      <Typography color='text.primary'>{row.end_date}</Typography>
                    </div>
                  </td>
                  <td className='!pb-1'>
                    <Chip
                      className='capitalize'
                      variant='tonal'
                      color={
                        row.status === 'pending' ? 'warning' :
                          row.status === 'inactive' ? 'secondary' :
                            'success'
                      }
                      label={row.status}
                      size='small'
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TotalHolidays;
