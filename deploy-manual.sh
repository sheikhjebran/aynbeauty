#!/bin/bash

# Manual deployment script for aynbeauty
# Usage: bash deploy-manual.sh

set -e

echo "🚀 AYN Beauty Manual Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/aynbeauty"
BACKUP_DIR="/var/backups/aynbeauty"
IMAGES_DIR="$PROJECT_DIR/public/uploads/products"
BACKUP_IMAGES_DIR="$BACKUP_DIR/product-images-$(date +%Y%m%d-%H%M%S)"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
  echo -e "${RED}Error: This script requires root or sudo privileges${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}Step 1: Backup product images${NC}"
mkdir -p "$BACKUP_DIR"
mkdir -p "$IMAGES_DIR"

if [ -d "$IMAGES_DIR" ] && [ "$(ls -A $IMAGES_DIR)" ]; then
  mkdir -p "$BACKUP_IMAGES_DIR"
  cp -r "$IMAGES_DIR"/* "$BACKUP_IMAGES_DIR/" 2>/dev/null || true
  echo -e "${GREEN}✅ Product images backed up${NC}"
else
  echo -e "${YELLOW}ℹ️  No existing product images found${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Stop application${NC}"
cd "$PROJECT_DIR"
if pm2 desc aynbeauty > /dev/null 2>&1; then
  pm2 stop aynbeauty
  sleep 2
  echo -e "${GREEN}✅ Application stopped${NC}"
else
  echo -e "${YELLOW}ℹ️  Application not running${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3: Clean build artifacts${NC}"
rm -rf .next .turbo dist .nextwebpackcache || true
echo -e "${GREEN}✅ Old artifacts cleaned${NC}"

echo ""
echo -e "${YELLOW}Step 4: Pull latest code${NC}"
git fetch origin main
git reset --hard origin/main
echo -e "${GREEN}✅ Code updated${NC}"

echo ""
echo -e "${YELLOW}Step 5: Setup environment${NC}"
if [ -f ".env.prod" ]; then
  cp .env.prod .env.local
  echo -e "${GREEN}✅ Production environment configured${NC}"
else
  echo -e "${RED}Error: .env.prod not found${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}Step 6: Install dependencies${NC}"
npm ci --production=false
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo -e "${YELLOW}Step 7: Build application${NC}"
npm run build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build completed successfully${NC}"
else
  echo -e "${RED}❌ Build failed!${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}Step 8: Restore product images${NC}"
mkdir -p "$IMAGES_DIR"
if [ -d "$BACKUP_IMAGES_DIR" ] && [ "$(ls -A $BACKUP_IMAGES_DIR)" ]; then
  cp -r "$BACKUP_IMAGES_DIR"/* "$IMAGES_DIR/" 2>/dev/null || true
  echo -e "${GREEN}✅ Product images restored${NC}"
else
  echo -e "${YELLOW}ℹ️  No backup images to restore${NC}"
fi

echo ""
echo -e "${YELLOW}Step 9: Set file permissions${NC}"
sudo chown -R www-data:www-data "$PROJECT_DIR" 2>/dev/null || chown -R nobody "$PROJECT_DIR"
sudo chmod -R 755 "$PROJECT_DIR" 2>/dev/null || chmod -R 755 "$PROJECT_DIR"
sudo chmod -R 775 "$IMAGES_DIR" 2>/dev/null || chmod -R 775 "$IMAGES_DIR"
echo -e "${GREEN}✅ Permissions set${NC}"

echo ""
echo -e "${YELLOW}Step 10: Kill PM2 daemon and restart${NC}"
pm2 kill
sleep 2
pm2 start ecosystem.config.js
echo -e "${GREEN}✅ Application started${NC}"

echo ""
echo -e "${YELLOW}Step 11: Wait for application to boot${NC}"
sleep 10

echo ""
echo -e "${YELLOW}Step 12: Check PM2 status${NC}"
pm2 status
pm2 info aynbeauty

echo ""
echo -e "${YELLOW}Step 13: Test application health${NC}"
RETRY_COUNT=0
MAX_RETRIES=15
HEALTH_OK=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo -n "."
  if curl -f http://localhost:3000/api/health --max-time 5 --silent > /dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}✅ Health check passed${NC}"
    HEALTH_OK=true
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  sleep 2
done

if [ "$HEALTH_OK" = false ]; then
  echo ""
  echo -e "${YELLOW}⚠️  Health check failed after $MAX_RETRIES attempts${NC}"
  echo ""
  echo "Last 50 lines of error log:"
  tail -50 "$PROJECT_DIR/logs/aynbeauty-error.log" 2>/dev/null || echo "No error log available"
  exit 1
fi

echo ""
echo -e "${GREEN}========================================"
echo "✅ Deployment completed successfully!"
echo "========================================"
echo "Application URL: http://66.116.199.206:3000"
echo "Monitor logs: pm2 logs aynbeauty"
echo "========================================"
