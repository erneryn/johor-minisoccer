'use client'
import { Field } from '@prisma/client'
import Loading from '@/components/loading'
import CardBooking from '@/components/cardBooking'
// import { LoginConfirmModal } from '@/components/loginConfirmModal'
import { useState, useEffect } from 'react'
// import { useServerSession } from '@/hooks/useServerSession'
import { useRouter } from 'next/navigation'


const Booking = () => {
  // const { session, loading } = useServerSession()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableFields, setAvailableFields] = useState([]);
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [fieldId, setFieldId] = useState('');
  const [loadingField, setLoadingField ] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check if device is mobile
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    setIsMobile(mobile);
    
    // Check if device is iOS
    const ios = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsIOS(ios);
    
    // Check if device is Android
    const android = /android/i.test(userAgent.toLowerCase());
    setIsAndroid(android);

    console.log('Device Info:', {
      userAgent,
      isMobile,
      isIOS,
      isAndroid
    });
  }, []);

  const getAvailableFields = async () => {
    setAvailableFields([]);
    setError(null);
    try { 
      setLoadingField(true);
      
      // Use different API URL construction for mobile devices
      const apiUrl = isMobile 
        ? `${window.location.origin}/api/bookings/available?date=${selectedDate}`
        : `/api/bookings/available?date=${selectedDate}`;
      
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setError(errorData.error || 'Failed to fetch fields');
        setLoadingField(false);
        return;
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setAvailableFields(data.fields);
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoadingField(false);
    }
  }


  const handleBooking = (fieldId: string) => {
    router.push(`/booking/form?id=${fieldId}&selectedDate=${selectedDate}`);

    // if (!session) {
    //   setFieldId(fieldId);
    //  setIsLoginModalOpen(true);
    // } else {
    //   router.push(`/booking/form?id=${fieldId}&selectedDate=${selectedDate}`);
    // }
  }

  // const handleLoginModalClose = () => {
  //     setIsLoginModalOpen(false);
  // }

  // const redirectToLogin = () => {
  //   const redirectUrl = `/booking/form?id=${fieldId}&selectedDate=${selectedDate}`;
  //   const encodedRedirect = encodeURIComponent(redirectUrl);
  //   router.push('/login?redirect=' + encodedRedirect);
  // }

  // const redirectWithoutLogin = () => {
  //   router.push(`/booking/form?id=${fieldId}&selectedDate=${selectedDate}`);
  // }

  // if (loading) {
  //  return <Loading />
  // }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
      <div className="flex justify-center items-center bg-slate-50 rounded-xl">
        <div className="w-full h-full my-10 mx-2">
          <div className="flex justify-center items-center p-4">
            <div className="w-full h-full">
              <div className="mb-6">
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
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 active:bg-orange-700 transition-colors duration-200"
                  onClick={() => {
                    getAvailableFields();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault(); 
                    getAvailableFields();
                  }}
                  disabled={loadingField}
                  aria-label="Check field availability"
                >
                  {loadingField ? 'Checking...' : 'Check Availability'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
          <h2 className="text-2xl font-semibold text-orange-500">
            Available Fields
          </h2>
      {!availableFields.length && <p className='text-gray-400 mt-0'>no data</p>}
      {error && <p className='text-red-500 mt-0'>{error}</p>}
      {loadingField && <Loading />}
      {availableFields.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFields.map((field: Field & { isAvailable: boolean }) => (
              <CardBooking
                key={field.id}
                field={field}
                selectedDate={selectedDate}
                handleBooking={handleBooking}
              />
            ))}
          </div>
        </div>
      )}

      {/* <LoginConfirmModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        title="Continue Booking"
        primaryButton={{
          label: "Lanjutkan Booking Dengan Login",
          onClick: redirectToLogin,
        }}
        secondaryButton={{
          label: "Lanjutkan Booking Tanpa Login",
          onClick: redirectWithoutLogin,
        }}
      >
        <p className="text-gray-600 dark:text-gray-300">
          you are not logged in, but you can continue booking without logging in
        </p>
      </LoginConfirmModal> */}
    </div>
  );
}

export default Booking
