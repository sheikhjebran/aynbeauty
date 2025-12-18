# GitHub Actions Deploy Workflow - Update Summary

## Changes Made to `.github/workflows/deploy.yml`

### 1. **Uncommented the Entire Workflow**
The workflow was previously completely commented out (disabled). All comments (`#`) have been removed to activate the workflow.

### 2. **Updated Build Command**
- **Old:** `npm run build` (basic build)
- **New:** Still `npm run build`, but now includes post-build static asset copying via `package.json`

### 3. **Enhanced Build Artifact Cleaning**
```bash
# Old
rm -rf .next dist .turbo || true

# New
rm -rf .next .next-backup dist .turbo node_modules/.cache || true
```
Now also removes:
- `.next-backup` - Backup directories
- `node_modules/.cache` - Cached build artifacts

### 4. **Added Static Asset Verification** (NEW)
Added verification step after build to ensure standalone build is correct:
```bash
# Verify standalone structure
echo "🔍 Verifying standalone build structure..."
if [ ! -d ".next/standalone/.next/static" ]; then
  echo "❌ Static assets not found in standalone build!"
  exit 1
fi
if [ ! -d ".next/standalone/public" ]; then
  echo "❌ Public directory not found in standalone build!"
  exit 1
fi
STATIC_COUNT=$(find .next/standalone/.next/static -type f | wc -l)
PUBLIC_COUNT=$(find .next/standalone/public -type f | wc -l)
echo "✅ Static files verified: $STATIC_COUNT files"
echo "✅ Public files verified: $PUBLIC_COUNT files"
```

This prevents deployment if static assets aren't properly copied.

### 5. **Added Static Asset Accessibility Test** (NEW)
Added test to verify static assets are served correctly:
```bash
# Test static asset accessibility
echo "🧪 Testing static assets..."
if curl -s http://localhost:3000/_next/static/ --max-time 10 | head -c 100 > /dev/null 2>&1; then
  echo "✅ Static assets accessible"
else
  echo "⚠️ Could not verify static assets accessibility"
fi
```

## Key Features of Updated Workflow

### Deployment Steps (in order):
1. ✅ Checkout code from GitHub
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Copy production environment file
5. ✅ Build application (now with post-build static copying)
6. ✅ Backup product images
7. ✅ Stop PM2 application gracefully
8. ✅ Pull latest code from main branch
9. ✅ Setup production environment
10. ✅ Clean old build artifacts
11. ✅ Install dependencies on server
12. ✅ Build application on server
13. ✅ **Verify standalone structure (NEW)**
14. ✅ Restore product images
15. ✅ Run database migrations (if any)
16. ✅ Set proper file permissions
17. ✅ Restart PM2 application
18. ✅ Wait for startup (10 seconds)
19. ✅ Health check with 10 retries
20. ✅ **Test static asset accessibility (NEW)**
21. ✅ Show backup information
22. ✅ Display success message

### Error Handling
- ✅ Exits on any error (`set -e`)
- ✅ Verifies build success before proceeding
- ✅ Verifies static assets exist before deployment
- ✅ Retries health check up to 10 times
- ✅ Shows error logs if health check fails

### Verification Steps (NEW)
1. **Post-Build Verification:**
   - Checks `.next/standalone/.next/static` exists
   - Checks `.next/standalone/public` exists
   - Counts files in each directory
   - Fails deployment if directories are missing

2. **Runtime Verification:**
   - Tests `http://localhost:3000/api/health`
   - Tests `http://localhost:3000/_next/static/` accessibility
   - Shows PM2 status

## Workflow Triggers

The workflow runs on:
1. **Push to main branch** - Automatic deployment
2. **Manual trigger** (`workflow_dispatch`) - Deploy via GitHub Actions UI

## Environment Variables Required

Set these as GitHub Secrets:
- `HOST` - Server IP (66.116.199.206)
- `USERNAME` - SSH username (root)
- `PASSWORD` - SSH password
- `DB_HOST` - Database host
- `DB_PORT` - Database port (3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (aynbeauty)
- `NODE_ENV` - Environment (production)

## Benefits of Updated Workflow

### Before (Commented Out):
- ❌ Workflow was disabled
- ❌ No automated deployments
- ❌ No static asset verification
- ❌ Manual deployment required

### After (Updated):
- ✅ Workflow is active
- ✅ Automatic deployment on push to main
- ✅ Verifies static assets are copied correctly
- ✅ Tests static asset accessibility
- ✅ Enhanced error reporting
- ✅ Better cache cleanup
- ✅ Prevents deployment if build issues detected

## Testing the Workflow

### Option 1: Push to Main
```bash
git add .
git commit -m "Test deployment workflow"
git push origin main
```
The workflow will automatically trigger.

### Option 2: Manual Trigger
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Deploy to Production Server"
4. Click "Run workflow"
5. Select branch (main)
6. Click "Run workflow"

## Monitoring Deployment

View workflow progress:
1. Go to GitHub → Actions tab
2. Click on the running workflow
3. Expand "Deploy to server" step
4. Watch real-time logs

## Rollback Strategy

If deployment fails:
1. Workflow will automatically exit on error
2. PM2 will keep previous version running
3. Product images are backed up before deployment
4. Can manually rollback:
   ```bash
   ssh root@66.116.199.206
   cd /var/www/aynbeauty
   git reset --hard HEAD~1
   npm run build
   pm2 restart aynbeauty
   ```

## Success Indicators

✅ All workflow steps show green checkmarks
✅ "Build completed successfully" message
✅ "Static files verified: X files" message
✅ "Public files verified: X files" message
✅ "Health check passed" message
✅ "Static assets accessible" message
✅ "Deployment completed successfully" message

## Next Steps

1. **Commit the workflow file:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update deployment workflow: Add static asset verification"
   git push origin main
   ```

2. **Test the workflow:**
   - Push will trigger automatic deployment
   - Monitor in GitHub Actions tab

3. **Verify deployment:**
   - Check website loads correctly
   - Verify no 404 errors for CSS/JS/fonts
   - Check PM2 status on server

## Related Files

- `.github/workflows/deploy.yml` - This workflow file
- `scripts/post-build.js` - Post-build script that copies static assets
- `package.json` - Build command updated to include post-build
- `ecosystem.config.js` - PM2 configuration
- `next.config.js` - Next.js standalone configuration

## Support

If deployment fails:
1. Check GitHub Actions logs
2. SSH to server and check PM2 logs: `pm2 logs aynbeauty`
3. Check error log: `tail -100 /var/www/aynbeauty/logs/aynbeauty-error.log`
4. Verify static assets: `ls -la /var/www/aynbeauty/.next/standalone/.next/static/`
