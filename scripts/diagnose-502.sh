#!/bin/bash

echo "=== AynBeauty 502 Diagnostic Script ==="
echo "Timestamp: $(date)"
echo ""

echo "=== 1. Check if Next.js server is running ==="
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is in use"
    lsof -i :3000
else
    echo "✗ Port 3000 is NOT in use - Next.js is not running!"
fi
echo ""

echo "=== 2. Check PM2 process status ==="
pm2 list
echo ""

echo "=== 3. Check PM2 logs (last 30 lines) ==="
pm2 logs aynbeauty --lines 30 --nostream
echo ""

echo "=== 4. Test localhost:3000 directly ==="
curl -I http://localhost:3000 2>&1 || echo "✗ Cannot connect to localhost:3000"
echo ""

echo "=== 5. Test health endpoint ==="
curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || echo "✗ Health endpoint failed"
echo ""

echo "=== 6. Check nginx status ==="
systemctl status nginx --no-pager | head -20
echo ""

echo "=== 7. Check nginx error logs (last 20 lines) ==="
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "Cannot read nginx error log"
echo ""

echo "=== 8. Test nginx config ==="
nginx -t
echo ""

echo "=== 9. Check disk space ==="
df -h /var/www/aynbeauty
echo ""

echo "=== 10. Check if .next/standalone exists ==="
if [ -d "/var/www/aynbeauty/.next/standalone" ]; then
    echo "✓ .next/standalone directory exists"
    ls -la /var/www/aynbeauty/.next/standalone/server.js 2>&1
else
    echo "✗ .next/standalone directory NOT found!"
fi
echo ""

echo "=== 11. Check if node_modules exists ==="
if [ -d "/var/www/aynbeauty/.next/standalone/node_modules" ]; then
    echo "✓ node_modules exists in standalone"
else
    echo "✗ node_modules NOT found in standalone!"
fi
echo ""

echo "=== 12. Check environment variables ==="
pm2 env 0 2>/dev/null | grep -E "NODE_ENV|PORT|DB_" || echo "Cannot read PM2 env"
echo ""

echo "=== Recommendations ==="
echo "If Next.js is not running on port 3000:"
echo "  1. cd /var/www/aynbeauty"
echo "  2. pm2 restart aynbeauty"
echo "  3. pm2 logs aynbeauty --lines 50"
echo ""
echo "If build is missing:"
echo "  1. cd /var/www/aynbeauty"
echo "  2. npm run build"
echo "  3. pm2 restart aynbeauty"
echo ""
echo "If database connection fails:"
echo "  1. Check .env file exists with DB credentials"
echo "  2. systemctl status mysql"
echo "  3. Test: mysql -u root -p -e 'SELECT 1'"
