-- Migration: Add cleanup history tracking
-- Date: 2025-10-09
-- Description: Add table to track automatic cleanup operations

CREATE TABLE IF NOT EXISTS cleanup_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    files_deleted INT NOT NULL DEFAULT 0,
    files_failed INT NOT NULL DEFAULT 0,
    space_saved BIGINT NOT NULL DEFAULT 0,
    cleanup_type ENUM('manual', 'automatic') DEFAULT 'automatic',
    admin_user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_created_at (created_at),
    INDEX idx_cleanup_type (cleanup_type),
    
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Add some sample data for testing
INSERT INTO cleanup_history (files_deleted, files_failed, space_saved, cleanup_type, created_at) 
VALUES 
(0, 0, 0, 'automatic', NOW()),
(5, 0, 1048576, 'manual', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(12, 1, 2097152, 'automatic', DATE_SUB(NOW(), INTERVAL 3 DAY));