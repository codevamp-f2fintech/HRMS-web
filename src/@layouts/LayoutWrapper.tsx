'use client'

// React Imports
import { useEffect, useState, type ReactElement } from 'react'

import { useRouter } from 'next/navigation'

const LayoutWrapper = ({ verticalLayout }: { verticalLayout: ReactElement }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {

    const storedToken = localStorage?.getItem('token');

    if (storedToken) {
      setToken(storedToken)
    } else {
      router.push('/login')
    }
  }, [router])

  // Return the layout based on the layout context
  if (!token) {
    return null // or a loading spinner, etc.
  }

  return <div className='flex flex-col flex-auto'>{verticalLayout}</div>
}

export default LayoutWrapper
