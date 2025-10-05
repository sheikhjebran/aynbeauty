#!/bin/bash

# Quick deployment test script
echo "🚀 Quick deployment for AynBeauty..."

# Basic checks
echo "📋 Checking environment..."
whoami
pwd
node --version
npm --version

# Pull latest changes
echo "📥 Pulling changes..."
git pull origin main

# Copy environment if exists
echo "📋 Setting up environment..."
if [ -f ".env.prod" ]; then
  cp .env.prod .env.local
  echo "✅ Environment copied"
else
  echo "⚠️ .env.prod not found"
fi

# Install and build
echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building..."
npm run build

# Restart with PM2
echo "🔄 Restarting PM2..."
pm2 restart aynbeauty || pm2 start npm --name "aynbeauty" -- start

# Test
echo "🧪 Testing..."
sleep 5
curl -f http://localhost:3000/api/health && echo "✅ Success!" || echo "⚠️ Health check failed"

pm2 status
echo "✅ Quick deployment completed!"