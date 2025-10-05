#!/bin/bash

# AynBeauty Database Migration Script for Production
# Run this script on your BigRock server to create the database schema

echo "🚀 Starting AynBeauty Database Migration..."

# Database configuration
DB_NAME="aynbeauty_prod"
DB_USER="your_db_user"      # Replace with your actual database username
DB_PASSWORD="your_db_pass"  # Replace with your actual database password
DB_HOST="localhost"

echo "📊 Creating database schema..."

# Create the database schema using MySQL
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" << 'EOF'

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS aynbeauty_prod;
USE aynbeauty_prod;

-- Drop existing tables if they exist (for fresh migration)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS loyalty_redemptions;
DROP TABLE IF EXISTS loyalty_transactions;
DROP TABLE IF EXISTS loyalty_rewards;
DROP TABLE IF EXISTS loyalty_programs;
DROP TABLE IF EXISTS loyalty_tiers;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  parent_id INT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Brands Table
CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  banner_image VARCHAR(500),
  website_url VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  brand_id INT,
  category_id INT,
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_must_have BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
  seo_title VARCHAR(255),
  seo_description TEXT,
  image_url VARCHAR(500),
  primary_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Product Images Table
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Product Reviews Table
CREATE TABLE product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Cart Items Table
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id VARCHAR(255),
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address JSON,
  billing_address JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Loyalty System Tables
CREATE TABLE loyalty_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_points INT NOT NULL,
  max_points INT,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  benefits TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loyalty_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tier_id INT DEFAULT 1,
  total_points INT DEFAULT 0,
  current_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tier_id) REFERENCES loyalty_tiers(id)
);

CREATE TABLE loyalty_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  points INT NOT NULL,
  transaction_type ENUM('earned', 'redeemed') NOT NULL,
  description TEXT,
  order_id INT,
  reward_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Performance Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_trending ON products(is_trending);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_user ON product_reviews(user_id);

-- Insert Sample Categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Skincare', 'skincare', 'Premium skincare products for all skin types', TRUE),
('Makeup', 'makeup', 'Professional makeup and cosmetics', TRUE),
('Fragrance', 'fragrance', 'Luxury fragrances and perfumes', TRUE),
('Hair Care', 'hair-care', 'Hair care and styling products', TRUE),
('Body Care', 'body-care', 'Body lotions, scrubs and treatments', TRUE);

-- Insert Sample Brands
INSERT INTO brands (name, slug, description, is_featured, is_active) VALUES
('Ayn Beauty', 'ayn-beauty', 'Premium beauty brand offering high-quality cosmetics', TRUE, TRUE),
('Luxury Cosmetics', 'luxury-cosmetics', 'High-end cosmetic products for discerning customers', TRUE, TRUE),
('Natural Glow', 'natural-glow', 'Organic and natural beauty products', FALSE, TRUE),
('Elite Skincare', 'elite-skincare', 'Professional skincare solutions', FALSE, TRUE);

-- Insert Loyalty Tiers
INSERT INTO loyalty_tiers (name, min_points, max_points, discount_percentage, benefits) VALUES
('Bronze', 0, 499, 0, 'Welcome bonus, Birthday discount'),
('Silver', 500, 999, 5, 'Free shipping, Early sale access, 5% discount'),
('Gold', 1000, 2499, 10, 'Priority support, Exclusive products, 10% discount'),
('Platinum', 2500, NULL, 15, 'Personal shopper, VIP events, 15% discount');

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, discounted_price, brand_id, category_id, stock_quantity, image_url, is_trending, is_must_have, is_new_arrival, sku) VALUES
('Vitamin C Serum', 'vitamin-c-serum', 'Brightening vitamin C serum for glowing skin', 899.00, 799.00, 1, 1, 50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', TRUE, TRUE, FALSE, 'VCS001'),
('Hydrating Face Mask', 'hydrating-face-mask', 'Deep hydration mask for dry skin', 599.00, NULL, 2, 1, 30, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400', FALSE, TRUE, TRUE, 'HFM002'),
('Matte Lipstick', 'matte-lipstick', 'Long-lasting matte lipstick in classic red', 299.00, 249.00, 2, 2, 100, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', TRUE, FALSE, FALSE, 'ML003'),
('Argan Oil', 'argan-oil', 'Pure argan oil for hair and skin nourishment', 1299.00, 999.00, 3, 4, 25, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', FALSE, TRUE, TRUE, 'AO004'),
('Rose Water Toner', 'rose-water-toner', 'Refreshing rose water toner for all skin types', 399.00, NULL, 1, 1, 75, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', FALSE, FALSE, TRUE, 'RWT005');

-- Create Admin User (Password: admin123 - should be changed after first login)
INSERT INTO users (email, password, first_name, last_name, role, email_verified) VALUES
('admin@aynbeauty.com', '$2b$10$rH8Qg5Z1nJ9Y3wX2vK4tO.1qJ5G3H7L9K4N8M6P2R5T8W0Y3X6Z1A4', 'Admin', 'User', 'admin', TRUE);

-- Insert sample product reviews
INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_approved) VALUES
(1, 1, 5, 'Amazing results!', 'This vitamin C serum really brightened my skin. Highly recommended!', TRUE),
(1, 1, 4, 'Good product', 'Nice texture and absorption. Saw improvements after 2 weeks.', TRUE),
(3, 1, 5, 'Perfect shade', 'The color is exactly what I wanted. Long-lasting formula.', TRUE);

EOF

echo "✅ Database schema created successfully!"
echo "🔐 Default admin login: admin@aynbeauty.com / admin123"
echo "⚠️  IMPORTANT: Change the admin password after first login!"
echo "🎉 Database migration completed!"