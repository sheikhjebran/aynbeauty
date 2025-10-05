-- Migration: Create campaigns table
-- Generated: 2025-10-05T16:03:29.293Z

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

-- Table: campaigns
-- Columns: 22
-- Indexes: 7
-- Foreign Keys: 1

