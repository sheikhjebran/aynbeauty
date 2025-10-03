-- Migration: update_users_for_auth
-- Created: 2025-10-03T18:36:19.237Z
-- Description: Update users table to support OTP authentication and mobile field

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Add mobile field if it doesn't exist (rename phone to mobile for consistency)
ALTER TABLE users 
CHANGE COLUMN phone mobile VARCHAR(20),
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(10),
ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;

-- Create product_reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_review (user_id, product_id)
);
