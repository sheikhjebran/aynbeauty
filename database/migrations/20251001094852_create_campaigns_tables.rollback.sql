-- Rollback: create_campaigns_tables
-- Created: 2025-10-01T04:18:52.993Z
-- Description: Drop campaigns and marketing_campaigns tables and related tables

-- ============================================
-- Add your rollback SQL statements below
-- ============================================

-- Drop tables in reverse order to handle foreign key constraints
DROP TABLE IF EXISTS campaign_ab_tests;
DROP TABLE IF EXISTS campaign_analytics;
DROP TABLE IF EXISTS campaign_recipients;
DROP TABLE IF EXISTS marketing_campaigns;
DROP TABLE IF EXISTS campaigns;
