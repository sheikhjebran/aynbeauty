# File Upload 413 Error Fix - Production Deployment Guide

## Problem
Getting "413 Request Entity Too Large" error on production server (aynbeauty.in) when uploading images larger than ~1MB.

## Root Cause
This is a **server configuration issue**, not a Next.js application issue. The web server (Nginx/Apache) or proxy server is rejecting large request bodies before they reach the Next.js application.

## Solutions

### 1. Next.js Application Configuration ✅ (Already Done)
- Updated `next.config.js` with proper body size limits
- Added error handling in upload API route
- Application now supports up to 100MB files

### 2. Server Configuration (Required for Production)

#### Option A: Nginx Configuration
If you're using Nginx as a reverse proxy:

```nginx
# Add to your nginx server block
server {
    # Increase max body size globally
    client_max_body_size 100M;
    
    # Specific configuration for upload endpoints
    location /api/upload/ {
        client_max_body_size 100M;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_request_buffering off;
        
        # Timeouts for large uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### Option B: Apache Configuration
If you're using Apache:

```apache
# Add to .htaccess or virtual host
LimitRequestBody 104857600  # 100MB
Timeout 300

# If using mod_proxy
ProxyTimeout 300
ProxyPass /api/upload/ http://localhost:3000/api/upload/
ProxyPassReverse /api/upload/ http://localhost:3000/api/upload/
```

#### Option C: Cloud Platform Configuration

**Vercel:**
- File uploads >4.5MB not supported on Vercel
- Consider using external upload service (AWS S3, Cloudinary)

**DigitalOcean App Platform:**
- Check app spec for body size limits
- May need to configure load balancer settings

**AWS/EC2:**
- Configure Application Load Balancer body size limits
- Check security group settings

### 3. Environment-Specific Fixes

#### PM2/Node.js Process Manager
If using PM2, no additional configuration needed.

#### Docker Deployment
If using Docker with nginx:
```dockerfile
# In your nginx.conf
client_max_body_size 100M;
```

#### Shared Hosting
Contact hosting provider to increase:
- PHP `upload_max_filesize` and `post_max_size`
- Web server request body limits

## Implementation Steps

### Step 1: Identify Your Server Setup
1. Check if you're using Nginx, Apache, or cloud platform
2. Locate your server configuration files

### Step 2: Apply Server Configuration
1. Update server config with appropriate settings from above
2. Restart web server: `sudo systemctl restart nginx` or `sudo systemctl restart apache2`

### Step 3: Test Upload
1. Try uploading a file >1MB
2. Check browser network tab for 413 errors
3. Check server logs for error details

### Step 4: Verify Application Logs
1. Deploy updated Next.js application
2. Check application logs for upload attempts
3. Verify the enhanced error messages appear

## Testing Commands

```bash
# Test with curl (replace with your actual URL)
curl -X POST \
  -F "images=@large-image.jpg" \
  https://aynbeauty.in/api/upload/image

# Check nginx/apache logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/apache2/error.log
```

## Quick Fixes to Try

1. **Nginx**: Add `client_max_body_size 100M;` to server block
2. **Apache**: Add `LimitRequestBody 104857600` to config
3. **cPanel**: Increase PHP limits in PHP selector
4. **Cloud**: Check platform-specific body size limits

## Files Updated in This Fix
- ✅ `next.config.js` - Added body size configuration
- ✅ `src/app/api/upload/image/route.ts` - Enhanced error handling
- ✅ `server-config/nginx-upload.conf` - Nginx configuration template
- ✅ `server-config/apache-upload.conf` - Apache configuration template

## Next Steps
1. Apply appropriate server configuration for your setup
2. Restart web server
3. Test file upload functionality
4. Monitor server logs for any remaining issues