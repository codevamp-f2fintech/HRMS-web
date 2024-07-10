// Component Imports
import Teams from '@views/Teams'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const TeamsPage = () => {
  // Vars
  const mode = getServerMode()

  return <Teams />
}

export default TeamsPage
