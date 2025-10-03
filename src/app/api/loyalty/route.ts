import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'



export async function GET(request: NextRequest) {

  return NextResponse.json({

    success: true,export async function GET(request: NextRequest) {import { executeQuery } from '@/lib/database'

    data: {

      points: 0,  return NextResponse.json({

      tier: 'Bronze',

      benefits: [],    success: true,// Simple stub for loyalty API to prevent undefined parameter errorsimport jwt from 'jsonwebtoken'

      pointsToNextTier: 100,

      recentTransactions: []    data: {

    }

  })      points: 0,export async function GET(request: NextRequest) {

}

      tier: 'Bronze',

export async function POST(request: NextRequest) {

  return NextResponse.json({      benefits: [],  return NextResponse.json({interface User {

    success: true,

    message: 'Loyalty action completed'      pointsToNextTier: 100,

  })

}      recentTransactions: []    success: true,  id: number

    }

  })    data: {  email: string

}

      points: 0,}

export async function POST(request: NextRequest) {

  return NextResponse.json({      tier: 'Bronze',

    success: true,

    message: 'Loyalty action completed'      benefits: [],// GET - Get user's loyalty program details

  })

}      pointsToNextTier: 100,export async function GET(request: NextRequest) {

      recentTransactions: []  try {

    }    const token = request.headers.get('authorization')?.replace('Bearer ', '')

  })    

}    if (!token) {

      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })

export async function POST(request: NextRequest) {    }

  return NextResponse.json({

    success: true,    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User

    message: 'Loyalty action completed'    const userId = decoded.id

  })

}    // Validate userId
    if (!userId || userId === undefined) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
    }

    // Get user's loyalty program status
    const loyaltyResults = await executeQuery(`
      SELECT 
        lp.*,
        lt.name as tier_name,
        lt.benefits,
        lt.min_points as tier_min_points,
        lt.max_points as tier_max_points,
        lt.discount_percentage,
        lt.free_shipping_threshold,
        lt.early_access
      FROM loyalty_programs lp
      LEFT JOIN loyalty_tiers lt ON lp.tier_id = lt.id
      WHERE lp.user_id = ?
    `, [userId])

    const loyaltyData = Array.isArray(loyaltyResults) ? loyaltyResults[0] : null

    if (!loyaltyData) {
      // Create new loyalty program entry for user
      await executeQuery(
        'INSERT INTO loyalty_programs (user_id, tier_id, total_points, current_points) VALUES (?, ?, ?, ?)',
        [userId, 1, 0, 0] // Start with tier 1 (Bronze)
      )

      const [newLoyaltyData] = await executeQuery(`
        SELECT 
          lp.*,
          lt.name as tier_name,
          lt.benefits,
          lt.min_points as tier_min_points,
          lt.max_points as tier_max_points,
          lt.discount_percentage,
          lt.free_shipping_threshold,
          lt.early_access
        FROM loyalty_programs lp
        LEFT JOIN loyalty_tiers lt ON lp.tier_id = lt.id
        WHERE lp.user_id = ?
      `, [userId])

      return NextResponse.json({ loyalty: newLoyaltyData })
    }

    // Get recent point transactions
    const pointHistory = await executeQuery(`
      SELECT * FROM loyalty_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [userId])

    // Get next tier information
    const [nextTier] = await executeQuery(`
      SELECT * FROM loyalty_tiers 
      WHERE min_points > ? 
      ORDER BY min_points ASC 
      LIMIT 1
    `, [loyaltyData.current_points])

    // Get available rewards
    const availableRewards = await executeQuery(`
      SELECT * FROM loyalty_rewards 
      WHERE required_points <= ? AND is_active = TRUE
      ORDER BY required_points ASC
    `, [loyaltyData.current_points])

    return NextResponse.json({
      loyalty: loyaltyData,
      pointHistory,
      nextTier,
      availableRewards,
      pointsToNextTier: nextTier ? nextTier.min_points - loyaltyData.current_points : 0
    })

  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json(
      { message: 'Failed to fetch loyalty data' },
      { status: 500 }
    )
  }
}

// POST - Add loyalty points or redeem rewards
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const { action, points, reward_id, order_id, transaction_type } = await request.json()

    if (action === 'add_points') {
      // Add points for purchase or activity
      const pointsToAdd = points || 0
      
      if (pointsToAdd <= 0) {
        return NextResponse.json(
          { message: 'Invalid points amount' },
          { status: 400 }
        )
      }

      // Update user's loyalty points
      await executeQuery(`
        UPDATE loyalty_programs 
        SET current_points = current_points + ?, 
            total_points = total_points + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [pointsToAdd, pointsToAdd, userId])

      // Record transaction
      await executeQuery(`
        INSERT INTO loyalty_transactions (
          user_id, points, transaction_type, description, order_id
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        userId, 
        pointsToAdd, 
        transaction_type || 'earned', 
        `Points earned from ${transaction_type || 'purchase'}`,
        order_id || null
      ])

      // Check for tier upgrade
      const [currentLoyalty] = await executeQuery(`
        SELECT current_points, tier_id FROM loyalty_programs WHERE user_id = ?
      `, [userId])

      const [newTier] = await executeQuery(`
        SELECT id, name FROM loyalty_tiers 
        WHERE min_points <= ? AND max_points >= ?
        ORDER BY min_points DESC 
        LIMIT 1
      `, [currentLoyalty.current_points, currentLoyalty.current_points])

      if (newTier && newTier.id !== currentLoyalty.tier_id) {
        await executeQuery(`
          UPDATE loyalty_programs SET tier_id = ? WHERE user_id = ?
        `, [newTier.id, userId])

        return NextResponse.json({
          message: 'Points added successfully',
          pointsAdded: pointsToAdd,
          tierUpgrade: {
            newTier: newTier.name,
            tierId: newTier.id
          }
        })
      }

      return NextResponse.json({
        message: 'Points added successfully',
        pointsAdded: pointsToAdd
      })

    } else if (action === 'redeem_reward') {
      // Redeem a loyalty reward
      if (!reward_id) {
        return NextResponse.json(
          { message: 'Reward ID is required' },
          { status: 400 }
        )
      }

      // Get reward details
      const [reward] = await executeQuery(`
        SELECT * FROM loyalty_rewards WHERE id = ? AND is_active = TRUE
      `, [reward_id])

      if (!reward) {
        return NextResponse.json(
          { message: 'Reward not found' },
          { status: 404 }
        )
      }

      // Check if user has enough points
      const [userLoyalty] = await executeQuery(`
        SELECT current_points FROM loyalty_programs WHERE user_id = ?
      `, [userId])

      if (userLoyalty.current_points < reward.required_points) {
        return NextResponse.json(
          { message: 'Insufficient points' },
          { status: 400 }
        )
      }

      // Deduct points
      await executeQuery(`
        UPDATE loyalty_programs 
        SET current_points = current_points - ?
        WHERE user_id = ?
      `, [reward.required_points, userId])

      // Record redemption transaction
      await executeQuery(`
        INSERT INTO loyalty_transactions (
          user_id, points, transaction_type, description, reward_id
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        userId, 
        -reward.required_points, 
        'redeemed', 
        `Redeemed: ${reward.name}`,
        reward_id
      ])

      // Create reward redemption record
      await executeQuery(`
        INSERT INTO loyalty_redemptions (
          user_id, reward_id, points_used, status
        ) VALUES (?, ?, ?, ?)
      `, [userId, reward_id, reward.required_points, 'pending'])

      return NextResponse.json({
        message: 'Reward redeemed successfully',
        reward: reward.name,
        pointsUsed: reward.required_points
      })

    } else {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error processing loyalty action:', error)
    return NextResponse.json(
      { message: 'Failed to process loyalty action' },
      { status: 500 }
    )
  }
}