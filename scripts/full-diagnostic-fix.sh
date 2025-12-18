#!/bin/bash

echo "=== Complete Diagnostic and Fix Script ==="
echo ""

cd /var/www/aynbeauty || exit 1

echo "PART 1: NGINX CONFIGURATION CHECK"
echo "========================================"
echo ""

if [ "$EUID" -eq 0 ]; then
    echo "1. Checking for duplicate nginx configs..."
    
    SITES_ENABLED_COUNT=$(ls -1 /etc/nginx/sites-enabled/*ayn* 2>/dev/null | wc -l)
    CONF_D_COUNT=$(ls -1 /etc/nginx/conf.d/*ayn* 2>/dev/null | wc -l)
    
    echo "Sites-enabled configs: $SITES_ENABLED_COUNT"
    echo "Conf.d configs: $CONF_D_COUNT"
    
    if [ $((SITES_ENABLED_COUNT + CONF_D_COUNT)) -gt 1 ]; then
        echo "⚠ DUPLICATE CONFIGS FOUND!"
        echo ""
        echo "Removing duplicate from sites-enabled..."
        rm -f /etc/nginx/sites-enabled/ayn-beauty
        rm -f /etc/nginx/sites-available/ayn-beauty
        echo "✓ Duplicates removed"
        echo ""
        
        echo "Testing nginx config..."
        nginx -t
        if [ $? -eq 0 ]; then
            echo "✓ Nginx config valid"
            systemctl reload nginx
            echo "✓ Nginx reloaded"
        else
            echo "✗ Nginx config has errors!"
        fi
    else
        echo "✓ No duplicate configs"
    fi
    echo ""
else
    echo "⚠ Not running as root - skipping nginx fix"
    echo ""
fi

echo "PART 2: CODE AND BUILD CHECK"
echo "========================================"
echo ""

echo "2. Checking git status..."
git fetch origin >/dev/null 2>&1
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Updates available from remote"
    echo "Current: $LOCAL"
    echo "Remote: $REMOTE"
    echo ""
    echo "Pulling latest..."
    git pull origin main
    echo "✓ Code updated"
else
    echo "✓ Up to date with remote"
fi
echo ""

echo "3. Checking for SSR safety in source files..."
FILES_TO_CHECK=(
    "src/contexts/AuthContext.tsx"
    "src/contexts/CartContext.tsx"
    "src/contexts/WishlistContext.tsx"
    "src/hooks/useGuestCheckout.ts"
)

ALL_SAFE=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "typeof window !== 'undefined'" "$file"; then
            echo "✓ $file has SSR safety checks"
        else
            echo "✗ $file MISSING SSR safety checks!"
            ALL_SAFE=false
        fi
    else
        echo "⚠ $file not found"
    fi
done
echo ""

if [ "$ALL_SAFE" = false ]; then
    echo "⚠ WARNING: Some files are missing SSR safety checks!"
    echo "The digest errors may persist."
    echo ""
fi

echo "4. Checking current build state..."
if [ -d ".next/standalone" ]; then
    if [ -f ".next/standalone/server.js" ]; then
        echo "✓ Build exists"
        BUILD_DATE=$(stat -c %y .next/standalone/server.js 2>/dev/null || stat -f "%Sm" .next/standalone/server.js 2>/dev/null)
        echo "Build date: $BUILD_DATE"
        
        # Check if build is older than source files
        NEWEST_SRC=$(find src -name "*.tsx" -o -name "*.ts" | xargs ls -t | head -1)
        if [ "$NEWEST_SRC" -nt ".next/standalone/server.js" ]; then
            echo "⚠ Source files are newer than build - rebuild needed!"
            REBUILD_NEEDED=true
        else
            echo "✓ Build is up to date with source"
            REBUILD_NEEDED=false
        fi
    else
        echo "✗ server.js missing - rebuild required!"
        REBUILD_NEEDED=true
    fi
else
    echo "✗ No build found - rebuild required!"
    REBUILD_NEEDED=true
fi
echo ""

echo "PART 3: PM2 AND PROCESS CHECK"
echo "========================================"
echo ""

echo "5. Checking PM2 status..."
pm2 describe aynbeauty >/dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 list | grep aynbeauty
    
    # Check restart count
    RESTART_COUNT=$(pm2 jlist | jq '.[0].pm2_env.restart_time' 2>/dev/null || echo "0")
    echo "Restart count: $RESTART_COUNT"
    
    if [ "$RESTART_COUNT" -gt 10 ]; then
        echo "⚠ High restart count - app is crash-looping!"
    fi
else
    echo "⚠ App not in PM2"
fi
echo ""

echo "6. Checking port 3000..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✓ Port 3000 is active"
    lsof -i :3000 | grep LISTEN
else
    echo "✗ Port 3000 NOT active"
fi
echo ""

echo "7. Checking recent digest errors..."
DIGEST_ERRORS=$(pm2 logs aynbeauty --lines 100 --nostream 2>&1 | grep -c "digest" || echo "0")
echo "Digest errors in last 100 lines: $DIGEST_ERRORS"

if [ "$DIGEST_ERRORS" -gt 0 ]; then
    echo "⚠ DIGEST ERRORS DETECTED!"
    echo "Recent error sample:"
    pm2 logs aynbeauty --err --lines 20 --nostream | grep "digest" -A 2 | head -10
    echo ""
    REBUILD_NEEDED=true
fi
echo ""

echo "PART 4: REBUILD IF NEEDED"
echo "========================================"
echo ""

if [ "$REBUILD_NEEDED" = true ]; then
    echo "8. Rebuild required - starting clean build..."
    echo ""
    
    echo "Stopping PM2..."
    pm2 stop aynbeauty 2>/dev/null
    pm2 delete aynbeauty 2>/dev/null
    sleep 2
    
    echo "Killing any processes on port 3000..."
    PIDS=$(lsof -ti :3000 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        kill -9 $PIDS 2>/dev/null
        sleep 1
    fi
    
    echo "Cleaning old build..."
    rm -rf .next/export 2>/dev/null
    rm -rf .next
    echo "✓ Clean"
    echo ""
    
    echo "Building (this takes 2-3 minutes)..."
    NODE_ENV=production npm run build
    
    if [ $? -ne 0 ]; then
        echo "✗ Build failed!"
        echo "Check errors above"
        exit 1
    fi
    
    if [ ! -f ".next/standalone/server.js" ]; then
        echo "✗ server.js not created!"
        exit 1
    fi
    
    echo "✓ Build successful"
    echo ""
    
    echo "Starting PM2..."
    pm2 start ecosystem.config.js
    sleep 5
    
    echo "Waiting for app to start (15 seconds)..."
    for i in {15..1}; do
        printf "\r%2d seconds remaining..." $i
        sleep 1
    done
    echo ""
    echo ""
else
    echo "8. Build is current - restarting PM2..."
    pm2 restart aynbeauty
    sleep 5
    echo ""
fi

echo "PART 5: VERIFICATION"
echo "========================================"
echo ""

echo "9. Verifying port 3000..."
sleep 2
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✓ Port 3000 ACTIVE"
else
    echo "✗ Port 3000 NOT active - startup failed!"
    echo "Last 30 log lines:"
    pm2 logs aynbeauty --lines 30 --nostream
    exit 1
fi
echo ""

echo "10. Testing health endpoint..."
for i in {1..5}; do
    HEALTH=$(curl -s -m 5 http://localhost:3000/api/health)
    if [ $? -eq 0 ]; then
        echo "✓ Health endpoint responding!"
        echo "$HEALTH" | jq '.' 2>/dev/null || echo "$HEALTH"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "✗ Health endpoint not responding after 5 attempts"
    fi
    sleep 2
done
echo ""

echo "11. Testing main page..."
RESPONSE=$(curl -I -s -m 5 http://localhost:3000)
if echo "$RESPONSE" | grep -q "200"; then
    echo "✓ Main page responding with 200"
elif echo "$RESPONSE" | grep -q "502"; then
    echo "✗ Still getting 502!"
else
    echo "Response: $RESPONSE" | head -5
fi
echo ""

echo "12. Monitoring for digest errors (30 seconds)..."
(timeout 30 pm2 logs aynbeauty 2>&1 &)
sleep 30
kill %1 2>/dev/null

if pm2 logs aynbeauty --lines 50 --nostream | grep -qi "digest"; then
    echo "✗ DIGEST ERRORS STILL PRESENT!"
    echo "This means the fix didn't work or there's another issue"
else
    echo "✓ NO DIGEST ERRORS DETECTED!"
fi
echo ""

echo "13. Final status check..."
pm2 list
echo ""

echo "========================================"
echo "SUMMARY"
echo "========================================"
echo ""

if [ "$EUID" -eq 0 ]; then
    echo "✓ Nginx checked (run as root)"
else
    echo "⚠ Nginx not checked (need sudo)"
fi

if lsof -i :3000 >/dev/null 2>&1; then
    echo "✓ Next.js running on port 3000"
else
    echo "✗ Next.js NOT running"
fi

RECENT_DIGEST=$(pm2 logs aynbeauty --lines 50 --nostream 2>&1 | grep -c "digest" || echo "0")
if [ "$RECENT_DIGEST" -eq 0 ]; then
    echo "✓ No recent digest errors"
else
    echo "✗ Digest errors: $RECENT_DIGEST in last 50 lines"
fi

echo ""
echo "Test URLs:"
echo "  http://66.116.199.206"
echo "  https://aynbeauty.in"
echo ""
echo "Commands:"
echo "  Monitor logs: pm2 logs aynbeauty"
echo "  Check status: pm2 status"
echo "  Restart: pm2 restart aynbeauty"
