#!/bin/bash
# Emergency fix script - run this on the production server to fix current deployment
set -e

echo "🚨 Emergency Production Fix Starting..."
cd /var/www/aynbeauty

# Stop PM2
echo "⏹️ Stopping PM2..."
pm2 delete aynbeauty 2>/dev/null || echo "Process not found, continuing..."

# Copy environment variables to standalone
echo "🔐 Copying environment variables..."
if [ -f ".env.local" ]; then
  cp .env.local .next/standalone/.env.local
  echo "✅ Environment variables copied"
else
  echo "⚠️ .env.local not found! Copying .env.prod..."
  cp .env.prod .next/standalone/.env.local
fi

# Ensure public files are properly synced to standalone
echo "📁 Syncing public directory to standalone..."
rsync -av --delete public/ .next/standalone/public/ || cp -rf public/* .next/standalone/public/

# Verify site.webmanifest exists
echo "🔍 Checking site.webmanifest..."
if [ ! -f ".next/standalone/public/site.webmanifest" ]; then
  echo "⚠️ site.webmanifest missing! Creating default..."
  cat > .next/standalone/public/site.webmanifest << 'EOF'
{
  "name": "Ayn Beauty",
  "short_name": "Ayn Beauty",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ec4899",
  "background_color": "#ffffff",
  "display": "standalone"
}
EOF
  echo "✅ Default manifest created"
fi

# List what's in standalone/public
echo "📂 Contents of .next/standalone/public:"
ls -lah .next/standalone/public/ | head -20

# Start PM2 from root directory
echo "🔄 Starting PM2..."
pm2 start ecosystem.config.js --update-env
pm2 save

# Wait for startup
echo "⏳ Waiting 10 seconds for startup..."
sleep 10

# Check status
echo "📊 PM2 Status:"
pm2 list
pm2 info aynbeauty

# Test health
echo "🧪 Testing health endpoint..."
curl -f http://localhost:3000/api/health || echo "⚠️ Health check failed"

echo ""
echo "✅ Emergency fix complete!"
echo "Check logs with: pm2 logs aynbeauty"
