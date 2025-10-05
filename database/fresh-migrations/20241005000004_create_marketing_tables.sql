-- Fresh Migration 4: Marketing and Campaign Tables
-- This migration creates marketing functionality tables

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('fixed', 'percentage') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0.00,
  maximum_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupons_code (code),
  INDEX idx_coupons_active (is_active),
  INDEX idx_coupons_dates (starts_at, expires_at)
);

-- Create order_coupons table
CREATE TABLE IF NOT EXISTS order_coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  coupon_id INT NOT NULL,
  coupon_code VARCHAR(50) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_coupons_order (order_id),
  INDEX idx_order_coupons_coupon (coupon_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  banner_url VARCHAR(500),
  type ENUM('banner', 'offer', 'promotion', 'sale') DEFAULT 'banner',
  status ENUM('draft', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
  target_audience ENUM('all', 'new_customers', 'existing_customers', 'vip', 'segment') DEFAULT 'all',
  discount_type ENUM('percentage', 'fixed', 'bogo', 'free_shipping'),
  discount_value DECIMAL(10,2),
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  coupon_code VARCHAR(50),
  priority INT DEFAULT 0,
  click_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  conversion_count INT DEFAULT 0,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  INDEX idx_campaigns_status (status),
  INDEX idx_campaigns_type (type),
  INDEX idx_campaigns_dates (start_date, end_date),
  INDEX idx_campaigns_priority (priority),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create content_blocks table
CREATE TABLE IF NOT EXISTS content_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  page_location VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  link_url VARCHAR(500),
  link_text VARCHAR(100),
  image_url VARCHAR(500),
  button_color VARCHAR(7) DEFAULT '#ec4899',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_content_blocks_location (page_location),
  INDEX idx_content_blocks_active (is_active),
  INDEX idx_content_blocks_dates (start_date, end_date)
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('email', 'sms', 'push', 'social', 'mixed') DEFAULT 'email',
  status ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled') DEFAULT 'draft',
  template_id INT,
  subject VARCHAR(255),
  content TEXT,
  sender_name VARCHAR(100),
  sender_email VARCHAR(255),
  target_segment ENUM('all', 'new_customers', 'active_customers', 'inactive_customers', 'vip', 'custom') DEFAULT 'all',
  target_criteria LONGTEXT,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,
  conversion_count INT DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0.00,
  scheduled_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  INDEX idx_marketing_campaigns_status (status),
  INDEX idx_marketing_campaigns_type (type),
  INDEX idx_marketing_campaigns_scheduled (scheduled_at),
  INDEX idx_marketing_campaigns_segment (target_segment),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);