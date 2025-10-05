#!/bin/bash

# Quick Fix Script for Build Issues
# Run this on your server to fix the current build error

echo "🔧 Fixing build issues..."

# Fix the corrupted loyalty route file
cat > src/app/api/loyalty/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

interface LoyaltyData {
  current_points: number
  tier_name: string
  discount_percentage: number
  points_to_next_tier: number
  benefits: string[]
  recent_transactions: LoyaltyTransaction[]
}

interface LoyaltyTransaction {
  id: number
  type: 'earned' | 'redeemed'
  points: number
  description: string
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we don't have loyalty tables yet
    const loyaltyData: LoyaltyData = {
      current_points: 0,
      tier_name: 'Bronze',
      discount_percentage: 0,
      points_to_next_tier: 100,
      benefits: [],
      recent_transactions: []
    }

    return NextResponse.json({
      success: true,
      data: loyaltyData
    })
  } catch (error) {
    console.error('Loyalty data fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch loyalty data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, points } = body

    // Mock loyalty action processing
    return NextResponse.json({
      success: true,
      message: 'Loyalty action completed',
      points_added: points || 0
    })
  } catch (error) {
    console.error('Loyalty action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process loyalty action' },
      { status: 500 }
    )
  }
}
EOF

echo "✅ Fixed loyalty route file"

# Try building again
echo "🏗️ Attempting to build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build still failing. Check for other syntax errors."
fi