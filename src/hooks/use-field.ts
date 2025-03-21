import { useEffect, useState } from 'react'

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
}

interface Field {
  id: string
  name: string
  description: string | null
  price: number
  isActive: boolean
  image: string | null
  category: string
  capacity: number
  facilities: string[]
  rules: string[]
  bookings: Booking[]
  createdAt: string
  updatedAt: string
}

export function useField(id: string) {
  const [field, setField] = useState<Field | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchField = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/fields/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch field')
        }
        const data = await response.json()
        setField(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchField()
    }
  }, [id])

  return { field, isLoading, error }
} 