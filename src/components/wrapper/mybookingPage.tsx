'use client'

import { useServerSession } from "@/hooks/useServerSession";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const MyBookings = () => {
  const Session = useServerSession();
  const [bookings, setBookings] = useState([]);
  const { session } = Session;
  
  if (!Session) {
    redirect('/login');
  }

  useEffect(() => {
    const fetchBookings = async () => { 
      const email = session?.user?.email || '';
      const bookings = await fetch(`/api/bookings?email=${email}`);
      const data = await bookings.json();
      setBookings(data.bookings);
      console.log(data,'<<<');
    };
    fetchBookings();
  }, [session]);

  return  (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
        <h1 className="text-2xl text-orange-500 font-bold">My Bookings</h1>
        {
            bookings && bookings.map((booking: any) => (
                <div key={booking.id} className="bg-white shadow-md rounded-lg p-6 mb-4 text-xs">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-800">{booking.fieldDescription}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <span className="font-medium">Booking Date:</span> {new Date(booking.bookingForDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Club Name:</span> {booking.clubName}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Total Price:</span> Rp {booking.totalPrice?.toLocaleString()}
                        </p>
                    </div>
                </div>
            ))
        }
    </div>
  )
};

export default MyBookings;