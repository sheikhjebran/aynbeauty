-- Migration: create_campaigns_tables
-- Created: 2025-10-01T04:18:52.993Z
-- Description: Create campaigns and marketing_campaigns tables for promotional content

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Campaigns Table (for promotional banners and offers)
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  banner_url VARCHAR(500),
  type ENUM('banner', 'offer', 'promotion', 'sale') DEFAULT 'banner',
  status ENUM('draft', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
  target_audience ENUM('all', 'new_customers', 'existing_customers', 'vip', 'segment') DEFAULT 'all',
  discount_type ENUM('percentage', 'fixed', 'bogo', 'free_shipping') NULL,
  discount_value DECIMAL(10,2) NULL,
  minimum_amount DECIMAL(10,2) NULL,
  maximum_discount DECIMAL(10,2) NULL,
  coupon_code VARCHAR(50) NULL,
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

-- Marketing Campaigns Table (for email/SMS marketing)
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('email', 'sms', 'push', 'social', 'mixed') DEFAULT 'email',
  status ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled') DEFAULT 'draft',
  template_id INT NULL,
  subject VARCHAR(255) NULL,
  content TEXT,
  sender_name VARCHAR(100) NULL,
  sender_email VARCHAR(255) NULL,
  target_segment ENUM('all', 'new_customers', 'active_customers', 'inactive_customers', 'vip', 'custom') DEFAULT 'all',
  target_criteria JSON NULL,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,
  conversion_count INT DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
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
