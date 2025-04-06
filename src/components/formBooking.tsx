'use client'
import { useState, useEffect } from 'react'
import { useServerSession } from '@/hooks/useServerSession'
import Loading from '@/components/loading'

interface FormData {
  date: string
  hour: string
  email: string
  phoneNumber: string
  clubName: string
  file: File | null
  userId: string
  price: string
}

interface FormBookingProps {
  fieldId: string
  selectedDate: string
  hour: string
  onSuccesSubmit: () => void
  onSubmmiting: () => void
  onErrorSubmit: () => void
  price: number
}

const FormBooking = ({fieldId, selectedDate, hour, onSuccesSubmit, price, onSubmmiting , onErrorSubmit}: FormBookingProps) => {
  const { session, loading } = useServerSession()
  const [formData, setFormData] = useState<FormData>({
    date: selectedDate || new Date().toISOString().split('T')[0],
    hour: hour,
    email: session?.user?.email || '',
    userId: session?.user?.userid || '',
    phoneNumber: '',
    clubName: '',
    file: null,
    price : `${price}`,
  })

  useEffect(() => {
    console.log(session)
    setFormData(prev => ({
      ...prev,
      email: session?.user?.email || '',
      userId: session?.user?.userid || ''
    }))
  }, [session])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    onSubmmiting()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('date', formData.date)
      formDataToSend.append('hour', formData.hour)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phoneNumber', formData.phoneNumber)
      formDataToSend.append('clubName', formData.clubName)
      formDataToSend.append('userId', formData.userId)
      formDataToSend.append('price', formData.price)
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }
      if (fieldId) {
        formDataToSend.append('fieldId', fieldId)
      }

      const response = await fetch('/api/bookings/submit', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      onSuccesSubmit()
    } catch (err) {
      onErrorSubmit()
      setError('Failed to submit booking. Please try again.')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container bg-white mx-auto sm:px-6 md:px-8 py-6 rounded-xl my-4">
      <h1 className="text-2xl font-bold text-orange-500 mb-8 px-4">Booking Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            disabled
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-400"
            required
          />
        </div>

        <div>
          <label htmlFor="hour" className="block text-sm font-medium text-gray-700">
            Jam
          </label>
          <input
            type="text"
            id="hour"
            value={formData.hour}
            disabled
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-400"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number (Whatsapp)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            minLength={10}
            maxLength={13}
            value={formData.phoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">
            Club Name
          </label>
          <input
            type="text"
            id="clubName"
            value={formData.clubName}
            onChange={(e) => setFormData(prev => ({ ...prev, clubName: e.target.value }))}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Upload File 
          </label>
          <input
            required
            accept="image/*"
            type="file"
            id="file"
            capture="environment"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>

    </div>
  )
}

export default FormBooking
