import { ProductListingPage } from '@/components/product'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // You can fetch category data here for better SEO
  const categoryName = params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${categoryName} Products - AynBeauty`,
    description: `Shop the best ${categoryName.toLowerCase()} products from top brands at AynBeauty. Free shipping on orders above ₹299.`,
    keywords: `${categoryName}, beauty products, cosmetics, ${params.slug}`,
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <ProductListingPage 
      category={params.slug}
      searchParams={searchParams}
    />
  )
}