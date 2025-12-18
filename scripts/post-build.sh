#!/bin/bash

echo "=== Post-Build: Copy Static Assets for Standalone ==="
echo ""

# Exit on error
set -e

# Check if standalone build exists
if [ ! -d ".next/standalone" ]; then
    echo "✗ .next/standalone not found!"
    echo "Run 'npm run build' first"
    exit 1
fi

echo "1. Copying static files to standalone..."
if [ -d ".next/static" ]; then
    mkdir -p .next/standalone/.next/static
    cp -r .next/static/* .next/standalone/.next/static/
    echo "✓ Static files copied"
else
    echo "✗ .next/static not found!"
    exit 1
fi

echo ""
echo "2. Copying public directory to standalone..."
if [ -d "public" ]; then
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/
    echo "✓ Public files copied"
else
    echo "⚠ No public directory found (this might be OK)"
fi

echo ""
echo "3. Verifying standalone structure..."
echo "Checking critical files..."

CRITICAL_FILES=(
    ".next/standalone/server.js"
    ".next/standalone/.next/static"
    ".next/standalone/public"
)

ALL_PRESENT=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file MISSING!"
        ALL_PRESENT=false
    fi
done

echo ""
if [ "$ALL_PRESENT" = true ]; then
    echo "✓ All critical files present"
    echo ""
    echo "Standalone build is ready!"
    echo "Start with: pm2 start ecosystem.config.js"
else
    echo "✗ Some files are missing!"
    exit 1
fi
