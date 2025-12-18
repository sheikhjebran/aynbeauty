#!/bin/bash

# Quick Fix for 404 Static Assets
# Run this on production server at /var/www/aynbeauty

echo "=== Quick Static Assets Fix ==="
echo ""

# Stop app
pm2 stop aynbeauty

# Pull changes
git pull origin main

# Clean and rebuild
rm -rf .next
npm install
npm run build

# Verify structure
if [ -d ".next/standalone/.next/static" ] && [ -d ".next/standalone/public" ]; then
    echo "✓ Static assets copied successfully"
else
    echo "✗ Static assets NOT copied - running manual copy..."
    
    # Manual fallback
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/
    cp -r public .next/standalone/
    
    if [ -d ".next/standalone/.next/static" ] && [ -d ".next/standalone/public" ]; then
        echo "✓ Manual copy successful"
    else
        echo "✗ Manual copy failed!"
        exit 1
    fi
fi

# Restart
pm2 restart aynbeauty

echo ""
echo "✓ Complete! Check with: pm2 logs aynbeauty"
