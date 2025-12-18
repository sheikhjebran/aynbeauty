#!/bin/bash

echo "=== Complete Fix: Nginx + Next.js Deployment ==="
echo "This will fix both nginx conflicts and start Next.js"
echo ""

cd /var/www/aynbeauty || exit 1

echo "=== PART 1: Fix Nginx Duplicate Configs ==="
echo ""

if [ "$EUID" -eq 0 ]; then
    echo "Step 1: Remove duplicate nginx config..."
    rm -f /etc/nginx/sites-enabled/ayn-beauty
    rm -f /etc/nginx/sites-available/ayn-beauty
    echo "✓ Removed duplicate from sites-enabled"
    
    echo ""
    echo "Step 2: Test nginx..."
    nginx -t
    if [ $? -eq 0 ]; then
        echo "✓ Nginx config valid"
        systemctl reload nginx
        echo "✓ Nginx reloaded"
    fi
    echo ""
else
    echo "⚠ Not running as root - skipping nginx fix"
    echo "Run this part manually: sudo bash scripts/fix-duplicate-nginx.sh"
    echo ""
fi

echo "=== PART 2: Deploy Code Fixes ==="
echo ""

echo "Step 1: Check git status..."
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Updates available, pulling..."
    git pull origin main
    echo "✓ Code updated"
else
    echo "Already up to date (you may need to git push from your local machine)"
fi
echo ""

echo "Step 2: Verify SSR fixes are present..."
if grep -q "typeof window !== 'undefined'" src/contexts/AuthContext.tsx; then
    echo "✓ AuthContext has SSR safety checks"
else
    echo "⚠ AuthContext missing SSR safety checks - make sure you pushed your changes!"
fi
echo ""

echo "=== PART 3: Rebuild and Start Next.js ==="
echo ""

echo "Step 1: Stop PM2..."
pm2 stop aynbeauty 2>/dev/null
pm2 delete aynbeauty 2>/dev/null
sleep 2

echo ""
echo "Step 2: Clean build directory..."
rm -rf .next/export 2>/dev/null
rm -rf .next
echo "✓ Clean"

echo ""
echo "Step 3: Build (takes 2-3 minutes)..."
NODE_ENV=production npm run build

if [ $? -ne 0 ] || [ ! -f ".next/standalone/server.js" ]; then
    echo "✗ Build failed!"
    exit 1
fi
echo "✓ Build successful"

echo ""
echo "Step 4: Start PM2..."
pm2 start ecosystem.config.js
sleep 5

echo ""
echo "Step 5: Wait for startup..."
echo "Waiting 15 seconds..."
for i in {15..1}; do
    printf "\r%2d seconds remaining..." $i
    sleep 1
done
echo ""

echo ""
echo "=== PART 4: Verification ==="
echo ""

echo "Check 1: Port 3000 status..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 ACTIVE!"
else
    echo "✗ Port 3000 NOT active"
    echo "Checking logs..."
    pm2 logs aynbeauty --lines 30 --nostream
    exit 1
fi

echo ""
echo "Check 2: Health endpoint..."
for i in {1..5}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✓ Health endpoint responding!"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "✗ Health endpoint not responding"
    fi
    sleep 2
done

echo ""
echo "Check 3: Test through nginx..."
RESPONSE=$(curl -I -s http://localhost)
if echo "$RESPONSE" | grep -q "200 OK"; then
    echo "✓ Nginx proxy working!"
elif echo "$RESPONSE" | grep -q "502"; then
    echo "✗ Still getting 502"
    echo "Showing recent logs..."
    pm2 logs aynbeauty --lines 20 --nostream
else
    echo "Response:"
    echo "$RESPONSE" | head -5
fi

echo ""
echo "Check 4: Monitor for digest errors (30 seconds)..."
(timeout 30 pm2 logs aynbeauty 2>&1 || true) | grep -i "digest" && echo "⚠ Digest errors detected!" || echo "✓ No digest errors!"

echo ""
echo "=== Summary ==="
echo ""

if [ "$EUID" -eq 0 ]; then
    echo "✓ Nginx duplicate configs fixed"
else
    echo "⚠ Nginx not fixed (need sudo)"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Next.js running on port 3000"
else
    echo "✗ Next.js NOT running"
fi

pm2 list

echo ""
echo "Test URLs:"
echo "  http://66.116.199.206"
echo "  https://aynbeauty.in"
echo ""
echo "Monitor: pm2 logs aynbeauty"
