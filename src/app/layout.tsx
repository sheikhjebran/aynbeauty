import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aynbeauty.in'),
  title: 'AynBeauty - For every day, for every mood, for every you',
  description: 'Discover Premium Moroccan Skincare Products, Haircare, Fragrance and More at Ayn Beauty.',
  keywords: 'beauty, makeup, skincare, cosmetics, fragrance, hair care, AynBeauty',
  authors: [{ name: 'AynBeauty' }],
  creator: 'AynBeauty',
  publisher: 'AynBeauty',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aynbeauty.in',
    title: 'AynBeauty - For every day, for every mood, for every you',
    description: 'Discover premium beauty products from top brands.',
    siteName: 'AynBeauty',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AynBeauty - For every day, for every mood, for every you',
    description: 'Discover premium beauty products from top brands.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${poppins.variable} ${playfair.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}