"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingWithField } from "@/app/admin/bookings/page";
import Loading from "@/components/loading";
import Link from "next/link";
import Image from "next/image";
import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck, HiExclamation } from "react-icons/hi";


const BookingDetail = () => {
  const params = useParams();
  const id = params.id;

  const [booking, setBooking] = useState<BookingWithField | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const formatDate = (date: Date, type: 'date' | 'datetime') => {
		date = new Date(date);
		if (type === 'date') {
				return date.toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
				})
		}
		return date.toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'long', 
				year: 'numeric'
		}) + ', ' + date.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
		});
	}

	const approveBooking = async () => {
		try {
			setIsError(false);
			setIsSubmitted(true);
			const response = await fetch(`/api/bookings/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: 'COMPLETED'})
			})
			const data = await response.json();
			setBooking(data);
			setIsSuccess(true);
			setIsError(false);
		} catch (error) {
			console.error('Error approving booking:', error);
			setIsError(true);
		} finally {
			setIsSubmitted(false);
		}
	}
  useEffect(() => {
    const fetchBooking = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/bookings/${id}`);
				const data = await response.json();
				setBooking(data);
			} catch (error) {
				console.error('Error fetching booking:', error);
			} finally{
				setLoading(false);
			}
    };
    fetchBooking();
  }, [id, isSuccess]);
  return (
    <div className="relative container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
			{isSuccess && <Toast className="absolute top-0 left-2 sm:w-1/4 w-full flex justify-between items-center">
        <div className="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Successfully approved booking.</div>
        <ToastToggle className="m-0" onDismiss={() => setIsSuccess(false) }  />
      </Toast>}
			{
				isError && <Toast className="absolute top-0 right-0 left-0 w-1/4 flex justify-between items-center">
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
						<HiExclamation className="h-5 w-5" />
					</div>
					<div className="ml-3 text-sm font-normal">Error approving booking.</div>
					<ToastToggle className="m-0" onDismiss={() => setIsError(false) }  />
				</Toast>
			}
			<div>
				<Link href="/admis" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md inline-flex items-center">
					<span>← Backs</span>
				</Link>
			</div>
			{loading ? <Loading /> : (
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center bg-slate-50 rounded-xl">				
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold text-left text-orange-500">
            Booking Detail
          </h1>
        </div>
        <div className="w-full p-4 flex justify-end gap-4">
         {booking && booking.status == 'PENDING' ? (<><button className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Reject
          </button>
          <button onClick={approveBooking} disabled={isSubmitted} className="bg-orange-500 text-white px-4 py-2 rounded-md">
            {isSubmitted ? 'Submitting...' : 'Approve'}
          </button></>): (<></>)}
        </div>
				<div className="">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Email</td>
                <td className="py-2 px-4">{booking?.email}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Phone Number</td>
                <td className="py-2 px-4">{booking?.phoneNumber}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Club Name</td>
                <td className="py-2 px-4">{booking?.clubName}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Field</td>
                <td className="py-2 px-4">{booking?.fieldDescription}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Status</td>
                <td className="py-2 px-4 bg-green-100 text-green-800 rounded-md"></td>
                
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Total Price</td>
                <td className="py-2 px-4">{booking?.totalPrice}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Booking For</td>
                <td className="py-2 px-4">{booking?.bookingForDate && formatDate(booking.bookingForDate, 'date')}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium">Submitted At</td>
                <td className="py-2 px-4">{booking?.bookingSubmittedAt && formatDate(booking.bookingSubmittedAt, 'datetime')}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Payment Proof</td>
                <td className="py-2 px-4">
                  <a 
                    href={booking?.fileUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Payment Proof
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          {booking?.fileUrl && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4 p-2">Payment Proof Image:</h3>
              <div className="relative w-full max-w-lg h-[400px] mb-8">
                <Image
                  src={booking.fileUrl}
                  alt="Payment proof"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
			)}
    </div>
  );
};


export default BookingDetail;