

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import AttendenceGrid from '@/views/Attendence'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <AttendenceGrid />
}

export default EmployeesPage
