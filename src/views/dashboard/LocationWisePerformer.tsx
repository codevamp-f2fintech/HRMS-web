import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

import { apiResponse } from '@/utility/apiResponse/employeesResponse'
import { fetchAwards, addAward } from '@/redux/features/performer/performereSlice'
import type { AppDispatch, RootState } from '@/redux/store'

import AwardForm from '@/components/performer/AwardForm'
import { formatAmount } from '@/utility/formatAmount/formatAmount'

const LocationWisePerformer = () => {
  const dispatch: AppDispatch = useDispatch()
  const { awards, loading, error } = useSelector((state: RootState) => state.awards)

  const [selectedAwardIndex, setSelectedAwardIndex] = useState<number | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [awardTitle, setAwardTitle] = useState('')

  const [userId, setUserId] = useState<string | null>(null)
  const [userDesg, setUserDesg] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    setUserId(user.id)
    setUserDesg(user.desg)

    const fetchEmployees = async () => {
      try {
        const data = await apiResponse()

        setEmployees(data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
    dispatch(fetchAwards())
  }, [dispatch])

  const handleMenuClick = (index: number) => {
    setSelectedAwardIndex(index)

    if (awards[index]) {
      setIsEditMode(true)
      const award = awards[index]
      const employee = employees.find(emp => emp._id === (award.employee?._id || award.employee))

      setSelectedEmployee(employee || null)
      setAmount(award.amount.toString())
      setAwardTitle(award.awardTitle || '')
    } else {
      setIsEditMode(false)
      setSelectedEmployee(null)
      setAmount('')
      setAwardTitle('')
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const url =
        isEditMode && selectedAwardIndex !== null
          ? `${process.env.NEXT_PUBLIC_APP_URL}/awards/${awards[selectedAwardIndex]._id}`
          : `${process.env.NEXT_PUBLIC_APP_URL}/awards`

      const method = isEditMode && selectedAwardIndex !== null ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee: selectedEmployee ? selectedEmployee._id : '',
          amount: amount,
          awardTitle: awardTitle
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newAward = await response.json()

      if (isEditMode) {
        dispatch(fetchAwards())
      } else {
        dispatch(addAward({ ...newAward, employee: selectedEmployee }))
      }
    } catch (error) {
      console.error('Error saving award:', error)
    }

    setSelectedAwardIndex(null)
  }

  const handleCloseForm = () => {
    setSelectedAwardIndex(null)
  }

  return (
    <Box position='relative'>
      <Card>
        <CardContent>
          {loading && <Typography>Loading awards...</Typography>}
          {error && <Typography color='error'>{error}</Typography>}
          <Box display='flex' flexDirection='column' gap={4}>
            {[...awards, ...new Array(3 - awards.length).fill(null)].map((award, index) => (
              <Card key={award ? award._id : index}>
                <CardContent className='relative flex flex-col gap-2'>
                  {/* Highlighted Location on Top */}
                  <Box mb={2} display='flex' alignItems='center' justifyContent='space-between'>
                    {/* Image on the left */}
                    {award && award.employee && award.employee.image && (
                      <img
                        src={award.employee.image}
                        alt={`${award.employee.first_name} ${award.employee.last_name}`}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                    )}

                    {/* Centered Location Text */}
                    <Typography
                      variant='h6'
                      style={{ fontWeight: 'bold', textTransform: 'uppercase', flexGrow: 1, textAlign: 'center' }}
                    >
                      {award && award.employee ? award.employee.location : '---'}
                    </Typography>

                    {/* Placeholder for alignment purposes */}
                    <div style={{ width: '40px' }}></div>
                  </Box>

                  <Box display='flex' justifyContent='space-between' width='100%'>
                    <div>
                      <Typography variant='h5'>
                        {award && award.employee ? (
                          <>
                            {userId === award.employee._id ? 'Congratulations' : 'Congratulate'}{' '}
                            <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {award.employee.first_name} {award.employee.last_name}
                            </span>
                            ! 🎉
                          </>
                        ) : (
                          'No Award Data'
                        )}
                      </Typography>
                      {award && award.employee && (
                        <Typography
                          style={{ fontWeight: 'normal', color: '#bb89d8', fontStyle: 'italic', marginTop: '4px' }}
                        >
                          {award.employee.designation}
                        </Typography>
                      )}
                      <div style={{ paddingRight: '80px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                        <Typography
                          variant='h6'
                          style={{
                            fontSize: '1rem',
                            marginTop: '8px',
                            wordWrap: 'break-word', // Ensure word wrapping
                            wordBreak: 'break-all',  // Break words that are too long
                          }}
                        >
                          {award?.awardTitle || 'Best seller of the month'}
                        </Typography>
                      </div>
                    </div>
                    {userDesg === 'Sr. Operation Manager' && (
                      <Tooltip title='Add/Edit'>
                        <IconButton
                          onClick={() => handleMenuClick(index)}
                          style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <div style={{ paddingRight: '80px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                    <Typography variant='h5' color='primary' style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                      {award?.amount ? award.amount : 'N/A'}
                    </Typography>
                  </div>
                  <img
                    src='/images/pages/trophy.png'
                    alt='trophy image'
                    height={80}
                    className='absolute inline-end-7 bottom-6'
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Render the AwardForm component */}
      {selectedAwardIndex !== null && (
        <AwardForm
          employees={employees}
          selectedEmployee={selectedEmployee}
          amount={amount}
          awardTitle={awardTitle}
          setAwardTitle={setAwardTitle}
          isEditMode={isEditMode}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          setSelectedEmployee={setSelectedEmployee}
          setAmount={setAmount}
        />
      )}
    </Box>
  )
}

export default LocationWisePerformer
