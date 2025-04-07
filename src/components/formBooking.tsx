'use client'
import { useState, useEffect } from 'react'
import { useServerSession } from '@/hooks/useServerSession'
import Loading from '@/components/loading'
import Image from 'next/image'

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

interface FormErrors {
  file?: string
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOS)
    setFormData(prev => ({
      ...prev,
      email: session?.user?.email || '',
      userId: session?.user?.userid || ''
    }))
  }, [session])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formValid, setFormValid] = useState<FormErrors>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({
        ...prev,
        file: file
      }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.file) {
      newErrors.file = 'Lampirkan bukti pembayaran'
    }
    setFormValid(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return;
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
          <label className="block text-sm font-medium text-gray-700">
            Bukti Pembayaran
          </label>
          {
            isIOS ? (<input
              className='w-full'
              accept="image/*"
              type="file"
              id="file"
              onChange={handleFileChange}
            />) : <div className='w-full flex flex-row gap-2 p-0'>
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <button 
                className='w-full text-xs px-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-1  rounded-lg transition-colors duration-200 active:bg-orange-700 flex items-center justify-center '
                onClick={() => document.getElementById('file')?.click()}
              >
                Select Image
              </button>
              <input
                type="file"
                id="fileCamera"
                className="hidden"
                onChange={handleFileChange}
                capture="environment"
                accept="image/*"
              />
              <button 
                className='w-full text-xs px-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 rounded-lg transition-colors duration-200 active:bg-orange-700 flex items-center justify-center '
                onClick={() => document.getElementById('fileCamera')?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Take Photo
              </button>
            </div>
          }
              
          {formValid.file && (
            <div className="text-red-500 text-sm">Lampirkan bukti pembayaran</div>
          )}  
          {imagePreview && (
            <div className="mt-4 relative w-full h-48">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
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
