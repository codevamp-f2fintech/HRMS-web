import { Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';

interface AwardFormProps {
  employees: any[];
  selectedEmployee: any | null;
  amount: string;
  isEditMode: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  setSelectedEmployee: (employee: any) => void;
  setAmount: (amount: string) => void;
}

const AwardForm: React.FC<AwardFormProps> = ({
  employees,
  selectedEmployee,
  amount,
  isEditMode,
  onSubmit,
  onClose,
  setSelectedEmployee,
  setAmount,
}) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={999}
      padding={2}
    >
      <Box
        position="relative"
        width="100%"
        maxWidth="500px"
        bgcolor="white"
        padding={4}
        borderRadius={2}
        boxShadow={3}
      >
        {/* Close button */}
        <IconButton
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={onSubmit}>
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee Name"
                margin="normal"
                fullWidth
              />
            )}
            value={selectedEmployee}
            onChange={(event, newValue) => {
              setSelectedEmployee(newValue);
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
          />

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AwardForm;
