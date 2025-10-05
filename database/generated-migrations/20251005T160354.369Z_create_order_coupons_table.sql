-- Migration: Create order_coupons table
-- Generated: 2025-10-05T16:03:54.480Z

DROP TABLE IF EXISTS `order_coupons`;

CREATE TABLE `order_coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order_coupons_order` (`order_id`),
  KEY `idx_order_coupons_coupon` (`coupon_id`),
  CONSTRAINT `order_coupons_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_coupons_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: order_coupons
-- Columns: 6
-- Indexes: 3
-- Foreign Keys: 2

