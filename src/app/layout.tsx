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
  title: "Johor Mini Soccer | Mini Soccer Medan Johor",
  description: "Book your soccer field in Medan Johor. Professional mini soccer facilities, competitive rates, and convenient online booking system. Perfect for teams and casual players.",
  keywords: "medan mini Soccer, mini soccer, mini Socccer di Medan, football field, sports booking, team sports, booking mini soccer di Medan, mini soccer di Sumatera Utara",
  authors: [{ name: "Medan Johor Mini Soccer" }],
  creator: "Medan Johor Mini Soccer",
  publisher: "Medan Johor Mini Soccer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://johorminisoccer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://johorminisoccer.com',
    siteName: 'Medan Johor Mini Soccer',
    title: 'Medan Johor Mini Soccer | Mini Soccer Medan Johor',
    description: 'Book your soccer field in Medan Johor. Professional mini soccer facilities, competitive rates, and convenient online booking system. Perfect for teams and casual players.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Medan Johor Mini Soccer Field',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medan Johor Mini Soccer | Mini Soccer Medan Johor',
    description: 'Book your soccer field in Medan Johor. Professional mini soccer facilities, competitive rates, and convenient online booking system. Perfect for teams and casual players.',
    images: ['/twitter-image.jpg'],
    creator: '@medanjohorminisoccer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
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
        color: "#ff6900",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#081521",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Johor Mini Soccer",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  category: 'sports',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
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
