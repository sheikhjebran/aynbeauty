import { ProductDetailPage } from '@/components/product'
import { Metadata } from 'next'

interface ProductPageProps {
  params: { id: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${params.id}`)
    
    if (!response.ok) {
      return {
        title: 'Product Not Found - AynBeauty',
        description: 'The requested product could not be found.'
      }
    }

    const { product } = await response.json()

    return {
      title: `${product.name} - ${product.brand_name} | AynBeauty`,
      description: product.description,
      keywords: `${product.name}, ${product.brand_name}, beauty, cosmetics, ${product.category_name}`,
      openGraph: {
        title: `${product.name} - ${product.brand_name}`,
        description: product.description,
        images: product.images?.map((img: any) => ({
          url: img.image_url,
          alt: img.alt_text || product.name
        })) || [],
        type: 'website',
      },
      other: {
        'product:price:amount': product.sale_price || product.price,
        'product:price:currency': 'INR',
        'product:availability': product.stock_quantity > 0 ? 'in stock' : 'out of stock',
        'product:brand': product.brand_name,
        'product:category': product.category_name,
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product - AynBeauty',
      description: 'Shop premium beauty products at AynBeauty'
    }
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailPage productId={params.id} />
}