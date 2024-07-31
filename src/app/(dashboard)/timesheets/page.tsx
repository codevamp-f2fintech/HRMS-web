

import TimeSheetGrid from '@/views/TimeSheet';
import { getServerMode } from '@core/utils/serverHelpers'

const EmployeesPage = () => {
  // Vars
  const mode = getServerMode()

  return <TimeSheetGrid />
}

export default EmployeesPage;
