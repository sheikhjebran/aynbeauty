-- Complete Database Schema Deployment
-- Generated: 2025-10-05T16:03:54.612Z
-- Database: aynbeauty

-- Disable foreign key checks for clean deployment
SET FOREIGN_KEY_CHECKS = 0;

-- Source: 20251005T160354.369Z_create_brands_table.sql
-- Migration: Create brands table
-- Generated: 2025-10-05T16:03:54.385Z

DROP TABLE IF EXISTS `brands`;

CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_brands_slug` (`slug`),
  KEY `idx_brands_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: brands
-- Columns: 10
-- Indexes: 4
-- Foreign Keys: 0


-- Source: 20251005T160354.369Z_insert_brands_data.sql
-- Sample data for brands
-- Generated: 2025-10-05T16:03:54.388Z

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo_url`, `website_url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Maybelline', 'maybelline', 'Global makeup brand with innovative products', '/images/brands/maybelline.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(2, 'L''Oreal', 'loreal', 'Leading beauty brand with premium products', '/images/brands/loreal.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(3, 'Lakme', 'lakme', 'India''s premier beauty brand', '/images/brands/lakme.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(4, 'MAC', 'mac', 'Professional makeup artistry brand', '/images/brands/mac.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(5, 'Nykaa', 'nykaa', 'India''s own beauty brand', '/images/brands/nykaa.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44');


-- Source: 20251005T160354.369Z_create_campaigns_table.sql
-- Migration: Create campaigns table
-- Generated: 2025-10-05T16:03:54.400Z

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


-- Source: 20251005T160354.369Z_insert_campaigns_data.sql
-- Sample data for campaigns
-- Generated: 2025-10-05T16:03:54.401Z

INSERT INTO `campaigns` (`id`, `title`, `description`, `image_url`, `banner_url`, `type`, `status`, `target_audience`, `discount_type`, `discount_value`, `minimum_amount`, `maximum_discount`, `coupon_code`, `priority`, `click_count`, `view_count`, `conversion_count`, `start_date`, `end_date`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'Summer Beauty Sale', 'Up to 50% off on all makeup products', '/images/campaigns/summer-sale.jpg', '/images/banners/summer-sale-banner.jpg', 'sale', 'active', 'all', 'percentage', '50.00', NULL, NULL, 'SUMMER50', 1, 0, 0, 0, '2025-08-31 18:30:00', '2025-12-31 18:29:59', '2025-10-05 14:06:44', '2025-10-05 14:06:44', NULL),
(2, 'New Arrivals Showcase', 'Discover the latest beauty trends', '/images/campaigns/new-arrivals.jpg', '/images/banners/new-arrivals-banner.jpg', 'banner', 'active', 'all', NULL, NULL, NULL, NULL, NULL, 2, 0, 0, 0, '2025-09-30 18:30:00', '2025-11-30 18:29:59', '2025-10-05 14:06:44', '2025-10-05 14:06:44', NULL),
(3, 'Free Shipping Weekend', 'Free shipping on orders above ₹999', '/images/campaigns/free-shipping.jpg', '/images/banners/free-shipping-banner.jpg', 'offer', 'active', 'all', 'free_shipping', '0.00', NULL, NULL, 'FREESHIP', 3, 0, 0, 0, '2025-09-30 18:30:00', '2025-10-07 18:29:59', '2025-10-05 14:06:44', '2025-10-05 14:06:44', NULL),
(4, 'VIP Member Exclusive', 'Exclusive offers for VIP members', '/images/campaigns/vip-exclusive.jpg', '/images/banners/vip-banner.jpg', 'promotion', 'active', 'vip', 'percentage', '25.00', NULL, NULL, 'VIP25', 1, 0, 0, 0, '2025-09-30 18:30:00', '2025-12-31 18:29:59', '2025-10-05 14:06:44', '2025-10-05 14:06:44', NULL),
(5, 'Diwali Special', 'Festive beauty collection', '/images/campaigns/diwali-special.jpg', '/images/banners/diwali-banner.jpg', 'sale', 'active', 'all', 'percentage', '30.00', NULL, NULL, 'DIWALI30', 2, 0, 0, 0, '2025-10-14 18:30:00', '2025-11-15 18:29:59', '2025-10-05 14:06:44', '2025-10-05 14:06:44', NULL);


-- Source: 20251005T160354.369Z_create_cart_items_table.sql
-- Migration: Create cart_items table
-- Generated: 2025-10-05T16:03:54.411Z

DROP TABLE IF EXISTS `cart_items`;

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cart_items_user` (`user_id`),
  KEY `idx_cart_items_session` (`session_id`),
  KEY `idx_cart_items_product` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: cart_items
-- Columns: 8
-- Indexes: 4
-- Foreign Keys: 2


-- Source: 20251005T160354.369Z_create_categories_table.sql
-- Migration: Create categories table
-- Generated: 2025-10-05T16:03:54.421Z

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_active` (`is_active`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: categories
-- Columns: 10
-- Indexes: 5
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_insert_categories_data.sql
-- Sample data for categories
-- Generated: 2025-10-05T16:03:54.422Z

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `parent_id`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(8, 'Skincare', 'skincare', 'Complete skincare solutions for all skin types', '/images/categories/skincare.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(9, 'Lips', 'lips', 'Lip makeup and care products', '/images/categories/lips.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(10, 'Bath and Body', 'bath-and-body', 'Luxurious bath and body care products', '/images/categories/bath-body.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(11, 'Fragrances', 'fragrances', 'Premium fragrances for every occasion', '/images/categories/fragrances.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(12, 'Eyes', 'eyes', 'Eye makeup and care products', '/images/categories/eyes.jpg', NULL, 1, 0, '2025-10-05 14:06:44', '2025-10-05 14:06:44');


-- Source: 20251005T160354.369Z_create_content_blocks_table.sql
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


-- Source: 20251005T160354.369Z_insert_content_blocks_data.sql
-- Sample data for content_blocks
-- Generated: 2025-10-05T16:03:54.435Z

INSERT INTO `content_blocks` (`id`, `title`, `content`, `page_location`, `display_order`, `is_active`, `start_date`, `end_date`, `link_url`, `link_text`, `image_url`, `button_color`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to AYN Beauty', 'Discover premium beauty products from top brands. Transform your beauty routine with our curated collection.', 'homepage_banner', 1, 1, NULL, NULL, '/products', 'Shop Now', '/images/banners/welcome-banner.jpg', '#ec4899', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(2, 'New Arrivals', 'Check out our latest beauty collection featuring the newest products from your favorite brands.', 'homepage_banner', 2, 1, NULL, NULL, '/products?new=true', 'Explore New', '/images/banners/new-arrivals.jpg', '#ec4899', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(3, 'Special Offers', 'Up to 30% off on selected items. Limited time offer on premium beauty products.', 'homepage_banner', 3, 1, NULL, NULL, '/offers', 'Shop Offers', '/images/banners/special-offers.jpg', '#ec4899', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(4, 'Beauty Tips', 'Get expert beauty tips and tutorials from professional makeup artists.', 'homepage_section', 4, 1, NULL, NULL, '/blog', 'Read More', '/images/banners/beauty-tips.jpg', '#ec4899', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(5, 'Virtual Try-On', 'Try products virtually with our AI-powered virtual try-on technology.', 'homepage_feature', 5, 1, NULL, NULL, '/virtual-tryon', 'Try Now', '/images/banners/virtual-tryon.jpg', '#ec4899', '2025-10-05 14:06:44', '2025-10-05 14:06:44');


-- Source: 20251005T160354.369Z_create_coupons_table.sql
-- Migration: Create coupons table
-- Generated: 2025-10-05T16:03:54.446Z

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

-- Table: coupons
-- Columns: 15
-- Indexes: 6
-- Foreign Keys: 0


-- Source: 20251005T160354.369Z_insert_coupons_data.sql
-- Sample data for coupons
-- Generated: 2025-10-05T16:03:54.448Z

INSERT INTO `coupons` (`id`, `code`, `name`, `description`, `type`, `value`, `minimum_amount`, `maximum_discount`, `usage_limit`, `used_count`, `is_active`, `starts_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', '10.00', '500.00', NULL, 100, 0, 1, '2025-09-30 22:45:55', '2025-10-30 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(2, 'SAVE500', 'Flat 500 Off', 'Get flat ₹500 off on orders above ₹2000', 'fixed', '500.00', '2000.00', NULL, 50, 0, 1, '2025-09-30 22:45:55', '2025-10-15 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(3, 'BEAUTY20', 'Beauty Special', 'Get 20% off on all makeup products', 'percentage', '20.00', '1000.00', NULL, 200, 0, 1, '2025-09-30 22:45:55', '2025-11-14 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44');


-- Source: 20251005T160354.369Z_create_marketing_campaigns_table.sql
-- Migration: Create marketing_campaigns table
-- Generated: 2025-10-05T16:03:54.457Z

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


-- Source: 20251005T160354.369Z_create_migrations_table.sql
-- Migration: Create migrations table
-- Generated: 2025-10-05T16:03:54.468Z

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: migrations
-- Columns: 4
-- Indexes: 2
-- Foreign Keys: 0


-- Source: 20251005T160354.369Z_insert_migrations_data.sql
-- Sample data for migrations
-- Generated: 2025-10-05T16:03:54.470Z

INSERT INTO `migrations` (`id`, `filename`, `batch`, `executed_at`) VALUES
(1, '20241005000001_create_core_tables.sql', 1, '2025-10-05 14:06:44'),
(2, '20241005000002_create_ecommerce_tables.sql', 2, '2025-10-05 14:06:44'),
(3, '20241005000003_create_product_tables.sql', 3, '2025-10-05 14:06:44'),
(4, '20241005000004_create_marketing_tables.sql', 4, '2025-10-05 14:06:44'),
(5, '20241005000005_insert_sample_data.sql', 5, '2025-10-05 14:06:44');


-- Source: 20251005T160354.369Z_create_order_coupons_table.sql
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


-- Source: 20251005T160354.369Z_create_order_items_table.sql
-- Migration: Create order_items table
-- Generated: 2025-10-05T16:03:54.490Z

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_sku` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: order_items
-- Columns: 9
-- Indexes: 3
-- Foreign Keys: 2


-- Source: 20251005T160354.369Z_create_orders_table.sql
-- Migration: Create orders table
-- Generated: 2025-10-05T16:03:54.502Z

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded','partially_refunded') DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `shipping_amount` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `billing_address` longtext DEFAULT NULL,
  `shipping_address` longtext DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_number` (`order_number`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: orders
-- Columns: 18
-- Indexes: 6
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_create_payments_table.sql
-- Migration: Create payments table
-- Generated: 2025-10-05T16:03:54.514Z

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('credit_card','debit_card','upi','net_banking','wallet','cod') NOT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `status` enum('pending','processing','completed','failed','cancelled','refunded') DEFAULT 'pending',
  `gateway_response` longtext DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_payments_order` (`order_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_transaction` (`transaction_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: payments
-- Columns: 13
-- Indexes: 4
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_create_product_attributes_table.sql
-- Migration: Create product_attributes table
-- Generated: 2025-10-05T16:03:54.523Z

DROP TABLE IF EXISTS `product_attributes`;

CREATE TABLE `product_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_value` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_product_attributes_product` (`product_id`),
  KEY `idx_product_attributes_name` (`attribute_name`),
  CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: product_attributes
-- Columns: 5
-- Indexes: 3
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_create_product_images_table.sql
-- Migration: Create product_images table
-- Generated: 2025-10-05T16:03:54.534Z

DROP TABLE IF EXISTS `product_images`;

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product` (`product_id`),
  KEY `idx_product_images_primary` (`is_primary`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: product_images
-- Columns: 7
-- Indexes: 3
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_insert_product_images_data.sql
-- Sample data for product_images
-- Generated: 2025-10-05T16:03:54.535Z

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `sort_order`, `is_primary`, `created_at`) VALUES
(1, 1, '/uploads/products/product_1759679865109_lpd18aggd3_0.jpeg', NULL, 0, 1, '2025-10-05 15:57:45');


-- Source: 20251005T160354.369Z_create_product_reviews_table.sql
-- Migration: Create product_reviews table
-- Generated: 2025-10-05T16:03:54.546Z

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: product_reviews
-- Columns: 13
-- Indexes: 6
-- Foreign Keys: 3


-- Source: 20251005T160354.369Z_create_products_table.sql
-- Migration: Create products table
-- Generated: 2025-10-05T16:03:54.560Z

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `min_stock_level` int(11) DEFAULT 5,
  `weight` decimal(8,2) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_digital` tinyint(1) DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_trending` tinyint(1) DEFAULT 0,
  `is_must_have` tinyint(1) DEFAULT 0,
  `is_new_arrival` tinyint(1) DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL,
  `primary_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_products_slug` (`slug`),
  KEY `idx_products_sku` (`sku`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_brand` (`brand_id`),
  KEY `idx_products_featured` (`is_featured`),
  KEY `idx_products_active` (`is_active`),
  KEY `idx_products_price` (`price`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: products
-- Columns: 27
-- Indexes: 10
-- Foreign Keys: 2


-- Source: 20251005T160354.369Z_insert_products_data.sql
-- Sample data for products
-- Generated: 2025-10-05T16:03:54.562Z

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `short_description`, `sku`, `price`, `discounted_price`, `cost_price`, `category_id`, `brand_id`, `stock_quantity`, `min_stock_level`, `weight`, `dimensions`, `is_active`, `is_featured`, `is_digital`, `meta_title`, `meta_description`, `created_at`, `updated_at`, `is_trending`, `is_must_have`, `is_new_arrival`, `image_url`, `primary_image`) VALUES
(1, 'Test', 'test', 'asd asfasf ', NULL, NULL, '100.00', '100.00', NULL, 8, NULL, 100, 5, NULL, NULL, 1, 0, 0, NULL, NULL, '2025-10-05 15:57:45', '2025-10-05 15:57:45', 1, 0, 0, '/uploads/products/product_1759679865109_lpd18aggd3_0.jpeg', '/uploads/products/product_1759679865109_lpd18aggd3_0.jpeg');


-- Source: 20251005T160354.369Z_create_user_addresses_table.sql
-- Migration: Create user_addresses table
-- Generated: 2025-10-05T16:03:54.575Z

DROP TABLE IF EXISTS `user_addresses`;

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('billing','shipping') DEFAULT 'shipping',
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'India',
  `phone` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_addresses_user` (`user_id`),
  KEY `idx_user_addresses_type` (`type`),
  CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: user_addresses
-- Columns: 16
-- Indexes: 3
-- Foreign Keys: 1


-- Source: 20251005T160354.369Z_create_users_table.sql
-- Migration: Create users table
-- Generated: 2025-10-05T16:03:54.586Z

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` enum('customer','admin','staff') DEFAULT 'customer',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_verification_token` varchar(10) DEFAULT NULL,
  `email_verification_expires` timestamp NULL DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: users
-- Columns: 21
-- Indexes: 5
-- Foreign Keys: 0


-- Source: 20251005T160354.369Z_insert_users_data.sql
-- Sample data for users
-- Generated: 2025-10-05T16:03:54.589Z

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `mobile`, `date_of_birth`, `gender`, `avatar_url`, `is_active`, `is_verified`, `email_verified_at`, `role`, `last_login_at`, `created_at`, `updated_at`, `email_verification_token`, `email_verification_expires`, `last_login`, `email_verified`, `phone`) VALUES
(3, 'admin@aynbeauty.com', '$2a$10$5Z0RCs6UEN9Divp0BZTsr.l6EHNbaFFxmVwteDlOsPpuEuaWZuUo.', 'Admin', 'User', NULL, NULL, NULL, NULL, 1, 1, NULL, 'admin', NULL, '2025-10-05 14:06:44', '2025-10-05 15:55:36', NULL, NULL, '2025-10-05 15:55:36', 1, NULL);


-- Source: 20251005T160354.369Z_create_wishlist_items_table.sql
-- Migration: Create wishlist_items table
-- Generated: 2025-10-05T16:03:54.600Z

DROP TABLE IF EXISTS `wishlist_items`;

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: wishlist_items
-- Columns: 5
-- Indexes: 5
-- Foreign Keys: 2


-- Source: 20251005T160354.369Z_create_wishlists_table.sql
-- Migration: Create wishlists table
-- Generated: 2025-10-05T16:03:54.610Z

DROP TABLE IF EXISTS `wishlists`;

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `idx_wishlists_user` (`user_id`),
  KEY `idx_wishlists_product` (`product_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: wishlists
-- Columns: 4
-- Indexes: 5
-- Foreign Keys: 2


-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

