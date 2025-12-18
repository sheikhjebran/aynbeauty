# Deployment Workflow Analysis & Issues

## Current Deployment Flow (deploy.yml)

### Flow Breakdown:
1. **GitHub Actions Runner (ubuntu-latest)**
   - Checks out code
   - Sets up Node 18
   - Installs dependencies (`npm ci`)
   - Copies `.env.prod` to `.env.local`
   - **Builds the app** ← Build happens HERE

2. **SSH to Production Server**
   - Navigates to `/var/www/aynbeauty`
   - Stops PM2
   - Pulls latest code (`git reset --hard origin/main`)
   - Installs dependencies (`npm ci`)
   - **Builds AGAIN** ← Second build HERE
   - Restarts PM2

## PROBLEMS IDENTIFIED

### 🔴 Problem 1: Double Building (Wasteful but not causing 502)
The workflow builds on GitHub Actions runner, then builds again on the server. The GitHub build is never used.

**Impact:** Slow deployment, wasted resources  
**Severity:** Low  
**Fix:** Remove the build step from GitHub Actions OR don't rebuild on server

### 🔴 Problem 2: Deploy.yml Doesn't Match Manual Deployment
Your GitHub Actions deploy pushes changes, but you're manually deploying directly on server without triggering the workflow.

**Impact:** GitHub Actions deploy and manual deploy are different  
**Severity:** Medium  
**Current State:** You're NOT using GitHub Actions for deployment

### 🔴 Problem 3: No Clean Build in deploy.yml
The deployment script does NOT remove `.next` before building.

**Impact:** Old cached build artifacts cause digest errors  
**Severity:** **HIGH - THIS IS LIKELY THE ROOT CAUSE**

```bash
# Current deploy.yml line 76:
rm -rf .next dist .turbo || true

# Problem: This line might fail silently (|| true)
# and leaves .next/export which blocks rebuild
```

### 🔴 Problem 4: No Verification of Fixes Applied
The deployment doesn't check if the SSR safety checks are in the code.

**Impact:** Can deploy broken code  
**Severity:** Medium

### 🔴 Problem 5: Health Check Timeout Too Short
Health check only retries 10 times with 5s delay = 50 seconds max. Next.js needs longer on first start.

**Impact:** False deployment failure  
**Severity:** Low

## RECOMMENDED FIXES

### Option A: Fix the GitHub Actions Workflow

```yaml
# Add before build (line 76):
- name: Clean build artifacts completely
  run: |
    rm -rf .next/export || true
    chmod -R 777 .next || true
    rm -rf .next || true

# Verify SSR fixes (add new step):
- name: Verify SSR safety checks
  run: |
    if ! grep -q "typeof window !== 'undefined'" src/contexts/AuthContext.tsx; then
      echo "ERROR: AuthContext missing SSR safety checks!"
      exit 1
    fi
    echo "✓ SSR safety checks verified"

# In deploy script, improve clean:
rm -rf .next/export
rm -rf .next/static
rm -rf .next/cache
rm -rf .next

# Increase health check timeout:
MAX_RETRIES=20  # was 10
sleep 10  # was 5
```

### Option B: Use Manual Deployment (Current Approach)

Since you're deploying manually (not via GitHub Actions), use the comprehensive script:

```bash
cd /var/www/aynbeauty
sudo bash scripts/full-diagnostic-fix.sh
```

## ROOT CAUSE ANALYSIS

Based on the diagnostics, here's what's happening:

1. ✓ Your code HAS the SSR fixes (typeof window checks)
2. ✗ The BUILD still has old code cached in `.next` directory
3. ✗ PM2 is running the OLD build with digest errors
4. ✗ When users visit, the old build crashes with digest errors
5. ↻ PM2 auto-restarts, users get 502

**Why it's not fixed yet:**
- The `.next/export` directory is blocking clean rebuild
- `rm -rf .next` in deploy.yml might fail due to permissions
- PM2 might be serving cached version

## IMMEDIATE ACTION PLAN

### Step 1: Run Full Diagnostic (On Server)

```bash
cd /var/www/aynbeauty
chmod +x scripts/full-diagnostic-fix.sh
sudo bash scripts/full-diagnostic-fix.sh
```

This will:
- ✓ Fix nginx duplicates
- ✓ Force clean the .next directory (even .next/export)
- ✓ Verify SSR fixes in code
- ✓ Rebuild completely
- ✓ Restart PM2
- ✓ Monitor for digest errors
- ✓ Report results

### Step 2: If Still Getting Errors

Run this to check what's actually in the build:

```bash
# Check if the build includes your fixes
cd /var/www/aynbeauty
grep -r "typeof window" .next/standalone/ || echo "SSR checks NOT in build!"

# Check build date vs source date
stat .next/standalone/server.js
stat src/contexts/AuthContext.tsx
```

### Step 3: Nuclear Option (If Nothing Works)

```bash
cd /var/www/aynbeauty
pm2 delete aynbeauty
killall node
rm -rf .next node_modules package-lock.json
npm install
npm run build
pm2 start ecosystem.config.js
```

## LONG-TERM FIX

Update your GitHub Actions workflow to properly clean and verify:

```yaml
# Around line 75, replace:
- name: Clean build artifacts
  run: |
    echo "Removing old build..."
    find . -name ".next" -type d -exec rm -rf {} + || true
    rm -rf dist .turbo || true
```

With:

```yaml
- name: Force clean all build artifacts
  run: |
    echo "Force removing all build artifacts..."
    rm -rf .next/export 2>/dev/null || true
    chmod -R 777 .next 2>/dev/null || true  
    rm -rf .next
    rm -rf dist .turbo
    echo "✓ Clean completed"
    
- name: Verify SSR safety before build
  run: |
    echo "Checking for SSR safety in source files..."
    FILES=(
      "src/contexts/AuthContext.tsx"
      "src/contexts/CartContext.tsx" 
      "src/contexts/WishlistContext.tsx"
    )
    for file in "${FILES[@]}"; do
      if ! grep -q "typeof window" "$file"; then
        echo "ERROR: $file missing SSR safety checks!"
        exit 1
      fi
    done
    echo "✓ All files have SSR safety checks"
```

## SUMMARY

**Main Issue:** Old build cached in `.next` directory, not being cleaned properly  
**Why:** `rm -rf .next` failing due to `.next/export` subdirectory  
**Solution:** Force clean with proper permissions before rebuild  
**Script:** `full-diagnostic-fix.sh` handles all of this automatically
