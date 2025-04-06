'use client'
import { useSearchParams, useRouter } from "next/navigation";
import BookingSteps from "@/components/booking-steps"
import { useEffect, useState } from "react";
import { Field } from "@prisma/client";
import Loading from "@/components/loading";
import FormBooking from "@/components/formBooking";
import SuccessModal from "@/components/successModal";
import ErrorModal from '@/components/errorModal'
import LoadingModal from "../loadingModal";

const BookingForm = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const selectedDate = searchParams.get('selectedDate')
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false)
  const [modalSubmmiting, setModalSubmitting] = useState(false)
  const router = useRouter();


  useEffect(() => {
    console.log(selectedDate && new Date(selectedDate))
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/fields/${id}`);
        if (!response.ok || !response.json) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed to fetch field (${response.status})`);
        }
        const {field} = await response.json();
        setField(field);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
      
    };
    fetchBookingData();
  }, [id, selectedDate]);

  const onSuccesSubmit = () => {
    setModalSubmitting(false)
    setModalSuccess(true)
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }

  const onSubmmiting = () => {
    setModalSubmitting(true)
  }

  const onErrorSubmit = () => {
    setModalSubmitting(false)
    setModalError(true)
  }

  if(error) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 h-h-screen-80 flex items-center justify-center">
      </div>
    )
  }

  if(isLoading || !field || !selectedDate || !id  || error) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 h-h-screen-80 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2 text-orange-500">Langkah-langkah Booking</h1>
      <BookingSteps />
      {/* Rest of your form content */}
      <div className="mt-8 bg-white rounded-xl container mx-auto px-4 sm:px-6 md:px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
        {
          field && (
            <div className="sm:flex sm:justify-between sm:items-center mb-10">
              <p className="text-sm text-gray-600 mb-1">Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-sm text-gray-600 mb-1">Jam: {field.description}</p>
              <p className="text-sm text-gray-600 mb-1">Total: Rp {field.price.toLocaleString()}</p>
            </div>
          )
        }
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Pembayaran</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="md:flex-1">
            <p className="text-sm text-gray-600 mb-1">Bank BCA</p>
            <div className="md:flex md:items-center">
              <p className="text-lg font-mono font-bold mr-2">0421072425</p>
              <p className="text-gray-700">a.n. Sendang Mini Soccer</p>
            </div>
          </div>
          <button 
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors duration-200 flex items-center"
            onClick={() => {
              navigator.clipboard.writeText("1234567890123456");
              alert("Nomor rekening berhasil disalin!");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Salin
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Silahkan transfer sesuai dengan total pembayaran ke rekening di atas.</p>
          <p className="mt-2">Setelah transfer, simpan bukti pembayaran untuk dilampirkan pada form berikutnya.</p>
        </div>
      </div>

      <FormBooking fieldId={id} selectedDate={selectedDate} hour={field?.description || '' }
      onSuccesSubmit={onSuccesSubmit} price={field.price} onSubmmiting={onSubmmiting} onErrorSubmit={onErrorSubmit}/>
      {modalSuccess && <SuccessModal/>}
      {modalSubmmiting && <LoadingModal/>}
      {modalError && <ErrorModal onClose={() => setModalError(false) }/>}
    </div>
  )
};

export default BookingForm;
