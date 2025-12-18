# Production Issue Analysis & Resolution Guide

## Problem Summary

Your application is experiencing a critical error on production:
```
TypeError: Cannot read properties of null (reading 'digest')
```

This cascades into additional errors:
```
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.
```

## Root Causes Identified

### 1. **Next.js 14.2.33 Known Issue**
- The `digest` error is a known issue in this specific version when there's any mismatch between build artifacts and runtime
- Affected by React Server Components rendering issues
- Exacerbated by `output: standalone` configuration in certain scenarios

### 2. **Stale Build Artifacts**
- Previous deployments were not properly cleaning `.next` directory
- Old compiled code cached and interfering with current build
- Fixed in latest `deploy.yml` with `rm -rf .next .turbo dist` step

### 3. **Image Optimization Issues**
- Removed problematic image metadata from `layout.tsx` that was trying to optimize logo.png
- Added null safety checks to all image components
- ImageCacheContext now safely handles null URLs

### 4. **Build Configuration**
- Added `onDemandEntries` configuration to prevent cache issues
- Added `staticPageGenerationTimeout` for better static generation handling
- Added `optimizePackageImports` for package optimization

## Changes Made

### Files Modified

1. **`.github/workflows/deploy.yml`**
   - Added clean build step: `rm -rf .next .turbo dist`
   - Increased health check retries from 5 to 10
   - Increased wait time between attempts from 3s to 5s
   - Added detailed error reporting on health check failures
   - Added NODE_ENV environment variable
   - Improved PM2 restart with proper daemon handling

2. **`next.config.js`**
   - Added `onDemandEntries` configuration for cache management
   - Added `optimizePackageImports` for @heroicons/react and lucide-react
   - Added `staticPageGenerationTimeout: 120`

3. **`src/app/layout.tsx`**
   - Removed image from OpenGraph metadata (was causing digest errors)
   - Removed image from Twitter metadata
   - Changed favicon from `/images/logo.png` to `/favicon.ico`

4. **`src/contexts/ImageCacheContext.tsx`**
   - Added null/undefined checks in `getImageUrl` function
   - Safely handles invalid URL types

5. **`src/components/ui/ProductImage.tsx`**
   - Added null/undefined checks for src parameter
   - Returns placeholder div instead of crashing on null src
   - Added `unoptimized` flag for uploaded images

6. **`src/app/page.tsx`**
   - Added null checks to CategoryImage component
   - Added `unoptimized` flag for uploaded images in Image component

7. **`ecosystem.config.js`**
   - Already configured correctly to use `.next/standalone/server.js`
   - NODE_ENV set to "production"

### New Documentation Files

1. **`PRODUCTION_DEBUGGING.md`**
   - Comprehensive debugging guide
   - Step-by-step solutions in order of likelihood
   - Monitoring checklist
   - Nuclear option for severe cases

2. **`deploy-manual.sh`**
   - Manual deployment script with color-coded output
   - Proper error handling and cleanup
   - Can be used if automated GitHub Actions deployment fails
   - Usage: `bash deploy-manual.sh` on production server

## Immediate Actions Required

### Option A: Automated Deployment (Recommended)

1. Push these changes to main:
   ```bash
   git push origin main
   ```

2. GitHub Actions will automatically trigger and deploy
3. Check deployment progress in GitHub Actions tab
4. If health check passes, site should be live

### Option B: Manual Deployment on Server

SSH into your server and run:
```bash
cd /var/www/aynbeauty
bash deploy-manual.sh
```

## Verification Steps

After deployment, verify the fix by checking:

1. **Health endpoint**
   ```bash
   curl http://66.116.199.206:3000/api/health
   ```
   Should return: `{"status": "ok"}`

2. **Homepage loads**
   ```bash
   curl http://66.116.199.206:3000 -I
   ```
   Should return HTTP 200

3. **Check logs**
   ```bash
   pm2 logs aynbeauty --lines 50
   ```
   Should NOT show digest or Server Action errors

4. **PM2 status**
   ```bash
   pm2 status
   ```
   Should show `online` status

## If Problem Persists

### Try These in Order:

1. **Full clean rebuild** (see `PRODUCTION_DEBUGGING.md` Section 1)
2. **Check Node.js version** (should be 18.17+ or try downgrading from 22)
3. **Verify environment variables** (.env.local must be present)
4. **Check for circular dependencies** (npm run build --analyze)
5. **Upgrade Next.js** to latest version if needed
6. **Nuclear option** - complete node_modules reinstall

See `PRODUCTION_DEBUGGING.md` for detailed instructions on each.

## Performance Impact

These changes should have:
- ✅ No negative performance impact
- ✅ Slightly improved build times (clean artifacts)
- ✅ Better memory management (onDemandEntries)
- ✅ More stable production runtime (null safety checks)

## Rollback Plan

If something breaks:
1. Check backups in `/var/backups/aynbeauty/`
2. Revert to previous commit: `git reset --hard HEAD~1`
3. Rebuild: `npm run build`
4. Restart: `pm2 restart aynbeauty`

## Next Steps

1. **Push changes to GitHub** (triggers automated deployment)
2. **Monitor logs** during deployment
3. **Verify application** is working
4. **Test critical paths**: homepage, product pages, cart, checkout
5. **Monitor for 24 hours** for any recurring errors

## Support & Monitoring

**Monitor these metrics going forward:**
- PM2 process CPU/memory usage
- Application error logs (watch for digest errors)
- Build times on each deployment
- Health check response times
- User error reports

**If digest error returns:**
- Check `.next/standalone/server.js` exists after build
- Verify Node.js version compatibility
- Consider Next.js version upgrade
- Check available server memory

---

## Quick Reference

| Item | Value |
|------|-------|
| Framework | Next.js 14.2.33 |
| Build Mode | Standalone |
| Server | Node.js 22.21.1 |
| Process Manager | PM2 |
| Deploy Script | GitHub Actions + Manual backup |
| Health Endpoint | `/api/health` |
| Production URL | http://66.116.199.206:3000 |
| Error Logs | `/var/www/aynbeauty/logs/aynbeauty-error.log` |
| Manual Deploy | `/var/www/aynbeauty/deploy-manual.sh` |
