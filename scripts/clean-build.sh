#!/bin/bash

echo "=== Clean Build Script ==="
echo "This will completely clean and rebuild the app"
echo ""

cd /var/www/aynbeauty || exit 1

echo "=== Step 1: Stop PM2 ==="
pm2 stop aynbeauty 2>/dev/null || echo "Not running"
pm2 delete aynbeauty 2>/dev/null || echo "Not in PM2"
sleep 2
echo ""

echo "=== Step 2: Kill processes on port 3000 ==="
PIDS=$(lsof -ti :3000 2>/dev/null)
if [ ! -z "$PIDS" ]; then
    echo "Killing: $PIDS"
    kill -9 $PIDS 2>/dev/null
    sleep 1
fi
echo ""

echo "=== Step 3: Force remove .next directory ==="
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    # First, try to remove the export directory specifically
    if [ -d ".next/export" ]; then
        echo "Removing .next/export..."
        rm -rf .next/export
    fi
    # Then remove the entire .next directory
    rm -rf .next
    echo "✓ .next removed"
else
    echo "No .next directory to remove"
fi

# Double check it's gone
if [ -d ".next" ]; then
    echo "⚠ .next still exists, forcing removal..."
    chmod -R 777 .next 2>/dev/null
    rm -rf .next
    if [ -d ".next" ]; then
        echo "✗ Cannot remove .next directory!"
        echo "Manual cleanup required: sudo rm -rf .next"
        exit 1
    fi
fi
echo ""

echo "=== Step 4: Clear npm cache ==="
npm cache clean --force 2>/dev/null || echo "Cache already clean"
echo ""

echo "=== Step 5: Verify clean state ==="
if [ ! -d ".next" ]; then
    echo "✓ Clean state confirmed"
else
    echo "✗ .next directory still exists!"
    exit 1
fi
echo ""

echo "=== Step 6: Build the app ==="
echo "This will take 2-3 minutes..."
NODE_ENV=production npm run build
BUILD_EXIT=$?

if [ $BUILD_EXIT -ne 0 ]; then
    echo ""
    echo "✗ Build failed with exit code: $BUILD_EXIT"
    echo "Check the errors above"
    exit 1
fi

echo ""
echo "✓ Build completed successfully!"
echo ""

echo "=== Step 7: Verify build artifacts ==="
if [ ! -d ".next/standalone" ]; then
    echo "✗ .next/standalone not created!"
    exit 1
fi

if [ ! -f ".next/standalone/server.js" ]; then
    echo "✗ server.js not found!"
    exit 1
fi

echo "✓ Build artifacts verified:"
ls -lh .next/standalone/server.js
echo ""

echo "=== Step 8: Copy static files ==="
if [ -d "public" ]; then
    echo "Copying public files..."
    cp -r public .next/standalone/ 2>/dev/null || echo "Public copy skipped"
fi

if [ -d ".next/static" ]; then
    echo "Copying static files..."
    cp -r .next/static .next/standalone/.next/ 2>/dev/null || echo "Static copy skipped"
fi
echo ""

echo "=== Step 9: Start PM2 ==="
pm2 start ecosystem.config.js
echo ""

echo "=== Step 10: Wait for startup ==="
echo "Waiting 15 seconds for app to initialize..."
for i in {15..1}; do
    echo -ne "\rWaiting... $i seconds "
    sleep 1
done
echo ""
echo ""

echo "=== Step 11: Verify port 3000 ==="
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is ACTIVE!"
    lsof -i :3000 | grep LISTEN
else
    echo "✗ Port 3000 NOT listening!"
    echo "Checking PM2 logs..."
    pm2 logs aynbeauty --lines 30 --nostream
    exit 1
fi
echo ""

echo "=== Step 12: Test health endpoint ==="
for i in {1..5}; do
    echo "Attempt $i/5..."
    RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/health)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✓ Health endpoint responding!"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
        break
    else
        echo "Got HTTP $HTTP_CODE"
        if [ $i -eq 5 ]; then
            echo "✗ Health check failed after 5 attempts"
            pm2 logs aynbeauty --lines 20 --nostream
        fi
        sleep 2
    fi
done
echo ""

echo "=== Step 13: Test main page ==="
curl -I http://localhost:3000 2>&1 | head -10
echo ""

echo "=== Step 14: Check for digest errors ==="
if pm2 logs aynbeauty --lines 50 --nostream 2>&1 | grep -i "digest" > /dev/null; then
    echo "⚠ WARNING: Digest errors detected!"
    pm2 logs aynbeauty --err --lines 20 --nostream | grep -i "digest" -A 3
else
    echo "✓ No digest errors found"
fi
echo ""

echo "=== Step 15: Reload nginx ==="
nginx -t && systemctl reload nginx
echo ""

echo "=== ✓ Clean Build Complete! ==="
echo ""
echo "Final status:"
pm2 list
echo ""
echo "Recent logs:"
pm2 logs aynbeauty --lines 10 --nostream
echo ""
echo "Test URLs:"
echo "  - http://localhost:3000/api/health"
echo "  - http://66.116.199.206"
echo "  - https://aynbeauty.in"
echo ""
echo "Monitor with: pm2 logs aynbeauty"
