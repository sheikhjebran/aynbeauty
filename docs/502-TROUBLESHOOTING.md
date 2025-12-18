# 502 Bad Gateway Troubleshooting Guide

## Quick Fix Commands

```bash
# On your server, run these commands:

# 1. Diagnose the issue
cd /var/www/aynbeauty
bash scripts/diagnose-502.sh

# 2. Apply automatic fix
bash scripts/fix-502.sh

# 3. If still not working, manual restart:
pm2 restart aynbeauty
pm2 logs aynbeauty --lines 50
```

## Common Causes & Solutions

### 1. **Next.js App Not Running**
**Symptoms:** Port 3000 is not in use  
**Fix:**
```bash
cd /var/www/aynbeauty
pm2 restart aynbeauty
pm2 logs aynbeauty
```

### 2. **Build Missing or Corrupted**
**Symptoms:** `.next/standalone/server.js` not found  
**Fix:**
```bash
cd /var/www/aynbeauty
npm run build
pm2 restart aynbeauty
```

### 3. **Port 3000 Conflict**
**Symptoms:** "Port already in use" errors  
**Fix:**
```bash
# Find and kill process using port 3000
lsof -ti :3000 | xargs kill -9
pm2 restart aynbeauty
```

### 4. **Database Connection Failed**
**Symptoms:** Health check shows database: 'failed'  
**Fix:**
```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -u root -p -e "USE aynbeauty; SELECT 1"

# Check .env file has correct credentials
cat /var/www/aynbeauty/.env | grep DB_
```

### 5. **Memory Limit Exceeded**
**Symptoms:** App keeps restarting  
**Fix:**
```bash
# Check PM2 logs
pm2 logs aynbeauty --lines 100

# Increase memory limit in ecosystem.config.js
# max_memory_restart: "1G"  # increase from 500M

pm2 restart aynbeauty
```

### 6. **Permission Issues**
**Symptoms:** Cannot access files/folders  
**Fix:**
```bash
cd /var/www/aynbeauty
sudo chown -R $USER:$USER .
chmod -R 755 .
mkdir -p logs
chmod 755 logs
```

### 7. **Nginx Not Running or Misconfigured**
**Symptoms:** nginx errors in logs  
**Fix:**
```bash
# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx

# Check nginx status
systemctl status nginx
```

## Verification Steps

After applying fixes, verify everything is working:

```bash
# 1. Check PM2 status
pm2 list

# 2. Test health endpoint
curl http://localhost:3000/api/health

# 3. Test main page
curl -I http://localhost:3000

# 4. Check nginx
systemctl status nginx

# 5. Test from browser
# Visit: http://66.116.199.206
# Or: https://aynbeauty.in
```

## PM2 Useful Commands

```bash
# View all processes
pm2 list

# View logs (real-time)
pm2 logs aynbeauty

# View logs (last 100 lines)
pm2 logs aynbeauty --lines 100 --nostream

# Restart app
pm2 restart aynbeauty

# Stop app
pm2 stop aynbeauty

# Delete app from PM2
pm2 delete aynbeauty

# Start app
pm2 start ecosystem.config.js

# Flush logs
pm2 flush aynbeauty

# Monitor resources
pm2 monit

# Save PM2 process list
pm2 save

# Resurrect saved processes on reboot
pm2 resurrect
```

## Deployment Checklist

When deploying code changes:

```bash
# 1. Pull latest code
cd /var/www/aynbeauty
git pull origin main

# 2. Install dependencies (if package.json changed)
npm install

# 3. Build
npm run build

# 4. Restart PM2
pm2 restart aynbeauty

# 5. Verify
pm2 logs aynbeauty --lines 20

# 6. Test
curl http://localhost:3000/api/health
```

## Emergency Recovery

If nothing works, nuclear option:

```bash
# 1. Stop everything
pm2 delete aynbeauty
killall node

# 2. Clean build
cd /var/www/aynbeauty
rm -rf .next
npm run build

# 3. Start fresh
pm2 start ecosystem.config.js

# 4. Monitor
pm2 logs aynbeauty
```

## Log Locations

- **PM2 logs:** `/var/www/aynbeauty/logs/`
- **Nginx access:** `/var/log/nginx/access.log`
- **Nginx error:** `/var/log/nginx/error.log`
- **System:** `journalctl -u nginx`

## Health Check Endpoint

Your app has a health check at: `http://localhost:3000/api/health`

It checks:
- Database connection
- Build directory
- Uploads directory
- Memory usage
- Uptime

Example response:
```json
{
  "status": "healthy",
  "checks": {
    "database": "ok",
    "uploads": "ok",
    "build": "ok"
  },
  "memory": {
    "used": 250,
    "total": 400
  },
  "uptime": 3600
}
```

## Getting Help

If issues persist:
1. Run diagnostic script: `bash scripts/diagnose-502.sh > diagnostic.txt`
2. Share the output for debugging
3. Check PM2 logs: `pm2 logs aynbeauty --lines 200 --nostream > app-logs.txt`
