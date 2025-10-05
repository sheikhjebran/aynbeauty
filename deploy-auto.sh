#!/bin/bash

# Auto-deployment script for AynBeauty
# This script pulls latest changes, builds, and restarts the application

echo "🚀 Starting AynBeauty deployment..."

# Navigate to project directory
cd /var/www/aynbeauty

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart aynbeauty

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: http://66.116.199.206:3000"