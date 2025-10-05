# Manual Deployment Steps for Image Caching Fix

## Step 1: Connect to Server
```bash
ssh admin@66.116.199.206
```

## Step 2: Navigate to Project Directory
```bash
cd /var/www/aynbeauty
```

## Step 3: Pull Latest Changes
```bash
git pull origin main
```

## Step 4: Install Dependencies
```bash
npm install
```

## Step 5: Build the Application
```bash
npm run build
```

## Step 6: Update Database (Optional - for existing images)
```bash
# Run the SQL migration to update existing image URLs
mysql -u aynbeauty_user -p aynbeauty_db < migrate-image-urls.sql
```

## Step 7: Restart PM2
```bash
pm2 restart aynbeauty
```

## Step 8: Verify Deployment
```bash
pm2 status
pm2 logs aynbeauty --lines 20
```

## Step 9: Test Image API
Visit these URLs to test:
- http://66.116.199.206:3000/api/test/images
- http://66.116.199.206:3000/api/debug/uploads

## What This Fixes:
1. **No Caching**: Uploads directory has `no-cache` headers
2. **API Routes**: Images served via `/api/images/` instead of direct static files
3. **Timestamp Cache Busting**: Every image request has `?cb=timestamp`
4. **Middleware**: Aggressive no-cache headers for all upload requests

## Expected Result:
- Add new product → Images visible immediately
- No manual restart needed
- No rebuild required

## If Still Not Working:
1. Clear browser cache completely (Ctrl+Shift+Delete)
2. Try incognito/private browsing mode
3. Check browser dev tools for actual network requests
4. Verify files exist: `ls -la public/uploads/products/`