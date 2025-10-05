-- Rollback: Review and rating tables
-- Tables: product_reviews
-- Generated: 2025-10-05T19:38:28.525Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop product_reviews table
DROP TABLE IF EXISTS `product_reviews`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
