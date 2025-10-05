-- Simple Database Creation Script for AynBeauty
-- Run this manually if you don't have CREATE DATABASE privileges

-- Create the database (run this as MySQL admin/root)
CREATE DATABASE IF NOT EXISTS aynbeauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to the 'ayn' user
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'localhost';
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'127.0.0.1';
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the database was created
SHOW DATABASES LIKE 'aynbeauty';

-- Verify permissions
SHOW GRANTS FOR 'ayn'@'localhost';