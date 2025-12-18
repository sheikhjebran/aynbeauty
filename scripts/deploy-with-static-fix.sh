#!/bin/bash

echo "=============================================="
echo "  Ayn Beauty - Complete Deployment Fix"
echo "=============================================="
echo ""
echo "This script will:"
echo "1. Stop PM2 processes"
echo "2. Clean old build artifacts"
echo "3. Rebuild with static asset copying"
echo "4. Restart PM2"
echo "5. Verify static assets are accessible"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Exit on any error
set -e

PROJECT_DIR="/var/www/aynbeauty"
cd "$PROJECT_DIR"

echo ""
echo "=== Step 1: Stop PM2 ==="
pm2 stop aynbeauty || echo "App not running (this is OK)"
pm2 delete aynbeauty || echo "App not registered (this is OK)"

echo ""
echo "=== Step 2: Clean old build ==="
echo "Removing .next directory..."
rm -rf .next
echo "✓ .next removed"

echo "Removing node_modules/.cache..."
rm -rf node_modules/.cache
echo "✓ Cache cleared"

echo ""
echo "=== Step 3: Rebuild application ==="
echo "Running npm install..."
npm install --production=false

echo ""
echo "Running build with static asset copying..."
npm run build

echo ""
echo "=== Step 4: Verify standalone structure ==="
STANDALONE_DIR=".next/standalone"

if [ ! -f "$STANDALONE_DIR/server.js" ]; then
    echo "✗ server.js not found!"
    exit 1
fi
echo "✓ server.js present"

if [ ! -d "$STANDALONE_DIR/.next/static" ]; then
    echo "✗ .next/static not copied!"
    exit 1
fi
echo "✓ .next/static present"

if [ ! -d "$STANDALONE_DIR/public" ]; then
    echo "✗ public directory not copied!"
    exit 1
fi
echo "✓ public directory present"

# Check for some expected static files
STATIC_COUNT=$(find "$STANDALONE_DIR/.next/static" -type f | wc -l)
PUBLIC_COUNT=$(find "$STANDALONE_DIR/public" -type f | wc -l)

echo ""
echo "Static files: $STATIC_COUNT"
echo "Public files: $PUBLIC_COUNT"

if [ $STATIC_COUNT -lt 10 ]; then
    echo "⚠ Warning: Very few static files found"
fi

echo ""
echo "=== Step 5: Start PM2 ==="
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "Waiting 5 seconds for app to start..."
sleep 5

echo ""
echo "=== Step 6: Check PM2 status ==="
pm2 status

echo ""
echo "=== Step 7: Verify static assets ==="
echo "Testing static asset URLs..."

# Test if app is responding
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✓ API health check passed"
else
    echo "✗ API health check failed"
fi

# Test static file
if curl -s http://localhost:3000/_next/static/ | grep -q "html\|css\|js"; then
    echo "✓ Static files accessible"
else
    echo "⚠ Could not verify static files (may need specific file path)"
fi

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "View logs with:"
echo "  pm2 logs aynbeauty"
echo ""
echo "Check status with:"
echo "  pm2 status"
echo ""
echo "View errors:"
echo "  tail -f /var/www/aynbeauty/logs/aynbeauty-error.log"
echo ""
