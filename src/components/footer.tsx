import Image from "next/image";
import { PhoneIcon , MapPinIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { auth } from "@/auth";
const Footer = async () => {
  const session = await auth();

    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center w-10/12 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-9 w-full">
                <div className="w-full">
                  <Image src="/mainlogo.jpeg" alt="Mini Soccer" width={80} height={80} />
                  <h3 className="text-3xl font-bold mt-10">Johor Mini Soccer</h3>
                  <ul className="mt-2 space-y-2">
                    <li><Link href="/" className="hover:text-orange-500">Home</Link></li>
                    {
                      !session && (
                        <li><Link href="/booking" className="hover:text-orange-500">Booking</Link></li>
                      )
                    }
                  </ul>
                </div>
                <div className="w-full">
                  <h3 className="text-3xl font-bold">Contact Us</h3>
                  <ul className="mt-2 space-y-2">
                    <li><Link href="/" className="hover:text-orange-500 flex items-center">
                      <PhoneIcon className="h-7 w-7 mr-5" /> Whatssap: 012-3456789</Link></li>
                    <li>
                      <Link href="/" className="hover:text-orange-500 flex items-center">
                      <MapPinIcon className="h-7 w-7 mr-5" /> 
                      Address: Medan Johor, Indonesia</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
                <div className="w-full flex justify-center items-center">
                  <p className="mt-2 text-gray-400 text-xs">
                    © {new Date().getFullYear()} Johor Mini Soccer. All rights reserved.
                  </p>
                </div>
          </footer>
    )
}

export default Footer;