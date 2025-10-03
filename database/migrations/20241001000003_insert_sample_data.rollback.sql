-- Rollback: Remove sample data
-- Created: 2024-10-01T00:00:02.000Z
-- Description: Remove all sample data inserted by migration 20241001000003

-- Remove sample data in reverse order to handle foreign key constraints

-- Remove coupons
DELETE FROM coupons WHERE code IN ('WELCOME10', 'SAVE500', 'BEAUTY20');

-- Remove sample users
DELETE FROM users WHERE email IN ('admin@aynbeauty.com', 'customer@example.com');

-- Remove content blocks
DELETE FROM content_blocks WHERE title IN ('Welcome to AYN Beauty', 'New Arrivals', 'Special Offers', 'Beauty Tips', 'Virtual Try-On');

-- Remove product attributes
DELETE FROM product_attributes WHERE product_id IN (1, 2, 3, 4, 5, 6, 7, 8);

-- Remove product images
DELETE FROM product_images WHERE product_id IN (1, 2, 3, 4, 5, 6, 7, 8);

-- Remove sample products
DELETE FROM products WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8);

-- Remove sample brands
DELETE FROM brands WHERE id IN (1, 2, 3, 4, 5, 6);

-- Remove sample categories
DELETE FROM categories WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- Reset auto increment values
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE brands AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE content_blocks AUTO_INCREMENT = 1;