import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AynBeauty - For every day, for every mood, for every you',
  description: 'Discover premium beauty products from top brands. Makeup, skincare, haircare, fragrance and more at AynBeauty.',
  keywords: 'beauty, makeup, skincare, cosmetics, fragrance, hair care, AynBeauty',
  authors: [{ name: 'AynBeauty' }],
  creator: 'AynBeauty',
  publisher: 'AynBeauty',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aynbeauty.com',
    title: 'AynBeauty - For every day, for every mood, for every you',
    description: 'Discover premium beauty products from top brands.',
    siteName: 'AynBeauty',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AynBeauty - Premium Beauty Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AynBeauty - For every day, for every mood, for every you',
    description: 'Discover premium beauty products from top brands.',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}