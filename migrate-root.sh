#!/bin/bash

# AynBeauty Root Database Migration Script
# Run this with root MySQL privileges

echo "🚀 AynBeauty Database Migration with Root Privileges"
echo "================================================="

# Get root password
read -s -p "Enter MySQL root password: " ROOT_PASSWORD
echo ""

# Create database and grant permissions
echo "🗄️  Creating database and setting permissions..."

mysql -u root -p"$ROOT_PASSWORD" << 'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS aynbeauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to ayn user
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'localhost';
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'127.0.0.1';
GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES LIKE 'aynbeauty';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database created and permissions granted successfully!"
    echo ""
    echo "🚀 Now running table migration..."
    npm run migrate:production
else
    echo "❌ Failed to create database. Please check root password."
    exit 1
fi