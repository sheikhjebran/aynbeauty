-- Rollback: E-commerce and order tables
-- Tables: cart_items, orders, order_items, payments
-- Generated: 2025-10-05T19:38:28.522Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop payments table
DROP TABLE IF EXISTS `payments`;

-- Drop order_items table
DROP TABLE IF EXISTS `order_items`;

-- Drop orders table
DROP TABLE IF EXISTS `orders`;

-- Drop cart_items table
DROP TABLE IF EXISTS `cart_items`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
