import Link from 'next/link';
import Image from "next/image";
import { auth } from '@/auth';
import MobileNav from '@/components/nav/mobileNav';
import DesktopNav from '@/components/nav/desktopNav';
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
          <MobileNav session={session} />
        </div>
        
        {/* Desktop menu */}
          <DesktopNav session={session} />
      </nav>
    )
}

export default Navbar;