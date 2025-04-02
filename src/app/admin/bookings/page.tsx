"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Pagination,
  Select,
  TextInput
} from "flowbite-react";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

export interface BookingWithField {
  id: string;
  email: string;
  fieldDescription: string;
  userId: string;
  phoneNumber: string;
  clubName: string;
  fileUrl: string;
  status: string;
  totalPrice: number;
  bookingSubmittedAt: Date;
  bookingForDate: Date;
}

const AdminPage = () => {
  const [bookings, setBookings] = useState<BookingWithField[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const onPageChange = (page: number) => setCurrentPage(page);


  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "REJECTED", label: "Rejected" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const formatDate = (date: Date, type: "date" | "datetime") => {
    date = new Date(date);
    if (type === "date") {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return (
      date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  const fetchBookings = async (currentPage: number, status: string, search: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings?page=${currentPage}&status=${status}&email=${search}`);
      const data = await response.json();
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage, statusFilter, searchQuery);
  }, [currentPage, statusFilter, searchQuery]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="bg-white container mx-auto">
      <div className="p-5 flex justify-end">
        <Select
          className="w-48"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <TextInput
          className="w-72 pl-5"
          placeholder="Search by email"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>
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
            {isLoading ? (
              <TableRow className="flex justify-center items-center h-20">
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 text-xs"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div>
                      {booking.email}
                      <br />
                      {booking.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>{booking.clubName}</TableCell>
                  <TableCell>
                    {formatDate(booking.bookingForDate, "date")}
                  </TableCell>
                  <TableCell>{booking.fieldDescription}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>{booking.totalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</TableCell>
                  <TableCell>
                    <a
                      href={booking.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Lihat Bukti Pembayaran
                    </a>
                  </TableCell>
                  <TableCell>
                    {formatDate(booking.bookingSubmittedAt, "datetime")}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/booking-detail/${booking.id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
