
import PolicyGrid from '@/views/Policy';
import { getServerMode } from '@core/utils/serverHelpers'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <PolicyGrid />
}

export default EmployeesPage;
