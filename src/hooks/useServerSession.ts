import { useState, useEffect } from 'react'

interface User {
  name?: string
  email?: string
  userid?: string
  // Add other user properties you need
}

interface Session {
  user?: User
  expires?: string
  // Add other session properties you need
}

export const useServerSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const getSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const sessionData = await response.json()
      setSession(sessionData)
    } catch (error) {
      console.error('Error fetching session:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = () => {
    setLoading(true)
    getSession()
  }

  useEffect(() => {
    getSession()
  }, [])

  return { session, loading, refreshSession }
} 