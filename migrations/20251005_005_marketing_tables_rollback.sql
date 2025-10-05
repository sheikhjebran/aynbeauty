-- Rollback: Marketing and campaign tables
-- Tables: campaigns, marketing_campaigns, coupons, order_coupons
-- Generated: 2025-10-05T19:38:28.524Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop order_coupons table
DROP TABLE IF EXISTS `order_coupons`;

-- Drop coupons table
DROP TABLE IF EXISTS `coupons`;

-- Drop marketing_campaigns table
DROP TABLE IF EXISTS `marketing_campaigns`;

-- Drop campaigns table
DROP TABLE IF EXISTS `campaigns`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
