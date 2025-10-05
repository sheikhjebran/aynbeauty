-- Migration: Create content_blocks table
-- Generated: 2025-10-05T16:03:54.432Z

DROP TABLE IF EXISTS `content_blocks`;

CREATE TABLE `content_blocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `page_location` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `link_text` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `button_color` varchar(7) DEFAULT '#ec4899',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_content_blocks_location` (`page_location`),
  KEY `idx_content_blocks_active` (`is_active`),
  KEY `idx_content_blocks_dates` (`start_date`,`end_date`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: content_blocks
-- Columns: 14
-- Indexes: 5
-- Foreign Keys: 0

