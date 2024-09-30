import { Box, TextField, Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Autocomplete from '@mui/material/Autocomplete'

interface AwardFormProps {
  employees: any[]
  selectedEmployee: any | null
  amount: string
  awardTitle: string
  isEditMode: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  setSelectedEmployee: (employee: any) => void
  setAmount: (amount: string) => void
  setAwardTitle: (title: string) => void
}

const AwardForm: React.FC<AwardFormProps> = ({
  employees,
  selectedEmployee,
  amount,
  awardTitle,
  isEditMode,
  onSubmit,
  onClose,
  setSelectedEmployee,
  setAmount,
  setAwardTitle
}) => {
  return (
    <Box
      position='fixed'
      top={0}
      left={0}
      width='100%'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
      zIndex={999}
      padding={2}
    >
      <Box position='relative' width='100%' maxWidth='500px' bgcolor='white' padding={4} borderRadius={2} boxShadow={3}>
        <IconButton style={{ position: 'absolute', top: 1, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={onSubmit}>
          <Autocomplete
            options={employees}
            getOptionLabel={option => `${option.first_name} ${option.last_name}`}
            renderInput={params => <TextField {...params} label='Employee Name' margin='normal' fullWidth />}
            value={selectedEmployee}
            onChange={(event, newValue) => {
              setSelectedEmployee(newValue)
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
          />

          <div style={{ marginTop: '16px' }}>
            <label htmlFor='awardTitle'>Award Title</label>
            <TextField
              id='awardTitle'
              value={awardTitle}
              onChange={e => setAwardTitle(e.target.value)}
              fullWidth
              margin='normal'
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label htmlFor='amount'>Description</label>
            <textarea
              id='amount'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '1rem',
                marginTop: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out'
              }}
              onFocus={e => (e.target.style.borderColor = '#3f51b5')}
              onBlur={e => (e.target.style.borderColor = '#ccc')}
            />
          </div>

          <Box mt={2} display='flex' justifyContent='space-between'>
            <Button type='submit' variant='contained' color='primary'>
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AwardForm
