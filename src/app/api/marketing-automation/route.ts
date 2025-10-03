import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import { RowDataPacket, OkPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

interface AutomationRule extends RowDataPacket {
  id: number
  name: string
  trigger_type: string
  trigger_conditions: any
  action_type: string
  action_config: any
  is_active: boolean
  created_at: string
}

interface CustomerSegment extends RowDataPacket {
  id: number
  name: string
  description: string
  criteria: any
  customer_count: number
  created_at: string
}

interface MarketingCampaign extends RowDataPacket {
  id: number
  name: string
  type: string
  status: string
  target_segment_id: number
  content: any
  schedule: any
  metrics: any
  created_at: string
}

// GET: Fetch marketing automation data
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.email !== 'admin@aynbeauty.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'overview'
    const automationId = url.searchParams.get('automation_id')
    const segmentId = url.searchParams.get('segment_id')

    const connection = await dbConnect.getConnection()
    
    try {
      let data = {}

      switch (type) {
        case 'overview':
          data = await getAutomationOverview(connection)
          break

        case 'rules':
          data = await getAutomationRules(connection)
          break

        case 'segments':
          data = await getCustomerSegments(connection)
          break

        case 'campaigns':
          data = await getMarketingCampaigns(connection)
          break

        case 'automation_detail':
          if (automationId) {
            data = await getAutomationDetail(parseInt(automationId), connection)
          }
          break

        case 'segment_detail':
          if (segmentId) {
            data = await getSegmentDetail(parseInt(segmentId), connection)
          }
          break

        case 'triggers':
          data = await getAvailableTriggers()
          break

        case 'actions':
          data = await getAvailableActions()
          break

        case 'performance':
          data = await getAutomationPerformance(connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
      }

      return NextResponse.json(data)

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching marketing automation data:', error)
    return NextResponse.json(
      { message: 'Failed to fetch automation data' },
      { status: 500 }
    )
  }
}

// POST: Create automation rules, segments, or campaigns
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.email !== 'admin@aynbeauty.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action, data } = body

    const connection = await dbConnect.getConnection()

    try {
      let result

      switch (action) {
        case 'create_automation':
          result = await createAutomationRule(data, connection)
          break

        case 'create_segment':
          result = await createCustomerSegment(data, connection)
          break

        case 'create_campaign':
          result = await createMarketingCampaign(data, connection)
          break

        case 'trigger_automation':
          result = await triggerAutomation(data, connection)
          break

        case 'test_segment':
          result = await testSegmentCriteria(data, connection)
          break

        case 'send_campaign':
          result = await sendCampaign(data, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
      }

      return NextResponse.json(result)

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error processing marketing automation:', error)
    return NextResponse.json(
      { message: 'Failed to process automation' },
      { status: 500 }
    )
  }
}

// PUT: Update automation rules, segments, or campaigns
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.email !== 'admin@aynbeauty.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { type, id, data } = body

    const connection = await dbConnect.getConnection()

    try {
      switch (type) {
        case 'automation':
          await updateAutomationRule(id, data, connection)
          break

        case 'segment':
          await updateCustomerSegment(id, data, connection)
          break

        case 'campaign':
          await updateMarketingCampaign(id, data, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Updated successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error updating marketing automation:', error)
    return NextResponse.json(
      { message: 'Failed to update automation' },
      { status: 500 }
    )
  }
}

async function getAutomationOverview(connection: any) {
  const [automationStats] = await connection.execute(
    `SELECT 
       COUNT(*) as total_automations,
       COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_automations,
       COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_automations
     FROM automation_rules`,
    []
  )

  const [segmentStats] = await connection.execute(
    `SELECT 
       COUNT(*) as total_segments,
       SUM(customer_count) as total_segmented_customers
     FROM customer_segments`,
    []
  )

  const [campaignStats] = await connection.execute(
    `SELECT 
       COUNT(*) as total_campaigns,
       COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_campaigns
     FROM marketing_campaigns`,
    []
  )

  const [recentActivity] = await connection.execute(
    `SELECT 
       'automation' as type, name, created_at
     FROM automation_rules
     ORDER BY created_at DESC
     LIMIT 5
     UNION ALL
     SELECT 
       'campaign' as type, name, created_at
     FROM marketing_campaigns
     ORDER BY created_at DESC
     LIMIT 5
     ORDER BY created_at DESC
     LIMIT 10`,
    []
  )

  return {
    automation_stats: automationStats[0],
    segment_stats: segmentStats[0],
    campaign_stats: campaignStats[0],
    recent_activity: recentActivity
  }
}

async function getAutomationRules(connection: any) {
  const [rules] = await connection.execute(
    `SELECT ar.*, 
            COUNT(ae.id) as total_executions,
            COUNT(CASE WHEN ae.status = 'success' THEN 1 END) as successful_executions
     FROM automation_rules ar
     LEFT JOIN automation_executions ae ON ar.id = ae.rule_id
     GROUP BY ar.id
     ORDER BY ar.created_at DESC`,
    []
  ) as [AutomationRule[], any]

  return { rules }
}

async function getCustomerSegments(connection: any) {
  const [segments] = await connection.execute(
    `SELECT * FROM customer_segments 
     ORDER BY created_at DESC`,
    []
  ) as [CustomerSegment[], any]

  return { segments }
}

async function getMarketingCampaigns(connection: any) {
  const [campaigns] = await connection.execute(
    `SELECT mc.*, cs.name as segment_name 
     FROM marketing_campaigns mc
     LEFT JOIN customer_segments cs ON mc.target_segment_id = cs.id
     ORDER BY mc.created_at DESC`,
    []
  ) as [MarketingCampaign[], any]

  return { campaigns }
}

async function createAutomationRule(data: any, connection: any) {
  const {
    name,
    trigger_type,
    trigger_conditions,
    action_type,
    action_config,
    is_active = true
  } = data

  const [result] = await connection.execute(
    `INSERT INTO automation_rules 
     (name, trigger_type, trigger_conditions, action_type, action_config, is_active) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      trigger_type,
      JSON.stringify(trigger_conditions),
      action_type,
      JSON.stringify(action_config),
      is_active
    ]
  ) as [any, any]

  // Schedule the automation trigger
  await scheduleAutomationTrigger(result.insertId, trigger_type, trigger_conditions, connection)

  return {
    automation_id: result.insertId,
    message: 'Automation rule created successfully'
  }
}

async function createCustomerSegment(data: any, connection: any) {
  const { name, description, criteria } = data

  const [result] = await connection.execute(
    `INSERT INTO customer_segments (name, description, criteria, customer_count) 
     VALUES (?, ?, ?, 0)`,
    [name, description, JSON.stringify(criteria)]
  ) as [any, any]

  // Calculate initial customer count
  const customerCount = await calculateSegmentSize(criteria, connection)
  
  await connection.execute(
    `UPDATE customer_segments SET customer_count = ? WHERE id = ?`,
    [customerCount, result.insertId]
  )

  return {
    segment_id: result.insertId,
    customer_count: customerCount,
    message: 'Customer segment created successfully'
  }
}

async function createMarketingCampaign(data: any, connection: any) {
  const {
    name,
    type,
    target_segment_id,
    content,
    schedule,
    auto_send = false
  } = data

  const [result] = await connection.execute(
    `INSERT INTO marketing_campaigns 
     (name, type, status, target_segment_id, content, schedule, metrics) 
     VALUES (?, ?, 'draft', ?, ?, ?, '{}')`,
    [
      name,
      type,
      target_segment_id,
      JSON.stringify(content),
      JSON.stringify(schedule)
    ]
  ) as [any, any]

  if (auto_send) {
    await scheduleCampaignSend(result.insertId, schedule, connection)
  }

  return {
    campaign_id: result.insertId,
    message: 'Marketing campaign created successfully'
  }
}

async function triggerAutomation(data: any, connection: any) {
  const { rule_id, user_id, trigger_data } = data

  // Get automation rule
  const [rule] = await connection.execute(
    `SELECT * FROM automation_rules WHERE id = ? AND is_active = 1`,
    [rule_id]
  ) as [AutomationRule[], any]

  if (rule.length === 0) {
    throw new Error('Automation rule not found or inactive')
  }

  // Execute the automation
  const executionResult = await executeAutomation(rule[0], user_id, trigger_data, connection)

  // Log execution
  await connection.execute(
    `INSERT INTO automation_executions 
     (rule_id, user_id, trigger_data, result, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      rule_id,
      user_id,
      JSON.stringify(trigger_data),
      JSON.stringify(executionResult),
      executionResult.success ? 'success' : 'failed'
    ]
  )

  return executionResult
}

async function executeAutomation(rule: AutomationRule, userId: number, triggerData: any, connection: any) {
  try {
    const actionConfig = JSON.parse(rule.action_config)

    switch (rule.action_type) {
      case 'send_email':
        return await sendAutomatedEmail(userId, actionConfig, connection)

      case 'add_to_segment':
        return await addUserToSegment(userId, actionConfig.segment_id, connection)

      case 'apply_discount':
        return await applyAutomatedDiscount(userId, actionConfig, connection)

      case 'send_notification':
        return await sendAutomatedNotification(userId, actionConfig, connection)

      case 'update_loyalty_points':
        return await updateLoyaltyPoints(userId, actionConfig.points, actionConfig.reason, connection)

      case 'create_personalized_offer':
        return await createPersonalizedOffer(userId, actionConfig, connection)

      default:
        throw new Error(`Unknown action type: ${rule.action_type}`)
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}

async function sendAutomatedEmail(userId: number, config: any, connection: any) {
  // Get user details
  const [user] = await connection.execute(
    `SELECT email, first_name, last_name FROM users WHERE id = ?`,
    [userId]
  )

  if (user.length === 0) {
    throw new Error('User not found')
  }

  const emailData = {
    to: user[0].email,
    subject: config.subject,
    template: config.template,
    personalizations: {
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      ...config.personalizations
    }
  }

  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  const emailResult = await mockSendEmail(emailData)

  // Log email
  await connection.execute(
    `INSERT INTO automated_emails (user_id, template, subject, status, sent_at) 
     VALUES (?, ?, ?, ?, NOW())`,
    [userId, config.template, config.subject, emailResult.success ? 'sent' : 'failed']
  )

  return emailResult
}

async function addUserToSegment(userId: number, segmentId: number, connection: any) {
  await connection.execute(
    `INSERT IGNORE INTO segment_members (segment_id, user_id, added_at) 
     VALUES (?, ?, NOW())`,
    [segmentId, userId]
  )

  return {
    success: true,
    message: 'User added to segment',
    timestamp: new Date().toISOString()
  }
}

async function applyAutomatedDiscount(userId: number, config: any, connection: any) {
  const couponCode = `AUTO_${userId}_${Date.now()}`

  await connection.execute(
    `INSERT INTO user_coupons 
     (user_id, code, discount_type, discount_value, valid_until, usage_limit) 
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), 1)`,
    [
      userId,
      couponCode,
      config.discount_type,
      config.discount_value,
      config.validity_days || 30
    ]
  )

  return {
    success: true,
    coupon_code: couponCode,
    discount_value: config.discount_value,
    timestamp: new Date().toISOString()
  }
}

async function sendAutomatedNotification(userId: number, config: any, connection: any) {
  await connection.execute(
    `INSERT INTO user_notifications 
     (user_id, type, title, message, action_url) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, config.type, config.title, config.message, config.action_url]
  )

  return {
    success: true,
    message: 'Notification sent',
    timestamp: new Date().toISOString()
  }
}

async function updateLoyaltyPoints(userId: number, points: number, reason: string, connection: any) {
  // Add points transaction
  await connection.execute(
    `INSERT INTO loyalty_point_transactions 
     (user_id, points, transaction_type, description) 
     VALUES (?, ?, 'earned', ?)`,
    [userId, points, reason]
  )

  // Update user's loyalty account
  await connection.execute(
    `UPDATE loyalty_accounts 
     SET current_points = current_points + ?, total_points = total_points + ? 
     WHERE user_id = ?`,
    [points, points, userId]
  )

  return {
    success: true,
    points_added: points,
    reason,
    timestamp: new Date().toISOString()
  }
}

async function createPersonalizedOffer(userId: number, config: any, connection: any) {
  // Get user preferences and purchase history
  const [userProfile] = await connection.execute(
    `SELECT up.*, la.tier_id 
     FROM user_preferences up
     LEFT JOIN loyalty_accounts la ON up.user_id = la.user_id
     WHERE up.user_id = ?`,
    [userId]
  )

  // Create personalized offer based on profile
  const offer = {
    user_id: userId,
    offer_type: config.offer_type,
    discount_percentage: config.base_discount + (userProfile[0]?.tier_id || 0) * 5,
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    conditions: config.conditions
  }

  const [result] = await connection.execute(
    `INSERT INTO personalized_offers 
     (user_id, offer_type, discount_percentage, conditions, valid_until, status) 
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [offer.user_id, offer.offer_type, offer.discount_percentage, JSON.stringify(offer.conditions), offer.valid_until]
  ) as [any, any]

  return {
    success: true,
    offer_id: result.insertId,
    offer,
    timestamp: new Date().toISOString()
  }
}

async function calculateSegmentSize(criteria: any, connection: any): Promise<number> {
  // Build dynamic query based on criteria
  let query = 'SELECT COUNT(DISTINCT u.id) as count FROM users u'
  let joins = ''
  let conditions = ['1=1']
  const params: any[] = []

  if (criteria.age_range) {
    conditions.push('u.date_of_birth BETWEEN ? AND ?')
    params.push(criteria.age_range.start, criteria.age_range.end)
  }

  if (criteria.total_spent) {
    joins += ' LEFT JOIN (SELECT user_id, SUM(total_amount) as total_spent FROM orders WHERE order_status = "delivered" GROUP BY user_id) os ON u.id = os.user_id'
    conditions.push('COALESCE(os.total_spent, 0) >= ?')
    params.push(criteria.total_spent.min)
  }

  if (criteria.loyalty_tier) {
    joins += ' LEFT JOIN loyalty_accounts la ON u.id = la.user_id'
    conditions.push('la.tier_id = ?')
    params.push(criteria.loyalty_tier)
  }

  if (criteria.last_purchase_days) {
    joins += ' LEFT JOIN (SELECT user_id, MAX(created_at) as last_order FROM orders GROUP BY user_id) lo ON u.id = lo.user_id'
    conditions.push('lo.last_order >= DATE_SUB(NOW(), INTERVAL ? DAY)')
    params.push(criteria.last_purchase_days)
  }

  const fullQuery = `${query}${joins} WHERE ${conditions.join(' AND ')}`

  const [result] = await connection.execute(fullQuery, params)
  return result[0].count
}

async function getAvailableTriggers() {
  return {
    triggers: [
      {
        type: 'user_registration',
        name: 'User Registration',
        description: 'Triggered when a new user registers',
        conditions: ['immediate', 'after_delay']
      },
      {
        type: 'purchase_completed',
        name: 'Purchase Completed',
        description: 'Triggered when a user completes a purchase',
        conditions: ['immediate', 'after_delay', 'order_value_threshold']
      },
      {
        type: 'cart_abandoned',
        name: 'Cart Abandoned',
        description: 'Triggered when user abandons cart',
        conditions: ['after_delay', 'cart_value_threshold']
      },
      {
        type: 'product_viewed',
        name: 'Product Viewed',
        description: 'Triggered when user views a product',
        conditions: ['immediate', 'view_count_threshold']
      },
      {
        type: 'loyalty_tier_upgrade',
        name: 'Loyalty Tier Upgrade',
        description: 'Triggered when user upgrades loyalty tier',
        conditions: ['immediate']
      },
      {
        type: 'birthday',
        name: 'Birthday',
        description: 'Triggered on user birthday',
        conditions: ['on_date', 'days_before']
      },
      {
        type: 'inactivity',
        name: 'User Inactivity',
        description: 'Triggered when user is inactive for specified period',
        conditions: ['days_inactive']
      }
    ]
  }
}

async function getAvailableActions() {
  return {
    actions: [
      {
        type: 'send_email',
        name: 'Send Email',
        description: 'Send personalized email to user',
        config_fields: ['template', 'subject', 'personalizations']
      },
      {
        type: 'add_to_segment',
        name: 'Add to Segment',
        description: 'Add user to a customer segment',
        config_fields: ['segment_id']
      },
      {
        type: 'apply_discount',
        name: 'Apply Discount',
        description: 'Create personalized discount coupon',
        config_fields: ['discount_type', 'discount_value', 'validity_days']
      },
      {
        type: 'send_notification',
        name: 'Send Notification',
        description: 'Send in-app notification',
        config_fields: ['type', 'title', 'message', 'action_url']
      },
      {
        type: 'update_loyalty_points',
        name: 'Update Loyalty Points',
        description: 'Add or remove loyalty points',
        config_fields: ['points', 'reason']
      },
      {
        type: 'create_personalized_offer',
        name: 'Create Personalized Offer',
        description: 'Create customized offer based on user profile',
        config_fields: ['offer_type', 'base_discount', 'conditions']
      }
    ]
  }
}

// Mock email service (replace with actual service in production)
async function mockSendEmail(emailData: any) {
  console.log('Sending email:', emailData)
  return {
    success: true,
    message_id: `mock_${Date.now()}`,
    timestamp: new Date().toISOString()
  }
}

// Additional helper functions
async function getAutomationDetail(automationId: number, connection: any) { return {} }
async function getSegmentDetail(segmentId: number, connection: any) { return {} }
async function getAutomationPerformance(connection: any) { return {} }
async function testSegmentCriteria(data: any, connection: any) { return {} }
async function sendCampaign(data: any, connection: any) { return {} }
async function updateAutomationRule(id: number, data: any, connection: any) { return {} }
async function updateCustomerSegment(id: number, data: any, connection: any) { return {} }
async function updateMarketingCampaign(id: number, data: any, connection: any) { return {} }
async function scheduleAutomationTrigger(ruleId: number, triggerType: string, conditions: any, connection: any) { return {} }
async function scheduleCampaignSend(campaignId: number, schedule: any, connection: any) { return {} }