import type { Metadata } from "next";
import { Zen_Dots } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import Image from "next/image";
import { PhoneIcon , MapPinIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';

const zenDots = Zen_Dots({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-dots',
});


export const metadata: Metadata = {
  title: "Johor Mini Soccer",
  description: "Your Premier Soccer Destination in Johor",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#ff6900", // Your orange brand color
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#081521", // Your dark background color
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Johor Mini Soccer",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${zenDots.variable} font-zen-dots`}>
        <nav className="flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8 w-10/12 py-4">
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
              <h1 className="text-2xl font-bold text-orange-500">Johor Mini Soccer</h1>
              <p className="text-sm text-gray-300">Your Premier Soccer Destination</p>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm">Hello, {session.user.name || session.user.email}</span>
                <form action={async () => {
                  'use server';
                  await signOut();
                }}>
                  <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/" className="text-white hover:text-orange-500">Home</Link>
                <Link href="/" className="text-white hover:text-orange-500">Booking</Link>
                <Link href="/login" className="text-white hover:text-orange-500">Login</Link>
                <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Register</Link>
              </>
            )}
          </div>
        </nav>
        {children}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center w-10/12 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-9 w-full">
              <div className="w-full">
                <Image src="/mainlogo.jpeg" alt="Mini Soccer" width={80} height={80} />
                <h3 className="text-3xl font-bold mt-10">Johor Mini Soccer</h3>
                <ul className="mt-2 space-y-2">
                  <li><Link href="/" className="hover:text-orange-500">Home</Link></li>
                  <li><Link href="/" className="hover:text-orange-500">Booking</Link></li>
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
      </body>
    </html>
  );
}
