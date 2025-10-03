-- Migration: add_phone_column
-- Created: 2025-10-03T19:21:05.000Z
-- Description: Add phone column to users table

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Add phone column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
