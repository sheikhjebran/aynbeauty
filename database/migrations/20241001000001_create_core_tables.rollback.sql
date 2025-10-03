-- Rollback: Create core tables
-- Created: 2024-10-01T00:00:00.000Z
-- Description: Rollback core tables creation

-- Drop tables in reverse order (respecting foreign key constraints)
DROP TABLE IF EXISTS content_blocks;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS product_attributes;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;