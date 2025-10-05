-- Rollback: Customer related tables
-- Tables: addresses, user_addresses, wishlists, wishlist_items
-- Generated: 2025-10-05T19:38:28.521Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop wishlist_items table
DROP TABLE IF EXISTS `wishlist_items`;

-- Drop wishlists table
DROP TABLE IF EXISTS `wishlists`;

-- Drop user_addresses table
DROP TABLE IF EXISTS `user_addresses`;

-- Drop addresses table
DROP TABLE IF EXISTS `addresses`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
