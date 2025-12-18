# Production Debugging Guide

## Current Issues

### TypeError: Cannot read properties of null (reading 'digest')

**Root Cause**: This is a known issue in Next.js 14.2.33 when there's a mismatch between build artifacts and the deployed server, or when React Server Components encounter rendering issues.

**Symptoms**:
- Error appears when accessing any page
- Error message: `TypeError: Cannot read properties of null (reading 'digest')`
- Cascading "Failed to find Server Action" errors

## Solutions to Try (in order)

### 1. Full Clean Rebuild (FIRST TRY THIS)

```bash
# On the production server:
cd /var/www/aynbeauty

# Stop the app
pm2 stop aynbeauty

# Delete all build artifacts
rm -rf .next .turbo dist

# Kill PM2 daemon completely
pm2 kill

# Rebuild
npm ci
npm run build

# Start fresh
pm2 start ecosystem.config.js

# Monitor
pm2 logs aynbeauty
```

### 2. Check Node.js Version

The server uses Node.js v22.21.1. Next.js 14.2.33 might have compatibility issues. Try:

```bash
# Check version
node --version

# Should be >= 18.17.0
# If issues persist with v22, consider downgrading to v18 LTS
```

### 3. Verify .env.local Configuration

```bash
# Ensure these are set on server
cat /var/www/aynbeauty/.env.local

# Key variables needed:
# - JWT_SECRET
# - DATABASE_URL or individual DB_* vars
# - NODE_ENV=production
```

### 4. Disable Next.js Caching Issues

If the above doesn't work, we may need to disable server-side rendering optimization:

**In next.config.js**, add:
```javascript
experimental: {
  esmExternals: false,
  serverComponentsExternalPackages: [],
}
```

### 5. Check for Circular Dependencies

If none of the above works, run this command to detect issues:

```bash
# Analyze bundle (requires local build)
npm run build -- --analyze
```

### 6. Upgrade Next.js

If issues persist, consider upgrading to Next.js 14.2.34 or later:

```bash
npm install next@latest
npm run build
pm2 restart aynbeauty
```

## Monitoring Checklist

When deploying, monitor these:

1. **Application startup**
   ```bash
   pm2 logs aynbeauty --lines 100
   ```

2. **Health endpoint**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Homepage load**
   ```bash
   curl -v http://localhost:3000/ 2>&1 | head -50
   ```

4. **PM2 status**
   ```bash
   pm2 status
   pm2 info aynbeauty
   ```

## Key Files Modified

- `next.config.js` - Added cache optimization options
- `ecosystem.config.js` - Uses `.next/standalone/server.js` 
- `deploy.yml` - Added clean build step and better health checks
- `src/app/page.tsx` - Added null checks to CategoryImage
- `src/components/ui/ProductImage.tsx` - Added null checks
- `src/contexts/ImageCacheContext.tsx` - Added null URL handling
- `src/app/layout.tsx` - Removed problematic image metadata

## If Still Failing

The digest error in Next.js 14.2.33 is sometimes a symptom of:

1. **Memory issues** - Server running out of memory during rendering
2. **Stale node_modules** - Some packages not properly installed
3. **React version mismatch** - Dependencies conflicting
4. **Build cache corruption** - .next directory corrupted

### Nuclear Option (Last Resort)


```bash
# On production server
cd /var/www/aynbeauty

pm2 kill
rm -rf .next .turbo node_modules package-lock.json
npm cache clean --force
npm install
npm run build

# Start with verbose logging
NODE_DEBUG=* pm2 start ecosystem.config.js --no-daemon
```

## References

- Next.js Issue: https://github.com/vercel/next.js/issues/58475
- React Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Standalone mode: https://nextjs.org/docs/advanced-features/output-file-tracing
