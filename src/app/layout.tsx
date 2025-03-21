import type { Metadata } from "next";
import { Zen_Dots } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/nav/nav'
import Footer from '@/components/footer'

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
}: {
  children: React.ReactNode
}) {

  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${zenDots.variable} font-zen-dots`}>
         <Navbar/>
          {children}
          <Footer/>
        </body>
      </html>
    </SessionProvider>
  );
}
