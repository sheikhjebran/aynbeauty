-- Rollback: Core tables with no dependencies
-- Tables: users, brands, categories, migrations
-- Generated: 2025-10-05T19:38:28.518Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop migrations table
DROP TABLE IF EXISTS `migrations`;

-- Drop categories table
DROP TABLE IF EXISTS `categories`;

-- Drop brands table
DROP TABLE IF EXISTS `brands`;

-- Drop users table
DROP TABLE IF EXISTS `users`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
