-- Rollback: Product and content related tables
-- Tables: products, product_images, product_attributes, content_blocks
-- Generated: 2025-10-05T19:38:28.519Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop content_blocks table
DROP TABLE IF EXISTS `content_blocks`;

-- Drop product_attributes table
DROP TABLE IF EXISTS `product_attributes`;

-- Drop product_images table
DROP TABLE IF EXISTS `product_images`;

-- Drop products table
DROP TABLE IF EXISTS `products`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
