import { ProductListingPage } from '@/components/product'
import { Metadata } from 'next'

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const searchQuery = searchParams.search as string || ''
  
  return {
    title: searchQuery ? `Search Results for "${searchQuery}" - AynBeauty` : 'Search Products - AynBeauty',
    description: searchQuery 
      ? `Find products matching "${searchQuery}" at AynBeauty. Browse our wide selection of beauty products.`
      : 'Search for your favorite beauty products at AynBeauty. Find the best cosmetics and skincare items.',
    keywords: `search, beauty products, ${searchQuery}, cosmetics, skincare`,
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div>
      <ProductListingPage searchParams={searchParams} />
    </div>
  )
}