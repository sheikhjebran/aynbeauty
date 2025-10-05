-- Migration: Marketing and campaign tables
-- Tables: campaigns, marketing_campaigns, coupons, order_coupons
-- Generated: 2025-10-05T19:38:28.515Z

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Create campaigns table
DROP TABLE IF EXISTS `campaigns`;

CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `banner_url` varchar(500) DEFAULT NULL,
  `type` enum('banner','offer','promotion','sale') DEFAULT 'banner',
  `status` enum('draft','active','paused','completed','cancelled') DEFAULT 'draft',
  `target_audience` enum('all','new_customers','existing_customers','vip','segment') DEFAULT 'all',
  `discount_type` enum('percentage','fixed','bogo','free_shipping') DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `minimum_amount` decimal(10,2) DEFAULT NULL,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `priority` int(11) DEFAULT 0,
  `click_count` int(11) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `conversion_count` int(11) DEFAULT 0,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_campaigns_status` (`status`),
  KEY `idx_campaigns_type` (`type`),
  KEY `idx_campaigns_dates` (`start_date`,`end_date`),
  KEY `idx_campaigns_priority` (`priority`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create marketing_campaigns table
DROP TABLE IF EXISTS `marketing_campaigns`;

CREATE TABLE `marketing_campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('email','sms','push','social','mixed') DEFAULT 'email',
  `status` enum('draft','scheduled','sending','sent','paused','cancelled') DEFAULT 'draft',
  `template_id` int(11) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `sender_email` varchar(255) DEFAULT NULL,
  `target_segment` enum('all','new_customers','active_customers','inactive_customers','vip','custom') DEFAULT 'all',
  `target_criteria` longtext DEFAULT NULL,
  `total_recipients` int(11) DEFAULT 0,
  `sent_count` int(11) DEFAULT 0,
  `delivered_count` int(11) DEFAULT 0,
  `opened_count` int(11) DEFAULT 0,
  `clicked_count` int(11) DEFAULT 0,
  `unsubscribed_count` int(11) DEFAULT 0,
  `bounced_count` int(11) DEFAULT 0,
  `conversion_count` int(11) DEFAULT 0,
  `revenue_generated` decimal(12,2) DEFAULT 0.00,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_marketing_campaigns_status` (`status`),
  KEY `idx_marketing_campaigns_type` (`type`),
  KEY `idx_marketing_campaigns_scheduled` (`scheduled_at`),
  KEY `idx_marketing_campaigns_segment` (`target_segment`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `marketing_campaigns_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create coupons table
DROP TABLE IF EXISTS `coupons`;

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('fixed','percentage') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minimum_amount` decimal(10,2) DEFAULT 0.00,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_coupons_code` (`code`),
  KEY `idx_coupons_active` (`is_active`),
  KEY `idx_coupons_dates` (`starts_at`,`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create order_coupons table
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

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
