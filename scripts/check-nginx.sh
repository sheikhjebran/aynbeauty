#!/bin/bash

echo "=== Nginx Configuration Checker ==="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠ Not running as root. Some checks may fail."
    echo "Run with: sudo bash $0"
    echo ""
fi

echo "=== 1. Check Nginx Installation ==="
if command -v nginx &> /dev/null; then
    nginx -v
    echo "✓ Nginx installed"
else
    echo "✗ Nginx not installed!"
    exit 1
fi
echo ""

echo "=== 2. Check Nginx Status ==="
systemctl status nginx --no-pager | head -15
echo ""

echo "=== 3. Test Nginx Configuration Syntax ==="
nginx -t
NGINX_TEST=$?
echo ""

if [ $NGINX_TEST -ne 0 ]; then
    echo "✗ Nginx configuration has errors!"
    echo "Fix the errors shown above before continuing"
    exit 1
fi

echo "=== 4. List Enabled Sites ==="
echo "Sites in sites-enabled:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "sites-enabled directory not found"
echo ""

echo "=== 5. Check AynBeauty Configuration ==="
if [ -f "/etc/nginx/sites-enabled/ayn-beauty.conf" ]; then
    echo "✓ ayn-beauty.conf found in sites-enabled"
    ls -lh /etc/nginx/sites-enabled/ayn-beauty.conf
elif [ -f "/etc/nginx/conf.d/ayn-beauty.conf" ]; then
    echo "✓ ayn-beauty.conf found in conf.d"
    ls -lh /etc/nginx/conf.d/ayn-beauty.conf
else
    echo "⚠ ayn-beauty.conf not found in standard locations"
    echo "Searching..."
    find /etc/nginx -name "*ayn*" 2>/dev/null
fi
echo ""

echo "=== 6. Check for Configuration Conflicts ==="
echo "Checking for duplicate server blocks..."
CONFLICTS=$(nginx -T 2>/dev/null | grep -c "server_name.*aynbeauty.in")
if [ $CONFLICTS -gt 3 ]; then
    echo "⚠ WARNING: Multiple server blocks found for aynbeauty.in ($CONFLICTS)"
    echo "This may cause conflicts. Check your configuration."
else
    echo "✓ Server block count looks normal"
fi
echo ""

echo "=== 7. Verify SSL Certificates ==="
if [ -f "/etc/letsencrypt/live/aynbeauty.in/fullchain.pem" ]; then
    echo "✓ SSL certificate found"
    openssl x509 -in /etc/letsencrypt/live/aynbeauty.in/fullchain.pem -noout -dates 2>/dev/null || echo "Cannot read certificate"
else
    echo "✗ SSL certificate not found!"
fi
echo ""

echo "=== 8. Check Listening Ports ==="
echo "Nginx processes listening:"
netstat -tlnp 2>/dev/null | grep nginx || ss -tlnp | grep nginx
echo ""

echo "=== 9. Test Port 3000 (Next.js) ==="
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Port 3000 is active"
    lsof -i :3000 | grep LISTEN
else
    echo "✗ Port 3000 NOT active - Next.js not running!"
fi
echo ""

echo "=== 10. Test Proxy Connection ==="
echo "Testing connection from nginx to Next.js..."
curl -I -m 5 http://localhost:3000 2>&1 | head -10
echo ""

echo "=== 11. Check Nginx Error Logs (last 20 lines) ==="
if [ -f "/var/log/nginx/error.log" ]; then
    tail -20 /var/log/nginx/error.log
else
    echo "Error log not found"
fi
echo ""

echo "=== 12. Check AynBeauty Specific Logs ==="
if [ -f "/var/log/nginx/aynbeauty-error.log" ]; then
    echo "AynBeauty error log (last 10 lines):"
    tail -10 /var/log/nginx/aynbeauty-error.log
else
    echo "No AynBeauty-specific error log found"
fi
echo ""

echo "=== 13. Check Current Configuration ==="
echo "Current ayn-beauty.conf content:"
if [ -f "/etc/nginx/sites-enabled/ayn-beauty.conf" ]; then
    cat /etc/nginx/sites-enabled/ayn-beauty.conf
elif [ -f "/etc/nginx/conf.d/ayn-beauty.conf" ]; then
    cat /etc/nginx/conf.d/ayn-beauty.conf
else
    echo "Configuration file not found"
fi
echo ""

echo "=== 14. Test External Access ==="
echo "Testing HTTPS access (domain):"
curl -I -m 10 https://aynbeauty.in 2>&1 | head -10
echo ""

echo "Testing HTTP access (IP):"
curl -I -m 10 http://66.116.199.206 2>&1 | head -10
echo ""

echo "=== 15. Check File Permissions ==="
echo "Nginx process user:"
ps aux | grep nginx | grep -v grep | head -3
echo ""

echo "=== Summary ==="
echo ""
if [ $NGINX_TEST -eq 0 ]; then
    echo "✓ Nginx configuration syntax is valid"
else
    echo "✗ Nginx configuration has syntax errors"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Next.js is running on port 3000"
else
    echo "✗ Next.js is NOT running on port 3000"
fi

if systemctl is-active --quiet nginx; then
    echo "✓ Nginx service is active"
else
    echo "✗ Nginx service is NOT active"
fi

echo ""
echo "=== Recommendations ==="
echo ""

if [ ! -f "/var/log/nginx/aynbeauty-error.log" ]; then
    echo "Consider adding separate log files for aynbeauty.in:"
    echo "  access_log /var/log/nginx/aynbeauty-access.log;"
    echo "  error_log /var/log/nginx/aynbeauty-error.log warn;"
fi

echo ""
echo "To apply improved configuration:"
echo "  1. Review: cat /var/www/aynbeauty/ayn-beauty-improved.conf"
echo "  2. Backup: sudo cp /etc/nginx/sites-enabled/ayn-beauty.conf /etc/nginx/sites-enabled/ayn-beauty.conf.backup"
echo "  3. Update: sudo cp /var/www/aynbeauty/ayn-beauty-improved.conf /etc/nginx/sites-enabled/ayn-beauty.conf"
echo "  4. Test: sudo nginx -t"
echo "  5. Reload: sudo systemctl reload nginx"
