-- Rollback: Create e-commerce tables
-- Created: 2024-10-01T00:00:01.000Z
-- Description: Rollback e-commerce tables creation

-- Drop tables in reverse order (respecting foreign key constraints)
DROP TABLE IF EXISTS order_coupons;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;