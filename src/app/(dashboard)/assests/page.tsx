

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import AssetsGrid from '@/views/pages/Assets'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <AssetsGrid />
}

export default EmployeesPage
