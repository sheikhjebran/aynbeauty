#!/bin/bash

echo "=== AynBeauty 502 Fix Script ==="
echo "This script will attempt to fix common 502 errors"
echo ""

# Change to app directory
cd /var/www/aynbeauty || exit 1

echo "=== Step 1: Stop PM2 process ==="
pm2 stop aynbeauty || echo "Process not running"
pm2 delete aynbeauty || echo "Process not found"
echo ""

echo "=== Step 2: Check for port conflicts ==="
PIDS=$(lsof -ti :3000)
if [ ! -z "$PIDS" ]; then
    echo "Found processes using port 3000: $PIDS"
    echo "Killing processes..."
    kill -9 $PIDS
    sleep 2
fi
echo ""

echo "=== Step 3: Verify build exists ==="
if [ ! -d ".next/standalone" ]; then
    echo "✗ .next/standalone not found! Running build..."
    npm run build || {
        echo "✗ Build failed! Check build errors above."
        exit 1
    }
else
    echo "✓ Build exists"
fi
echo ""

echo "=== Step 4: Check .env file ==="
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    echo "✗ No .env file found! Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠ Please edit .env with correct values!"
    else
        echo "✗ No .env.example found either!"
    fi
else
    echo "✓ .env file exists"
fi
echo ""

echo "=== Step 5: Check database connection ==="
if command -v mysql &> /dev/null; then
    mysql -u root -p -e "USE aynbeauty; SELECT COUNT(*) as tables FROM information_schema.tables WHERE table_schema = 'aynbeauty';" 2>/dev/null && echo "✓ Database accessible" || echo "✗ Database connection issue"
else
    echo "⚠ mysql command not found, skipping DB check"
fi
echo ""

echo "=== Step 6: Create logs directory ==="
mkdir -p logs
chmod 755 logs
echo ""

echo "=== Step 7: Start with PM2 ==="
pm2 start ecosystem.config.js
sleep 5
echo ""

echo "=== Step 8: Check PM2 status ==="
pm2 list
echo ""

echo "=== Step 9: Test localhost connection ==="
sleep 3
for i in {1..10}; do
    echo "Attempt $i/10..."
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✓ Server is responding!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "✗ Server not responding after 10 attempts"
        echo "Checking logs..."
        pm2 logs aynbeauty --lines 50 --nostream
    fi
    sleep 2
done
echo ""

echo "=== Step 10: Reload nginx ==="
nginx -t && systemctl reload nginx
echo ""

echo "=== Step 11: Final status ==="
pm2 status
echo ""
echo "=== Testing endpoints ==="
echo "Health check:"
curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || echo "Cannot connect"
echo ""
echo "Main page:"
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "=== Complete! ==="
echo "If still getting 502 errors, run: bash scripts/diagnose-502.sh"
echo "View logs with: pm2 logs aynbeauty"
