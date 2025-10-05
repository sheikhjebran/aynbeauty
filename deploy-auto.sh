#!/bin/bash

# Auto-deployment script for AynBeauty
# This script pulls latest changes, builds, and restarts the application

echo "🚀 Starting AynBeauty deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Navigate to project directory (if not already there)
cd /var/www/aynbeauty 2>/dev/null || {
    echo "📁 Running from current directory: $(pwd)"
}

# Stop the application gracefully
echo "⏹️ Stopping application..."
pm2 stop aynbeauty 2>/dev/null || echo "Application not running"

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git fetch origin
git reset --hard origin/main

# Copy production environment file
echo "📋 Setting up production environment..."
if [ -f ".env.prod" ]; then
    cp .env.prod .env.local
    echo "✅ Production environment copied"
else
    echo "⚠️ Warning: .env.prod not found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building the application..."
npm run build

# Run database migration if exists
echo "🗄️ Checking for database updates..."
if [ -f "migrate-image-urls.sql" ]; then
    echo "Running image URL migration..."
    # Replace with your actual database credentials
    # mysql -u your_user -p your_db < migrate-image-urls.sql
    echo "⚠️ Please run migrate-image-urls.sql manually if needed"
fi

# Set proper permissions
echo "🔐 Setting file permissions..."
sudo chown -R www-data:www-data . 2>/dev/null || echo "Permission setting skipped (not root)"
chmod -R 755 . 2>/dev/null || true

# Ensure uploads directory exists
echo "📁 Setting up uploads directory..."
mkdir -p public/uploads/products
chmod -R 755 public/uploads 2>/dev/null || true

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 start aynbeauty 2>/dev/null || pm2 restart aynbeauty

# Wait a moment for startup
sleep 3

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

# Test the application
echo "🧪 Testing application health..."
curl -f http://localhost:3000/api/health 2>/dev/null && echo "✅ Health check passed" || echo "⚠️ Health check failed"

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: http://66.116.199.206:3000"
echo ""
echo "📝 Next steps:"
echo "1. Test image upload in admin panel"
echo "2. Verify images appear immediately without restart"
echo "3. Check browser dev tools for no-cache headers"