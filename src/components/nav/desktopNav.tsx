import LogoutButton from "../LogoutButton"

import Link from "next/link"

const DesktopNav = ({session}: {session: any}) => {
  const isAdmin = session && session.user?.role === "admin";

  if (isAdmin) {
    return (
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/admin/bookings" className="text-white hover:text-orange-500">
          Bookings
        </Link>
        <Link href="/admin/fields" className="text-white hover:text-orange-500">
          Fields
        </Link>
        <LogoutButton />
      </div>
    );
  }
  if (session) {
    return (
      <div className="hidden md:flex items-center space-x-4">

      <div className="flex items-center space-x-4">
        <Link href="/" className="text-white hover:text-orange-500">
          Home
        </Link>
        <Link href="/booking" className="text-white hover:text-orange-500">
          Booking
        </Link>
      </div>
      <Link href="/my-booking" className="text-white hover:text-orange-500">
        My Booking
      </Link>
      <span className="text-sm text-white">
        Hello, {session.user.name || session.user.email}
      </span>
      <LogoutButton />
    </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/" className="text-white hover:text-orange-500">
        Home
      </Link>
      <Link href="/booking" className="text-white hover:text-orange-500">
        Booking
      </Link>
      <Link href="/login" className="text-white hover:text-orange-500">
        Login
      </Link>
      <Link
        href="/register"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Register
      </Link>
    </div>
  );
}

export default DesktopNav