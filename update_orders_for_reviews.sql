-- SQL script to set up review system for testing
-- Run this in your MySQL database to enable review testing

-- Add rating columns to products table if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0;

-- Update some orders to delivered status for review testing
UPDATE orders 
SET status = 'delivered' 
WHERE id IN (
  SELECT order_id FROM (
    SELECT id as order_id FROM orders 
    ORDER BY created_at DESC 
    LIMIT 3
  ) as temp
);

-- Check the updated orders
SELECT id, user_id, status, total_amount, created_at 
FROM orders 
WHERE status = 'delivered';

-- Check products table structure
DESCRIBE products;