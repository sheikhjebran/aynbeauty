#!/bin/bash

echo "=== Quick Recovery Script ==="
echo "Building app and restarting..."
echo ""

cd /var/www/aynbeauty || exit 1

echo "=== Step 1: Stop PM2 ==="
pm2 stop aynbeauty 2>/dev/null || echo "Already stopped"
pm2 delete aynbeauty 2>/dev/null || echo "Not in PM2"
echo ""

echo "=== Step 2: Kill any process on port 3000 ==="
PIDS=$(lsof -ti :3000 2>/dev/null)
if [ ! -z "$PIDS" ]; then
    echo "Killing processes: $PIDS"
    kill -9 $PIDS 2>/dev/null
fi
echo ""

echo "=== Step 3: Build the app ==="
echo "This will take 2-3 minutes..."
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Build failed!"
    echo "Check the error above"
    exit 1
fi
echo "✓ Build complete"
echo ""

echo "=== Step 4: Verify server.js exists ==="
if [ -f ".next/standalone/server.js" ]; then
    echo "✓ server.js found"
    ls -lh .next/standalone/server.js
else
    echo "✗ server.js NOT found!"
    echo "Build may have failed silently"
    exit 1
fi
echo ""

echo "=== Step 5: Start with PM2 ==="
pm2 start ecosystem.config.js
sleep 5
echo ""

echo "=== Step 6: Check status ==="
pm2 list
echo ""

echo "=== Step 7: Wait and test ==="
echo "Waiting 10 seconds..."
sleep 10

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is ACTIVE!"
else
    echo "✗ Port 3000 NOT active"
    echo "Showing logs..."
    pm2 logs aynbeauty --lines 50 --nostream
    exit 1
fi
echo ""

echo "=== Step 8: Test health endpoint ==="
curl -s http://localhost:3000/api/health | jq '.' || echo "Health check failed"
echo ""

echo "=== Step 9: Test main page ==="
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "=== Step 10: Check for errors ==="
echo "Recent error log:"
pm2 logs aynbeauty --err --lines 10 --nostream
echo ""

echo "=== Recovery Complete! ==="
echo ""
echo "If successful, test in browser:"
echo "  - http://66.116.199.206"
echo "  - https://aynbeauty.in"
echo ""
echo "Monitor: pm2 logs aynbeauty"
