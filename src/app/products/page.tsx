// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { ProductListingPage } from '@/components/product'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products - AynBeauty',
  description: 'Browse our complete collection of beauty products. Find the best cosmetics, skincare, and beauty tools from top brands.',
  keywords: 'beauty products, cosmetics, skincare, makeup, all products',
}

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <ProductListingPage searchParams={searchParams} />
  )
}