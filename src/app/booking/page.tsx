'use client'
import { Field } from '@prisma/client'
import Loading from '@/components/loading'
import CardBooking from '@/components/cardBooking'
import { LoginConfirmModal } from '@/components/loginConfirmModal'
import { useState } from 'react'
import { useServerSession } from '@/hooks/useServerSession'
import { useRouter } from 'next/navigation'

const Booking = () => {
  const { session, loading } = useServerSession()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableFields, setAvailableFields] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [fieldId, setFieldId] = useState('');
  const router = useRouter();
  
  const getAvailableFields = async () => {
    setAvailableFields([]);
    try {
      const response = await fetch(`/api/bookings/available?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fields');
      }
      const data = await response.json();
      setAvailableFields(data.fields);
    } catch (error) {
      console.error('Error fetching available fields:', error);
    }
  }

  const handleBooking = (fieldId: string) => {
    if (!session) {
      setFieldId(fieldId);
      setIsLoginModalOpen(true);
    } else {
      router.push(`/booking/form?id=${fieldId}&selectedDate=${selectedDate}`);
    }
  }

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  }

  const redirectToLogin = () => {
    const redirectUrl = `/booking/form?id=${fieldId}&selectedDate=${selectedDate}`;
    const encodedRedirect = encodeURIComponent(redirectUrl);
    router.push('/login?redirect=' + encodedRedirect);
  }

  const redirectWithoutLogin = () => {
    router.push(`/booking/form?id=${fieldId}&selectedDate=${selectedDate}`);
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
      <h1 className="text-4xl font-bold text-orange-500">Find Available Field</h1>
      <div className="flex justify-center items-center bg-slate-50 rounded-xl">
        <div className="w-full h-full my-10 mx-2">
          <div className="flex justify-center items-center p-4">
            <div className="w-full h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Date</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    aria-label="Select booking date"
                    onChange={(e) => {
                      const date = e.target.value;
                      setSelectedDate(date);
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                  onClick={getAvailableFields}
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {availableFields.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">Available Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFields.map((field: Field & { isAvailable: boolean }) => (
              <CardBooking
                key={field.id}
                field={field}
                selectedDate={selectedDate}
                handleBooking={() => handleBooking(field.id)}
              />
            ))}
          </div>
        </div>
      )}

      <LoginConfirmModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        title="Continue Booking"
        primaryButton={{
          label: "Login To Continue",
          onClick: redirectToLogin
        }}
        secondaryButton={{
          label: "Continue Booking Without Login",
          onClick: redirectWithoutLogin
        }}
      >
        <p className="text-gray-600 dark:text-gray-300">
          you are not logged in, but you can continue booking without logging in
        </p>
      </LoginConfirmModal>
    </div>
  )
}

export default Booking
