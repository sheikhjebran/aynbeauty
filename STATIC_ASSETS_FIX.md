# Static Assets 404 Fix - Deployment Guide

## Problem
Next.js standalone builds don't automatically copy static assets. The build creates `.next/standalone/` but requires manual copying of:
- `.next/static/` → `.next/standalone/.next/static/`
- `public/` → `.next/standalone/public/`

## Solution Implemented

### 1. Created Post-Build Script
Added `scripts/post-build.js` that automatically copies static assets after build.

### 2. Updated package.json
Modified build command to run post-build script:
```json
"build": "next build && node scripts/post-build.js"
```

### 3. Created Deployment Script
`scripts/deploy-with-static-fix.sh` handles complete deployment with verification.

## Deployment Steps

### Step 1: Commit and Push Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fix 404 errors: Add post-build static asset copying for standalone mode

- Created post-build.js script to copy .next/static and public to standalone
- Updated package.json build command to run post-build automatically
- Created deploy-with-static-fix.sh for complete deployment
- Added SSR safety checks to AuthContext, CartContext, useGuestCheckout
- Fixed middleware matcher configuration
- Removed conflicting force-dynamic export from layout"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Production Server

SSH into your server:
```bash
ssh root@66.116.199.206
```

Navigate to project directory:
```bash
cd /var/www/aynbeauty
```

Pull latest changes:
```bash
git pull origin main
```

Run deployment script:
```bash
sudo bash scripts/deploy-with-static-fix.sh
```

The script will:
1. ✓ Stop PM2
2. ✓ Clean old build (.next directory)
3. ✓ Install dependencies
4. ✓ Build application
5. ✓ Run post-build to copy static assets
6. ✓ Verify standalone structure
7. ✓ Start PM2
8. ✓ Verify static assets are accessible

### Step 3: Verify Deployment

Check PM2 status:
```bash
pm2 status
pm2 logs aynbeauty --lines 50
```

Test static assets:
```bash
# Health check
curl http://localhost:3000/api/health

# Check if static directory exists
ls -la .next/standalone/.next/static/

# Check if public directory exists
ls -la .next/standalone/public/
```

Test from browser:
```
https://aynbeauty.in
```

Check for 404 errors in nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log | grep "404"
```

Should see NO 404 errors for:
- `/_next/static/` files
- `.woff2` font files
- CSS/JS bundles
- Images from `/public/`

### Step 4: Monitor Application

Watch logs in real-time:
```bash
pm2 logs aynbeauty
```

Check error logs:
```bash
tail -f /var/www/aynbeauty/logs/aynbeauty-error.log
```

Check for digest errors (should be gone):
```bash
grep "digest" /var/www/aynbeauty/logs/aynbeauty-error.log
```

## Verification Checklist

After deployment, verify:

- [ ] PM2 shows app as "online"
- [ ] No crashes in PM2 logs
- [ ] Health check returns 200: `curl http://localhost:3000/api/health`
- [ ] Website loads properly in browser
- [ ] No 404 errors for CSS/JS files
- [ ] No 404 errors for fonts (.woff2)
- [ ] Images load correctly
- [ ] No "digest" errors in logs
- [ ] No hydration mismatch errors
- [ ] Cart functionality works
- [ ] Login/logout works
- [ ] Product pages load

## File Structure After Build

```
.next/standalone/
├── server.js                    # Next.js server
├── .next/
│   ├── static/                  # ✓ Copied by post-build script
│   │   ├── chunks/
│   │   ├── css/
│   │   ├── media/
│   │   └── ...
│   └── ...
├── public/                      # ✓ Copied by post-build script
│   ├── uploads/
│   ├── images/
│   └── ...
└── ...
```

## Rollback (If Needed)

If deployment fails:

```bash
# Stop current app
pm2 stop aynbeauty

# Go back to previous commit
git reset --hard HEAD~1

# Rebuild
npm run build

# Restart
pm2 start ecosystem.config.js
```

## Additional Fixes Included

### SSR Safety Checks
Fixed localStorage access during server-side rendering in:
- `src/contexts/AuthContext.tsx`
- `src/contexts/CartContext.tsx`
- `src/hooks/useGuestCheckout.ts`

### Middleware Configuration
Simplified matcher in `middleware.ts` to prevent conflicts.

### Layout Configuration
Removed `export const dynamic = 'force-dynamic'` from `src/app/layout.tsx` that conflicted with metadata.

## Common Issues

### Issue: "Cannot find module './standalone/server.js'"
**Solution:** Make sure `next.config.js` has `output: 'standalone'`

### Issue: Static files still 404
**Solution:** Verify directories exist:
```bash
ls -la .next/standalone/.next/static/
ls -la .next/standalone/public/
```

### Issue: Post-build script fails
**Solution:** Run manually:
```bash
node scripts/post-build.js
```

### Issue: Permission denied
**Solution:** Run with sudo:
```bash
sudo bash scripts/deploy-with-static-fix.sh
```

## Success Indicators

✅ No 404 errors in nginx access log
✅ PM2 shows app as "online" without restarts
✅ No "digest" errors in application logs
✅ Website loads with all CSS/JS/fonts
✅ Console shows no errors
✅ All functionality works (cart, login, product pages)

## Next Steps

After successful deployment:

1. **Monitor for 24 hours**: Watch logs for any new errors
2. **Apply nginx improvements**: Use `ayn-beauty-improved.conf`
3. **Update deployment workflow**: Modify `.github/workflows/deploy.yml` to use new build process
4. **Set up automated backups**: Backup product images before each deployment

## Support

If issues persist:
1. Check PM2 logs: `pm2 logs aynbeauty`
2. Check error log: `tail -100 /var/www/aynbeauty/logs/aynbeauty-error.log`
3. Check nginx error log: `sudo tail -100 /var/log/nginx/error.log`
4. Verify standalone structure: `ls -la .next/standalone/`

## References

- Next.js Standalone Build: https://nextjs.org/docs/advanced-features/output-file-tracing
- PM2 Documentation: https://pm2.keymetrics.io/docs/usage/quick-start/
- Production Checklist: See PRODUCTION_FIX_SUMMARY.md
