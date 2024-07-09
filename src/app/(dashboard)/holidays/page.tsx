// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import HolidayGrid from '@/views/pages/Holidays'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <HolidayGrid />
}

export default EmployeesPage
