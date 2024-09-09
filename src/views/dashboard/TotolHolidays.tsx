
'use client'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import { fetchHolidays } from '@/redux/features/holidays/holidaysSlice';

// MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import tableStyles from '@core/styles/table.module.css'


import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'



const SalesByCountries = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { holidays } = useSelector((state: RootState) => state.holidays);


  useEffect(() => {
    dispatch(fetchHolidays({ page: 1, limit: 5, keyword: "" }));

  }, [])

  console.log('holidays', holidays)


  return (
    <Card>
      <CardHeader
        title='Holidays'
        action={<OptionMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      ></CardHeader>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((row, index) => (
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
                    color={row.title === 'pending' ? 'warning' : row.title === 'inactive' ? 'secondary' : 'success'}
                    label={row.title}
                    size='small'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default SalesByCountries
