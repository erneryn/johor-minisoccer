import Link from 'next/link';
import Image from "next/image";
import { auth } from '@/auth';
import LogoutButton from '@/components/LogoutButton';
import MobileNav from '@/components/nav/mobileNav';

const Navbar = async () => {
  const session = await auth();
    return (
        <nav className="flex justify-between items-center mx-auto sm:px-6 md:px-8 w-10/12 py-4">
        <Link href="/" className="flex items-center space-x-4">
          <div className="relative">
            <Image 
              src="/mainlogo.jpeg" 
              alt="Mini Soccer" 
              width={80} 
              height={80} 
              className=" border-2 border-orange-500"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-l sm:text-2xl font-bold text-orange-500">Johor Mini Soccer</h1>
            <p className="sm:text-sm text-xs text-gray-300">Your Premier Soccer Destination</p>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <> 
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-orange-500">Home</Link>
              <Link href="/booking" className="text-white hover:text-orange-500">Booking</Link>
            </div>
              <span className="text-sm text-white">Hello, {session.user.name || session.user.email}</span>
             <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/" className="text-white hover:text-orange-500">Home</Link>
              <Link href="/booking" className="text-white hover:text-orange-500">Booking</Link>
              <Link href="/login" className="text-white hover:text-orange-500">Login</Link>
              <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Register</Link>
            </>
          )}
        </div>
      </nav>
    )
}

export default Navbar;