
import LeavesGrid from '@/views/Leaves';
import { getServerMode } from '@core/utils/serverHelpers'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <LeavesGrid />
}

export default EmployeesPage;
