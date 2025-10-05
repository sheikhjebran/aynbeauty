-- Migration: Review and rating tables
-- Tables: product_reviews
-- Generated: 2025-10-05T19:38:28.516Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Create product_reviews table
DROP TABLE IF EXISTS `product_reviews`;

CREATE TABLE `product_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `review_text` text DEFAULT NULL,
  `is_verified_purchase` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 1,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_reviews_product` (`product_id`),
  KEY `idx_product_reviews_user` (`user_id`),
  KEY `idx_product_reviews_rating` (`rating`),
  KEY `idx_product_reviews_approved` (`is_approved`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
