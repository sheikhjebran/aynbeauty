# 🚀 AynBeauty BigRock Production Deployment Guide

## Overview
This guide will help you deploy AynBeauty to your BigRock shared hosting server with proper database migration and PM2 process management.

## ✅ Prerequisites Complete
- ✅ Build errors fixed (TypeScript issues resolved)
- ✅ Database migration script created (`deploy-production-db.sql`)
- ✅ Production environment template ready (`.env.production.example`)
- ✅ Deployment script prepared (`deploy-bigrock.sh`)

## 📋 Deployment Steps

### Step 1: Upload Files to BigRock Server

**Option A: Using cPanel File Manager**
1. Login to BigRock cPanel
2. Open File Manager
3. Navigate to `public_html` or your domain folder
4. Create folder `aynbeauty`
5. Upload these files to the `aynbeauty` folder:
   - `.next/` (entire folder)
   - `public/` (entire folder)
   - `package.json`
   - `package-lock.json`
   - `deploy-production-db.sql`
   - `deploy-bigrock.sh`
   - `.env.production.example`

**Option B: Using SSH/SFTP (Recommended)**
1. Connect via SSH to your BigRock server
2. Navigate to your web directory:
   ```bash
   cd /var/www/html  # or your domain directory
   mkdir aynbeauty
   cd aynbeauty
   ```

3. Upload files using SCP or SFTP from your local machine:
   ```bash
   # From your local machine
   scp -r .next package.json package-lock.json deploy-production-db.sql deploy-bigrock.sh .env.production.example user@your-server:/var/www/html/aynbeauty/
   ```

### Step 2: Set Up Database

1. **Login to MySQL via cPanel or command line**
   
2. **Create Database and User**
   ```sql
   -- Create database
   CREATE DATABASE aynbeauty;
   
   -- Create user (if needed)
   CREATE USER 'aynbeauty_user'@'localhost' IDENTIFIED BY 'secure_password_here';
   
   -- Grant permissions
   GRANT ALL PRIVILEGES ON aynbeauty.* TO 'aynbeauty_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run Migration Script**
   ```bash
   # Via command line
   mysql -u aynbeauty_user -p aynbeauty < deploy-production-db.sql
   
   # Or via cPanel phpMyAdmin: Import the deploy-production-db.sql file
   ```

### Step 3: Configure Environment

1. **Create Production Environment File**
   ```bash
   cd /var/www/html/aynbeauty
   cp .env.production.example .env.production
   ```

2. **Edit .env.production with your details:**
   ```env
   # Database Configuration
   DATABASE_URL="mysql://aynbeauty_user:your_password@localhost:3306/aynbeauty"
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=aynbeauty
   DB_USER=aynbeauty_user
   DB_PASSWORD=your_password_here
   
   # Application Settings
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   APP_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=generate-a-very-long-random-secret-here
   JWT_SECRET=generate-another-long-random-secret-here
   ```

### Step 4: Run Deployment Script

1. **Make script executable:**
   ```bash
   chmod +x deploy-bigrock.sh
   ```

2. **Run deployment:**
   ```bash
   ./deploy-bigrock.sh
   ```

   The script will:
   - Install dependencies
   - Set up PM2 configuration
   - Start the application
   - Configure auto-restart

### Step 5: Configure Web Server (Apache)

1. **Create/Edit .htaccess in your domain root:**
   ```apache
   RewriteEngine On
   
   # Handle Node.js application
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
   
   # Enable compression
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/xml
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/xml
       AddOutputFilterByType DEFLATE application/xhtml+xml
       AddOutputFilterByType DEFLATE application/rss+xml
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   
   # Security headers
   Header always set X-Content-Type-Options nosniff
   Header always set X-Frame-Options DENY
   Header always set X-XSS-Protection "1; mode=block"
   ```

### Step 6: Verify Deployment

1. **Check PM2 Status:**
   ```bash
   pm2 status
   pm2 logs aynbeauty
   ```

2. **Test Application:**
   - Visit: `http://your-domain.com`
   - Check homepage loads
   - Test product pages
   - Verify database connectivity

3. **Monitor Logs:**
   ```bash
   # View real-time logs
   pm2 logs aynbeauty --lines 50
   
   # Check error logs
   pm2 logs aynbeauty --err
   ```

## 🔧 Troubleshooting

### Common Issues

**1. PM2 Process Keeps Restarting**
```bash
# Check logs for errors
pm2 logs aynbeauty --lines 100

# Common fixes:
# - Check database connection in .env.production
# - Verify all dependencies installed
# - Check file permissions
```

**2. Database Connection Errors**
```bash
# Test database connection
mysql -u aynbeauty_user -p aynbeauty -e "SHOW TABLES;"

# Check environment variables
cat .env.production | grep DB_
```

**3. 502 Bad Gateway / Proxy Errors**
```bash
# Check if app is running
pm2 status

# Restart if needed
pm2 restart aynbeauty

# Check Apache error logs
tail -f /var/log/apache2/error.log
```

**4. Build/Dependencies Issues**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Rebuild if needed
npm run build
```

### Performance Optimization

1. **Enable Caching:**
   ```apache
   # Add to .htaccess
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/jpg "access plus 1 month"
       ExpiresByType image/jpeg "access plus 1 month"
       ExpiresByType image/gif "access plus 1 month"
       ExpiresByType image/png "access plus 1 month"
       ExpiresByType text/css "access plus 1 month"
       ExpiresByType application/pdf "access plus 1 month"
       ExpiresByType text/javascript "access plus 1 month"
       ExpiresByType text/html "access plus 1 day"
   </IfModule>
   ```

2. **Monitor Resource Usage:**
   ```bash
   # Check memory usage
   pm2 monit
   
   # Check server resources
   htop
   df -h
   ```

## 🔄 Maintenance Commands

### Daily Operations
```bash
# Check application status
pm2 status

# View logs
pm2 logs aynbeauty --lines 20

# Restart if needed
pm2 restart aynbeauty
```

### Updates
```bash
# Backup current version
tar -czf aynbeauty_backup_$(date +%Y%m%d).tar.gz /var/www/html/aynbeauty

# Upload new files
# Stop application
pm2 stop aynbeauty

# Replace files
# Restart application
pm2 start aynbeauty
```

### Database Backup
```bash
# Create backup
mysqldump -u aynbeauty_user -p aynbeauty > aynbeauty_backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u aynbeauty_user -p aynbeauty < aynbeauty_backup_YYYYMMDD.sql
```

## ✅ Final Checklist

- [ ] Database created and migrated
- [ ] Environment file configured
- [ ] Dependencies installed
- [ ] PM2 process running
- [ ] Apache proxy configured
- [ ] SSL certificate installed (recommended)
- [ ] Domain DNS configured
- [ ] Application accessible via browser
- [ ] All pages load correctly
- [ ] Database operations working

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs aynbeauty`
2. Verify database connection
3. Check Apache error logs
4. Ensure all environment variables are set correctly

Your AynBeauty application should now be successfully deployed on BigRock! 🎉