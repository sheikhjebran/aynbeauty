-- Rollback: insert_sample_campaigns
-- Created: 2025-10-01T04:21:03.097Z
-- Description: Remove sample campaigns data

-- ============================================
-- Add your rollback SQL statements below
-- ============================================

-- Remove sample campaigns
DELETE FROM campaigns WHERE id IN (1, 2, 3, 4, 5);

-- Reset auto increment
ALTER TABLE campaigns AUTO_INCREMENT = 1;
