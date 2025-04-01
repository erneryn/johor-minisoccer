import { useState, useEffect } from 'react'
import { DefaultSession } from "next-auth"

type User = DefaultSession["user"] & {
  userid: string | null
  role: string
}

interface Session {
  user?: User
  expires?: string
}

export function useServerSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          throw new Error('Failed to fetch session')
        }
        const data = await response.json()
        setSession(data)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { session, loading }
} 