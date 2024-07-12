// Component Imports

// Server Action Imports
import HolidayGrid from '@/views/Holidays';
import { getServerMode } from '@core/utils/serverHelpers'


const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <HolidayGrid />
}

export default EmployeesPage;
