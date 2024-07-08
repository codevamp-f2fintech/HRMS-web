// Component Imports
import Employees from '@views/Employees'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <Employees />
}

export default EmployeesPage
