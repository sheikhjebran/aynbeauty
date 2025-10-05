-- Migration: Create marketing_campaigns table
-- Generated: 2025-10-05T16:03:29.382Z

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

-- Table: marketing_campaigns
-- Columns: 26
-- Indexes: 6
-- Foreign Keys: 1

