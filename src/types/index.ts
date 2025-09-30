// Database types
export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  role: 'customer' | 'admin';
  email_verified: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner_image?: string;
  website_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  brand_id?: number;
  category_id?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  weight?: number;
  dimensions?: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
  sku?: string;
  image?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductAttribute {
  id: number;
  product_id: number;
  attribute_name: string;
  attribute_value: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  user_id?: number;
  session_id?: string;
  product_id: number;
  variant_id?: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product?: Product;
}

export interface Address {
  id: number;
  user_id: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: OrderAddress;
  billing_address?: OrderAddress;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  product_name: string;
  product_sku: string;
  variant_name?: string;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface OrderAddress {
  id: number;
  order_id: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment?: string;
  is_verified: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: number;
  section_type: 'hero' | 'featured_products' | 'categories' | 'brands' | 'banner' | 'testimonials';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  link_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Component props types
export interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  showWishlist?: boolean;
  className?: string;
}

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export interface BrandCardProps {
  brand: Brand;
  className?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AddressFormData {
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

export interface CheckoutFormData {
  shipping_address: AddressFormData;
  billing_address?: AddressFormData;
  payment_method: string;
  notes?: string;
}

// Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  rating?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'newest';
  search?: string;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  page?: number;
  limit?: number;
}