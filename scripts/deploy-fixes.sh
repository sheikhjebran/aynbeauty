#!/bin/bash

echo "=== AynBeauty Deployment Script ==="
echo "This will deploy the digest error fixes"
echo ""

# Change to app directory
cd /var/www/aynbeauty || exit 1

echo "=== Step 1: Backup current build ==="
if [ -d ".next" ]; then
    echo "Creating backup..."
    cp -r .next .next.backup.$(date +%Y%m%d_%H%M%S)
    echo "✓ Backup created"
fi
echo ""

echo "=== Step 2: Pull latest code from git ==="
git fetch origin
git status
echo ""
read -p "Pull latest changes from main branch? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git pull origin main
    echo "✓ Code updated"
else
    echo "Skipping git pull"
fi
echo ""

echo "=== Step 3: Check if package.json changed ==="
if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
    echo "package.json changed, running npm install..."
    npm install
else
    echo "package.json unchanged, skipping npm install"
fi
echo ""

echo "=== Step 4: Stop PM2 ==="
pm2 stop aynbeauty
sleep 2
echo ""

echo "=== Step 5: Clean old build ==="
echo "Removing old .next directory..."
rm -rf .next
echo "✓ Clean complete"
echo ""

echo "=== Step 6: Build with fixes ==="
echo "This may take a few minutes..."
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Build failed!"
    echo "Restoring backup..."
    if [ -d ".next.backup."* ]; then
        mv .next.backup.* .next
    fi
    pm2 restart aynbeauty
    exit 1
fi
echo "✓ Build successful"
echo ""

echo "=== Step 7: Verify build ==="
if [ ! -f ".next/standalone/server.js" ]; then
    echo "✗ server.js not found! Build may have failed."
    exit 1
fi
echo "✓ server.js exists"
echo ""

echo "=== Step 8: Start PM2 ==="
pm2 restart aynbeauty
sleep 3
echo ""

echo "=== Step 9: Wait for app to start ==="
echo "Waiting 10 seconds for app to initialize..."
for i in {10..1}; do
    echo -ne "\rWaiting... $i seconds "
    sleep 1
done
echo ""
echo ""

echo "=== Step 10: Check if port 3000 is listening ==="
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is active!"
    lsof -i :3000
else
    echo "✗ Port 3000 is NOT active!"
    echo "Checking PM2 logs..."
    pm2 logs aynbeauty --lines 50 --nostream
    exit 1
fi
echo ""

echo "=== Step 11: Test health endpoint ==="
for i in {1..5}; do
    echo "Attempt $i/5..."
    HEALTH=$(curl -s http://localhost:3000/api/health)
    if [ $? -eq 0 ]; then
        echo "✓ Health endpoint responding!"
        echo "$HEALTH" | jq '.' 2>/dev/null || echo "$HEALTH"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "✗ Health endpoint not responding"
        pm2 logs aynbeauty --lines 30 --nostream
    fi
    sleep 2
done
echo ""

echo "=== Step 12: Test main page ==="
curl -I http://localhost:3000 2>&1 | head -10
echo ""

echo "=== Step 13: Reload nginx ==="
nginx -t && systemctl reload nginx
echo ""

echo "=== Step 14: Check for digest errors ==="
echo "Checking recent logs for digest errors..."
if pm2 logs aynbeauty --lines 100 --nostream | grep -q "digest"; then
    echo "⚠ WARNING: Digest errors still present!"
    pm2 logs aynbeauty --lines 20 --nostream | grep -A 5 "digest"
else
    echo "✓ No digest errors found in recent logs"
fi
echo ""

echo "=== Deployment Complete! ==="
echo ""
echo "Final status:"
pm2 status
echo ""
echo "Test URLs:"
echo "  - http://localhost:3000/api/health"
echo "  - http://66.116.199.206"
echo "  - https://aynbeauty.in"
echo ""
echo "Monitor logs with: pm2 logs aynbeauty"
echo "If issues persist, check logs: pm2 logs aynbeauty --lines 100"
