# Ayn Beauty - GitHub Copilot Instructions

## Project Overview

Ayn Beauty is a full-stack e-commerce platform built with Next.js 14.2.33, focusing on beauty and cosmetic products. The application features a responsive mobile-first design, complete shopping cart and checkout functionality, user authentication, product management, and admin dashboard.

## Technology Stack

### Frontend

- **Framework:** Next.js 14.2.33 with App Router (TypeScript)
- **React:** 18.x with Client Components (`'use client'` directive)
- **Styling:** Tailwind CSS 3.4.1 (mobile-first utility classes)
- **UI Components:** Custom components using class-variance-authority
- **Icons:** @heroicons/react, lucide-react
- **Animations:** Framer Motion
- **Forms:** React Hook Form with Zod validation
- **Carousel:** Swiper 10.3.1

### Backend

- **Runtime:** Node.js 20+
- **API:** Next.js API Routes (src/app/api/)
- **Database:** MySQL 8.0 with mysql2 driver
- **Authentication:** JWT with jsonwebtoken
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **SMS:** Twilio
- **Image Processing:** Sharp 0.32.6

### Development Tools

- **TypeScript:** Strict mode enabled
- **Linting:** ESLint with Next.js config
- **Package Manager:** npm
- **Process Manager:** PM2 (via ecosystem.config.js)

## Project Structure

### Core Directories

```
src/
├── app/                    # Next.js 14 App Router pages
│   ├── api/               # API route handlers
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── products/          # Product listing/detail
│   └── ...                # Other public pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── desktop/          # Desktop-optimized components
│   ├── mobile/           # Mobile-optimized components
│   ├── layout/           # Layout components
│   ├── product/          # Product-related components
│   ├── ui/               # Reusable UI components
│   └── ...
├── contexts/             # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── ImageCacheContext.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
│   ├── database.ts       # MySQL connection pool
│   ├── db.ts            # Database utilities
│   ├── email.ts         # Email service
│   └── whatsapp.ts      # WhatsApp integration
└── types/
    └── index.ts          # TypeScript type definitions

migrations/               # Database migration SQL files
scripts/                 # Utility scripts
public/                  # Static assets
server-config/          # Server configuration files
```

## Database Schema

### Core Tables

#### users

User authentication and profile management

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  mobile VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  avatar_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  is_verified TINYINT(1) DEFAULT 0,
  email_verified_at TIMESTAMP NULL,
  role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  email_verification_token VARCHAR(255),
  phone VARCHAR(20),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active)
);
```

#### brands

Product brand information

```sql
CREATE TABLE brands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brands_slug (slug),
  INDEX idx_brands_active (is_active)
);
```

#### categories

Hierarchical product categories with self-referencing parent relationship

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id INT NULL,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_slug (slug),
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_active (is_active),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Default Categories (pre-seeded):
-- 1. Skincare (sort_order: 1)
-- 2. Bath and Body (sort_order: 2)
-- 3. Lips (sort_order: 3)
-- 4. Fragrances (sort_order: 4)
-- 5. Eyes (sort_order: 5)
-- 6. Nails (sort_order: 6)
-- 7. Combo Sets (sort_order: 7)
```

### Product Tables

#### products

Main product catalog with pricing, inventory, and metadata

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2) NULL,
  cost_price DECIMAL(10,2),
  category_id INT NULL,
  brand_id INT NULL,
  stock_quantity INT DEFAULT 0,
  min_stock_level INT DEFAULT 5,
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  is_digital TINYINT(1) DEFAULT 0,
  is_trending TINYINT(1) DEFAULT 0,
  is_must_have TINYINT(1) DEFAULT 0,
  is_new_arrival TINYINT(1) DEFAULT 0,
  image_url VARCHAR(500),
  primary_image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_slug (slug),
  INDEX idx_products_sku (sku),
  INDEX idx_products_category (category_id),
  INDEX idx_products_brand (brand_id),
  INDEX idx_products_featured (is_featured),
  INDEX idx_products_active (is_active),
  INDEX idx_products_price (price),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);
```

#### product_images

Multiple images per product with primary designation

```sql
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_primary TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_images_product (product_id),
  INDEX idx_product_images_primary (is_primary),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### product_attributes

Flexible key-value attributes for products (e.g., shade, volume, ingredients)

```sql
CREATE TABLE product_attributes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  attribute_name VARCHAR(100) NOT NULL,
  attribute_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  INDEX idx_product_attributes_product (product_id),
  INDEX idx_product_attributes_name (attribute_name),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### content_blocks

Dynamic content blocks for homepage/landing pages

```sql
CREATE TABLE content_blocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  page_location VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  link_url VARCHAR(500),
  link_text VARCHAR(100),
  image_url VARCHAR(500),
  button_color VARCHAR(7) DEFAULT '#ec4899',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_content_blocks_location (page_location),
  INDEX idx_content_blocks_active (is_active),
  INDEX idx_content_blocks_dates (start_date, end_date)
);
```

### Customer Tables

#### addresses / user_addresses

Customer shipping and billing addresses (two tables for legacy compatibility)

```sql
CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('shipping', 'billing') DEFAULT 'shipping',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(200),
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  phone VARCHAR(20),
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- user_addresses is a duplicate table with similar structure
```

#### wishlists / wishlist_items

User wishlists (two tables for legacy compatibility)

```sql
CREATE TABLE wishlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_wishlists_user (user_id),
  INDEX idx_wishlists_product (product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- wishlist_items is a duplicate table with similar structure
```

### Commerce Tables

#### cart_items

Shopping cart items for both authenticated and guest users

```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  session_id VARCHAR(255) NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cart_items_user (user_id),
  INDEX idx_cart_items_session (session_id),
  INDEX idx_cart_items_product (product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### orders

Order header with status tracking and totals

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  billing_address LONGTEXT,
  shipping_address LONGTEXT,
  notes TEXT,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_payment_status (payment_status),
  INDEX idx_orders_number (order_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### order_items

Line items for each order

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) DEFAULT 0.00,
  variant_id INT NULL,
  variant_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### payments

Payment transaction records

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod') NOT NULL,
  payment_gateway VARCHAR(50),
  transaction_id VARCHAR(255),
  gateway_transaction_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
  gateway_response LONGTEXT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payments_order (order_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_transaction (transaction_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### Marketing Tables

#### campaigns

Marketing campaigns with analytics tracking

```sql
CREATE TABLE campaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  banner_url VARCHAR(500),
  type ENUM('banner', 'offer', 'promotion', 'sale') DEFAULT 'banner',
  status ENUM('draft', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
  target_audience ENUM('all', 'new_customers', 'existing_customers', 'vip', 'segment') DEFAULT 'all',
  discount_type ENUM('percentage', 'fixed', 'bogo', 'free_shipping'),
  discount_value DECIMAL(10,2),
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  coupon_code VARCHAR(50),
  priority INT DEFAULT 0,
  click_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  conversion_count INT DEFAULT 0,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  INDEX idx_campaigns_status (status),
  INDEX idx_campaigns_type (type),
  INDEX idx_campaigns_dates (start_date, end_date),
  INDEX idx_campaigns_priority (priority),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### marketing_campaigns

Email/SMS marketing automation

```sql
CREATE TABLE marketing_campaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('email', 'sms', 'push', 'social', 'mixed') DEFAULT 'email',
  status ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled') DEFAULT 'draft',
  template_id INT,
  subject VARCHAR(255),
  content TEXT,
  sender_name VARCHAR(100),
  sender_email VARCHAR(255),
  target_segment ENUM('all', 'new_customers', 'active_customers', 'inactive_customers', 'vip', 'custom') DEFAULT 'all',
  target_criteria LONGTEXT,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,
  conversion_count INT DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0.00,
  scheduled_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  INDEX idx_marketing_campaigns_status (status),
  INDEX idx_marketing_campaigns_type (type),
  INDEX idx_marketing_campaigns_scheduled (scheduled_at),
  INDEX idx_marketing_campaigns_segment (target_segment),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### coupons

Discount coupons with usage limits

```sql
CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('fixed', 'percentage') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0.00,
  maximum_discount DECIMAL(10,2),
  usage_limit INT NULL,
  used_count INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  starts_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupons_code (code),
  INDEX idx_coupons_active (is_active),
  INDEX idx_coupons_dates (starts_at, expires_at)
);
```

#### order_coupons

Junction table tracking coupon usage per order

```sql
CREATE TABLE order_coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  coupon_id INT NOT NULL,
  coupon_code VARCHAR(50) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_coupons_order (order_id),
  INDEX idx_order_coupons_coupon (coupon_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);
```

### Review Tables

#### product_reviews

Customer reviews and ratings with verification

```sql
CREATE TABLE product_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT NULL,
  rating INT NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  review_text TEXT,
  is_verified_purchase TINYINT(1) DEFAULT 0,
  is_approved TINYINT(1) DEFAULT 1,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_reviews_product (product_id),
  INDEX idx_product_reviews_user (user_id),
  INDEX idx_product_reviews_rating (rating),
  INDEX idx_product_reviews_approved (is_approved),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

### Migration Management

#### migrations

Tracks executed database migrations

```sql
CREATE TABLE migrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  batch INT NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Database Relationships

### Key Foreign Key Relationships

- `products.category_id` → `categories.id` (SET NULL)
- `products.brand_id` → `brands.id` (SET NULL)
- `categories.parent_id` → `categories.id` (self-referencing, SET NULL)
- `product_images.product_id` → `products.id` (CASCADE)
- `product_attributes.product_id` → `products.id` (CASCADE)
- `addresses.user_id` → `users.id` (CASCADE)
- `wishlists.user_id` → `users.id` (CASCADE)
- `wishlists.product_id` → `products.id` (CASCADE)
- `cart_items.user_id` → `users.id` (CASCADE)
- `cart_items.product_id` → `products.id` (CASCADE)
- `orders.user_id` → `users.id` (SET NULL)
- `order_items.order_id` → `orders.id` (CASCADE)
- `order_items.product_id` → `products.id` (CASCADE)
- `payments.order_id` → `orders.id` (CASCADE)
- `product_reviews.product_id` → `products.id` (CASCADE)
- `product_reviews.user_id` → `users.id` (CASCADE)
- `product_reviews.order_id` → `orders.id` (SET NULL)

## API Endpoints

### Authentication (`src/app/api/auth/`)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/signin` - Alternative signin endpoint
- `POST /api/auth/signup` - Alternative signup endpoint
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP

### Products (`src/app/api/products/`)

- `GET /api/products` - Get all products with filtering
  - Query params: `category`, `brand`, `search`, `minPrice`, `maxPrice`, `sort`, `limit`, `offset`
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)
- `GET /api/products/[id]/images` - Get product images
- `POST /api/products/[id]/images` - Upload product image
- `GET /api/products/[id]/reviews` - Get product reviews

### Categories (`src/app/api/categories/`)

- `GET /api/categories` - Get all categories with hierarchy

### Cart (`src/app/api/cart/`)

- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove cart item
- `DELETE /api/cart` - Clear entire cart

### Orders (`src/app/api/orders/`)

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details

### Wishlist (`src/app/api/wishlist/`)

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

### Addresses (`src/app/api/addresses/`)

- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/[id]` - Update address
- `DELETE /api/addresses/[id]` - Delete address

### Admin (`src/app/api/admin/`)

- `GET /api/admin/dashboard` - Dashboard statistics
  - Returns: totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders, lowStockProducts
- `GET /api/admin/inventory` - Get all products
- `POST /api/admin/inventory` - Add new product
- `PUT /api/admin/inventory` - Update product
- `DELETE /api/admin/inventory` - Delete product
- `POST /api/admin/cleanup-images` - Cleanup unused images

### Reviews (`src/app/api/reviews/`)

- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/debug` - Debug review data

### Marketing (`src/app/api/`)

- `GET /api/content` - Get content blocks
- `GET /api/marketing-automation` - Marketing campaign data
- `GET /api/analytics` - Analytics data

### Utilities

- `POST /api/upload/image` - Upload product image
- `GET /api/images/[...path]` - Serve optimized images
- `POST /api/revalidate` - Revalidate Next.js cache
- `POST /api/cache/clear` - Clear application cache
- `GET /api/health` - Health check endpoint
- `POST /api/guest/checkout` - Guest checkout flow

## Coding Conventions

### TypeScript

- Use strict TypeScript mode
- Define types in `src/types/index.ts`
- Use interfaces for object shapes
- Avoid `any` type - prefer `unknown` or proper typing

### React Components

- Use functional components with hooks
- Add `'use client'` directive for client components
- Props interface naming: `ComponentNameProps`
- Export components as default when single export

### Naming Conventions

- **Files:** kebab-case for all files (`product-card.tsx`, `hero-section.tsx`)
- **Components:** PascalCase (`ProductCard`, `HeroSection`)
- **Functions:** camelCase (`fetchProducts`, `handleSubmit`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ITEMS`)
- **CSS Classes:** Tailwind utility classes only
- **Database Tables:** snake_case (`product_images`, `order_items`)

### Tailwind CSS Best Practices

- Mobile-first responsive design
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Common patterns:
  - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
  - Responsive flex: `flex flex-col md:flex-row gap-4`
  - Responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
  - Full-width mobile button: `w-full sm:w-auto`

### State Management

- Use React Context for global state (Auth, Cart, Wishlist)
- Use localStorage for persistent auth tokens
- Use sessionStorage for guest wishlist
- Cart Context handles both authenticated and guest users

### Pricing Logic

- **Display Price:** Always use `discounted_price || price`
- Show original price with strikethrough when `discounted_price` exists
- Calculate discounts: `((price - discounted_price) / price * 100).toFixed(0)`

### Image Handling

- Product images stored in `public/uploads/products/`
- Use Next.js `<Image>` component with priority for LCP images
- Default dimensions: 400x400 for product cards
- Mobile responsive: `w-20 h-20 md:w-24 md:h-24`

### API Routes

- Use Next.js Route Handlers (not Pages API)
- Return `NextResponse.json()` for JSON responses
- Handle errors with try-catch and appropriate status codes
- Validate authentication with JWT middleware
- Check user role for admin routes

### Database Queries

- Use parameterized queries to prevent SQL injection
- Use connection pooling from `lib/database.ts`
- Close connections properly in finally blocks
- Use transactions for multi-table operations
- Index foreign keys and frequently queried columns

### Error Handling

- Use try-catch blocks in all async functions
- Return appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error
- Log errors to console with context

### Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Server validates credentials and generates JWT
3. JWT returned to client and stored in localStorage
4. Client includes JWT in Authorization header: `Bearer <token>`
5. API routes verify JWT and extract user info

### Form Validation

- Use React Hook Form with Zod schema validation
- Define validation schemas in component or separate file
- Display validation errors below inputs
- Disable submit button while submitting

## Common Patterns

### Product Listing with Filters

```typescript
// Query params: category, brand, search, minPrice, maxPrice, sort
const query = `
  SELECT p.*, b.name as brand_name, c.name as category_name
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE p.is_active = 1
  ${filters}
  ORDER BY ${sortColumn} ${sortOrder}
  LIMIT ? OFFSET ?
`;
```

### Cart Item with Price

```typescript
<div className="flex items-center justify-between">
  <div className="flex gap-2 items-center flex-wrap">
    {item.discounted_price && (
      <>
        <span className="text-lg font-semibold text-primary">
          ₹{item.discounted_price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 line-through">
          ₹{item.price.toFixed(2)}
        </span>
      </>
    )}
    {!item.discounted_price && (
      <span className="text-lg font-semibold">₹{item.price.toFixed(2)}</span>
    )}
  </div>
</div>
```

### Responsive Layout Pattern

```typescript
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
  {/* Main content - takes 2/3 on desktop */}
  <div className="w-full md:w-2/3">{/* Content */}</div>

  {/* Sidebar - takes 1/3 on desktop */}
  <div className="w-full md:w-1/3">{/* Sidebar */}</div>
</div>
```

### Protected API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    // Check admin role if needed
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Proceed with logic
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### Admin Dashboard Auto-Refresh

```typescript
// src/app/admin/page.tsx implements auto-refresh every 30 seconds
useEffect(() => {
  if (!autoRefreshEnabled) return;

  const interval = setInterval(() => {
    fetchDashboardData();
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, [autoRefreshEnabled]);
```

## Environment Variables

Required in `.env.local`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aynbeauty
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## npm Scripts

```bash
# Development
npm run dev                    # Start Next.js dev server (port 3000)

# Build & Production
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run setup-db               # Initial database setup
npm run reset-db               # Reset database
npm run migrate:up             # Run migrations
npm run migrate:down           # Rollback migrations
npm run migrate:fresh          # Drop all tables and re-migrate
npm run migrate:reset          # Reset and re-run all migrations

# Database Maintenance
npm run db:analyze             # Analyze database structure
npm run db:generate-migrations # Generate fresh migration files
npm run db:validate            # Validate schema consistency
npm run db:repair              # Repair schema issues

# Admin
npm run admin:reset            # Reset admin password
npm run admin:info             # Show admin account info

# Image Cleanup
npm run cleanup:images         # Delete unused product images
npm run cleanup:images:dry-run # Preview images to be deleted

# Code Quality
npm run lint                   # Run ESLint
```

## Migration Workflow

1. Create migration file in `migrations/` directory
2. Name format: `YYYYMMDD_NNN_description.sql`
3. Create corresponding rollback: `YYYYMMDD_NNN_description_rollback.sql`
4. Run with `npm run migrate:up`
5. Rollback with `npm run migrate:down`

## Performance Optimization

- Use Next.js Image component for automatic optimization
- Implement lazy loading for below-fold content
- Use ISR (Incremental Static Regeneration) for product pages
- Cache product listings with `revalidate` parameter
- Optimize database queries with proper indexes
- Use connection pooling for database
- Implement pagination for large data sets (20-50 items per page)

## Security Best Practices

- Never commit `.env` files
- Use parameterized queries (no string concatenation)
- Validate all user inputs
- Sanitize HTML output
- Use HTTPS in production
- Implement rate limiting on API routes
- Hash passwords with bcryptjs (salt rounds: 10)
- Expire JWT tokens (24 hours recommended)
- Validate JWT on every protected route
- Use CORS headers appropriately

## Testing Checklist

- [ ] Mobile responsiveness (360px, 768px, 1024px)
- [ ] Cart functionality (add, update, remove, clear)
- [ ] Authentication flow (register, login, logout)
- [ ] Checkout process (guest and authenticated)
- [ ] Product filtering and search
- [ ] Admin dashboard CRUD operations
- [ ] Image uploads and display
- [ ] Email notifications
- [ ] Error handling and validation
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

## Common Issues & Solutions

### Issue: Orders count not updating

**Solution:** Admin dashboard now auto-refreshes every 30 seconds with manual refresh button and toggle control.

### Issue: Product images not displaying

**Solution:** Check image paths use `/uploads/products/` prefix and files exist in `public/uploads/products/`.

### Issue: Mobile layout overflow

**Solution:** Use `flex flex-col md:flex-row` pattern and `w-full` on mobile elements.

### Issue: Cart not persisting

**Solution:** Authenticated users: stored in database. Guest users: stored in CartContext (session-based).

### Issue: Pricing inconsistency

**Solution:** Always use `discounted_price || price` pattern for display and calculations.

## Recent Updates

### December 14, 2025

- Enhanced Copilot instructions with complete database schema documentation
- Documented all 15 database tables with full column definitions
- Added foreign key relationships and indexing strategies
- Documented 41 API endpoints with query parameters
- Added database migration workflow documentation

### December 12, 2025

- Implemented admin dashboard auto-refresh (30-second interval)
- Added manual refresh button and auto-refresh toggle
- Added last updated timestamp display
- Initial Copilot instructions file created

### November 23, 2025

- Fixed mobile product card layout on home page
- Separated pricing and add-to-cart into stacked rows
- Changed add-to-cart icon to text button for clarity

### November 12, 2025

- Fixed cart mobile responsiveness with flex patterns
- Added desktop hero banner spacing (responsive padding)
- Optimized product listing page mobile layout

## Additional Resources

- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com
- MySQL 8.0 Reference: https://dev.mysql.com/doc/refman/8.0/en/
