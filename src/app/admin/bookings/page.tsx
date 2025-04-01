'use client'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

export interface BookingWithField  {
    id: string,
    email: string,
    fieldDescription: string,
    userId: string,
    phoneNumber: string,
    clubName: string,
    fileUrl: string,
    status: string,
    totalPrice: number,
    bookingSubmittedAt: Date,
    bookingForDate: Date
}
 
const AdminPage = () => {

    const [bookings, setBookings] = useState<BookingWithField[]>([])

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

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings')
            const data = await response.json()
            setBookings(data)
        }
        fetchBookings()
    }, [])

    console.log(bookings)
    return <div className="bg-white container mx-auto">
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Email / No HP</TableHeadCell>
            <TableHeadCell>Nama Club</TableHeadCell>
            <TableHeadCell>Booking Untuk Tanggal</TableHeadCell>
            <TableHeadCell>Jam Main</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Total Price</TableHeadCell>
            <TableHeadCell>Bukti Pembayaran</TableHeadCell>
            <TableHeadCell>Dibuat Pada Tanggal</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {
          bookings.map((booking) => (
            <TableRow key={booking.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <div>
            {booking.email}
            <br />
            {booking.phoneNumber}
            </div>
            </TableCell>
            <TableCell>{booking.clubName}</TableCell>
            <TableCell>{formatDate(booking.bookingForDate, 'date')}</TableCell>
            <TableCell>{booking.fieldDescription}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-sm ${
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </TableCell>
            <TableCell>{booking.totalPrice}</TableCell>
            <TableCell>
              <a href={booking.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Lihat Bukti Pembayaran
              </a>
            </TableCell>
            <TableCell>{formatDate(booking.bookingSubmittedAt, 'datetime')}</TableCell>
            <TableCell>
              <Link href={`/admin/booking-detail/${booking.id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
              Lihat Detail
              </Link>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
}

export default AdminPage
