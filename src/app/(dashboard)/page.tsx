'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Grid from '@mui/material/Grid'

// Components Imports
import Award from '@views/dashboard/Award'
import Transactions from '@views/dashboard/Transactions'
import UpcomingBirthdays from '@/views/dashboard/UpcomingBirthdays'
import TotalEarning from '@views/dashboard/TotalEarning'
import DepositWithdraw from '@views/dashboard/DepositWithdraw'
import TotalHolidays from '@/views/dashboard/TotolHolidays'
import TotalLeaves from '@/views/dashboard/TotalLeaves'

const MotionGrid = motion(Grid)

const DashboardAnalytics = () => {
  const [userRole, setUserRole] = useState<string>("");
  const bottomLeftRef = useRef(null);
  const bottomRightRef = useRef(null);
  const isBottomLeftInView = useInView(bottomLeftRef, { once: true, amount: 0.5 });
  const isBottomRightInView = useInView(bottomRightRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (userRole === "") {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      setUserRole(user.role);
    }
  }, [userRole]);

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.2, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.2, ease: "easeOut" }
  };

  return (
    <Grid container spacing={6}>
      <MotionGrid item xs={12} md={4} {...fadeInLeft} transition={{ delay: 0.2 }}>
        <Award />
      </MotionGrid>
      <MotionGrid item xs={12} md={8} lg={8} {...fadeInRight} transition={{ delay: 0.4 }}>
        <Transactions />
      </MotionGrid>
      <MotionGrid item xs={12} md={5} lg={5} {...fadeInLeft} transition={{ delay: 0.6 }}>
        <UpcomingBirthdays />
      </MotionGrid>
      <MotionGrid item xs={12} md={7} lg={7} {...fadeInRight} transition={{ delay: 0.8 }}>
        <TotalEarning />
      </MotionGrid>
      <MotionGrid
        item
        xs={12}
        md={6}
        ref={bottomLeftRef}
        initial={{ opacity: 0, x: -30 }}
        animate={isBottomLeftInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {userRole === '3' ? <TotalLeaves /> : <DepositWithdraw />}
      </MotionGrid>
      <MotionGrid
        item
        xs={12}
        md={6}
        ref={bottomRightRef}
        initial={{ opacity: 0, x: 30 }}
        animate={isBottomRightInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <TotalHolidays />
      </MotionGrid>
    </Grid>
  )
}

export default DashboardAnalytics
