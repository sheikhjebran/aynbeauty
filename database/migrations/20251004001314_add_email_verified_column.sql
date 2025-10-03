-- Migration: add_email_verified_column
-- Created: 2025-10-03T19:13:14.000Z
-- Description: Add email_verified column to users table

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Add email_verified column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
