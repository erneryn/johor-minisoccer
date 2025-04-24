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
  const [isAddWasit, setIsAddWasit] = useState<'tidak' | 'ya'>('tidak')
  const [isAddPhotographer, setIsAddPhotographer] = useState<'tidak' | 'ya'>('tidak')
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

  const generateFieldPrice = (field: Field, selectedDate: string) => {
    const date = new Date(selectedDate)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6 || date.getDay() === 5
    if(isWeekend && field.weekendPrice && field.type === 'promo') {
      return   `Rp ${field.weekendPrice.toLocaleString()} (Weekend)`
    }
    return `Rp ${field.price.toLocaleString()}`
  }

  const getFieldPrice = (field: Field, selectedDate: string) => {
    const date = new Date(selectedDate)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6 || date.getDay() === 5
    if(isWeekend && field.weekendPrice && field.type === 'promo') {
      return field.weekendPrice
    }
    return field.price
  }
  const generateGrandTotal = (field: Field, selectedDate: string, percent: number = 100) => {
    const totalPrice = getFieldPrice(field, selectedDate)
    const totalPriceWasit = isAddWasit === 'ya' ? 150000 : 0
    const totalPricePhotographer = isAddPhotographer === 'ya' ? 350000 : 0
    const grandTotal = (Number(totalPrice) + Number(totalPriceWasit) + Number(totalPricePhotographer) )/ (100/percent)
    return `Rp ${grandTotal.toLocaleString()}`
  }
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
        <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambahan</h2>
          <div className="flex justify-between align-baseline  gap-2 border-b border-gray-200 pb-4">
          <h2 className="text-sm text-gray-600 mb-1">Apakah anda ingin menambahkan Sewa Wasit ? (Rp. 150.000)</h2>
          <select defaultValue={isAddWasit} onChange={(e) => setIsAddWasit(e.target.value as 'tidak' | 'ya')} className="bg-gray-100 text-black-500 py-1 px-5 rounded-md self-center">
            <option  value="tidak">Tidak</option>
            <option  value="ya">Ya</option>
          </select>
          </div>
          <div className="flex justify-between  gap-2 py-4">
          <h2 className="text-sm text-gray-600 mb-1">Apakah anda ingin menambahkan Photographer by Lensakoe ? (Rp. 350.000)</h2>
          <select defaultValue={isAddPhotographer} onChange={(e) => setIsAddPhotographer(e.target.value as 'tidak' | 'ya')} className="bg-gray-100 text-black-500 py-1 px-5 rounded-md self-center">
            <option  value="tidak">Tidak</option>
            <option  value="ya">Ya</option>
          </select>
          </div>
        
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
        {
          field && (
            <div className="mb-10">
            <div className="sm:flex sm:justify-between sm:items-center">
              <p className="text-sm text-gray-600 mb-1">Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-sm text-gray-600 mb-1">Jam: {field.description}</p>
              {/* <p className="text-sm text-gray-600 mb-1">Total: {generateTotalPrice(field, selectedDate)}</p> */}
            </div>
            <table className="w-full">
              <tbody> 
                <tr>
                  <td className="text-sm text-gray-600 mb-1">Sewa Lapangan</td>
                  <td className="text-sm text-gray-600 mb-1 text-right">{generateFieldPrice(field, selectedDate)}</td>
                </tr>
                {isAddWasit === 'ya' && (
                  <tr>
                    <td className="text-sm text-gray-600 mb-1">Sewa Wasit</td>
                    <td className="text-sm text-gray-600 mb-1 text-right">{isAddWasit === 'ya' ? 'Rp. 150.000' : 'Rp. 0'}</td>
                  </tr>
                )}
                {isAddPhotographer === 'ya' && (
                  <tr>
                    <td className="text-sm text-gray-600 mb-1">Sewa Photographer</td>
                    <td className="text-sm text-gray-600 mb-1 text-right">{isAddPhotographer === 'ya' ? 'Rp. 350.000' : 'Rp. 0'}</td>
                  </tr>
                )}
                
                <tr className="border-t border-gray-200">
                  <td className="text-sm text-gray-600 mb-1">Total</td>
                  <td className="text-xl text-gray-900 mb-1 text-right">{generateGrandTotal(field, selectedDate)}</td>
                </tr>
              </tbody>
            </table>
            </div>
          )
        }
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Pembayaran</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="md:flex-1">
            <p className="text-sm text-gray-600 mb-1">Bank BCA</p>
            <div className="md:flex md:items-center">
              <p className="text-lg font-mono font-bold mr-2">0421072425</p>
              <p className="text-gray-700">a.n. Muhammad ridho maulana lubis</p>
            </div>
          </div>
          <button 
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors duration-200 flex items-center"
            onClick={() => {
              navigator.clipboard.writeText("0421072425");
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
          <p>Silahkan transfer minimal  <span className="text-black font-extrabold text-lg"> 50% {generateGrandTotal(field, selectedDate, 50)}</span>  dari total pembayaran ke rekening di atas.</p>
          <p className="mt-2">Setelah transfer, simpan bukti pembayaran untuk dilampirkan pada form berikutnya.</p>
        </div>
      </div>

      <FormBooking 
        fieldId={id} 
        selectedDate={selectedDate} 
        hour={field?.description || ''}
        useWasit={isAddWasit}
        usePhotographer={isAddPhotographer}
        onSuccesSubmit={onSuccesSubmit} 
        fieldPrice={getFieldPrice(field, selectedDate)} 
        onSubmmiting={onSubmmiting} 
        onErrorSubmit={onErrorSubmit}
      />
      {modalSuccess && <SuccessModal/>}
      {modalSubmmiting && <LoadingModal/>}
      {modalError && <ErrorModal onClose={() => setModalError(false) }/>}
    </div>
  )
};

export default BookingForm;
