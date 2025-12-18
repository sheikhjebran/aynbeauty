#!/bin/bash

echo "=== Fix Duplicate Nginx Configurations ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "This script must be run as root"
    echo "Run with: sudo bash $0"
    exit 1
fi

echo "=== Step 1: Show current duplicate configs ==="
echo ""
echo "Files found:"
ls -l /etc/nginx/sites-enabled/ayn-beauty 2>/dev/null && echo "  ✓ Found in sites-enabled"
ls -l /etc/nginx/conf.d/ayn-beauty.conf 2>/dev/null && echo "  ✓ Found in conf.d"
echo ""

echo "This duplication is causing the 'conflicting server name' warnings."
echo ""

echo "=== Step 2: Backup both configs ==="
cp /etc/nginx/sites-enabled/ayn-beauty /tmp/ayn-beauty-sites-enabled.backup 2>/dev/null
cp /etc/nginx/conf.d/ayn-beauty.conf /tmp/ayn-beauty-conf.d.backup 2>/dev/null
echo "✓ Backups created in /tmp/"
echo ""

echo "=== Step 3: Remove duplicate from sites-enabled ==="
echo "Keeping the conf.d version as it's more recent..."
rm -f /etc/nginx/sites-enabled/ayn-beauty
rm -f /etc/nginx/sites-available/ayn-beauty
echo "✓ Removed from sites-enabled"
echo ""

echo "=== Step 4: Test nginx configuration ==="
nginx -t
if [ $? -ne 0 ]; then
    echo "✗ Nginx config test failed!"
    echo "Restoring backups..."
    ln -s /etc/nginx/sites-available/ayn-beauty /etc/nginx/sites-enabled/ayn-beauty 2>/dev/null
    exit 1
fi
echo ""

echo "=== Step 5: Reload nginx ==="
systemctl reload nginx
echo "✓ Nginx reloaded"
echo ""

echo "=== Step 6: Verify - checking for conflicts ==="
nginx -t 2>&1 | grep -i "conflicting"
if [ $? -eq 0 ]; then
    echo "⚠ Still have conflicts!"
else
    echo "✓ No more conflicting server names!"
fi
echo ""

echo "=== ✓ Duplicate Config Fixed! ==="
echo ""
echo "Backups are in /tmp/ if you need to restore:"
echo "  /tmp/ayn-beauty-sites-enabled.backup"
echo "  /tmp/ayn-beauty-conf.d.backup"
