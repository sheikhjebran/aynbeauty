#!/bin/bash

echo "=== Quick Status Check ==="
echo ""

cd /var/www/aynbeauty || exit 1

echo "1. PM2 Status:"
pm2 list
echo ""

echo "2. Port 3000 Status:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is LISTENING"
    lsof -i :3000 | grep LISTEN
else
    echo "✗ Port 3000 NOT listening"
fi
echo ""

echo "3. Recent restarts (last 20 lines of logs):"
pm2 logs aynbeauty --lines 20 --nostream | grep -E "Starting|Ready|digest|error" | tail -20
echo ""

echo "4. Test localhost:3000 directly:"
RESPONSE=$(curl -I -s -m 3 http://localhost:3000 2>&1)
if echo "$RESPONSE" | grep -q "200"; then
    echo "✓ Responding with 200"
elif echo "$RESPONSE" | grep -q "Connection refused"; then
    echo "✗ Connection refused - not listening"
elif echo "$RESPONSE" | grep -q "Empty reply"; then
    echo "✗ Crashed on request"
else
    echo "Response: $RESPONSE" | head -3
fi
echo ""

echo "5. Check for digest errors in last 50 lines:"
if pm2 logs aynbeauty --lines 50 --nostream 2>&1 | grep -q "digest"; then
    echo "✗ DIGEST ERRORS PRESENT!"
    echo "Recent digest errors:"
    pm2 logs aynbeauty --lines 50 --nostream | grep "digest" | tail -5
    echo ""
    echo "⚠ YOUR CODE FIXES ARE NOT ON THE SERVER YET!"
    echo ""
    echo "You need to:"
    echo "  1. On local machine: git push origin main"
    echo "  2. On server: git pull origin main"
    echo "  3. Rebuild with fixes"
else
    echo "✓ No digest errors in recent logs"
fi
echo ""

echo "6. Check if SSR fixes are present in code:"
if grep -q "typeof window !== 'undefined'" src/contexts/AuthContext.tsx; then
    echo "✓ SSR safety checks ARE present in code"
else
    echo "✗ SSR safety checks NOT present - need to git pull!"
fi
echo ""

echo "7. Current git commit:"
git log -1 --oneline
echo ""
echo "Remote (origin/main):"
git fetch origin >/dev/null 2>&1
git log origin/main -1 --oneline
echo ""

LOCAL=$(git rev-parse HEAD 2>/dev/null)
REMOTE=$(git rev-parse origin/main 2>/dev/null)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✓ Up to date with remote"
else
    echo "⚠ Behind remote - need to pull"
fi
echo ""

echo "=== Diagnosis ==="
echo ""

if pm2 logs aynbeauty --lines 50 --nostream 2>&1 | grep -q "digest"; then
    echo "❌ PROBLEM: Digest errors causing crashes"
    echo ""
    echo "SOLUTION:"
    echo "  1. Commit and push from local machine:"
    echo "     cd /c/Users/sheik/OneDrive/Documents/GitHub/aynbeauty"
    echo "     git add ."
    echo "     git commit -m 'Fix digest errors with SSR safety checks'"
    echo "     git push origin main"
    echo ""
    echo "  2. Deploy on server:"
    echo "     cd /var/www/aynbeauty"
    echo "     bash scripts/complete-fix.sh"
else
    echo "Status looks OK. If still getting 502, check nginx config."
fi
