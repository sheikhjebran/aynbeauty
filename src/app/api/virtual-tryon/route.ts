import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import { RowDataPacket } from 'mysql2'
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

interface VirtualTryOnSession extends RowDataPacket {
  id: number
  user_id: number
  product_id: number
  session_type: string
  face_image_url: string
  result_image_url: string
  settings: any
  confidence_score: number
  created_at: string
}

interface FaceAnalysis extends RowDataPacket {
  id: number
  user_id: number
  face_shape: string
  skin_tone: string
  eye_color: string
  lip_shape: string
  face_features: any
  analysis_confidence: number
  created_at: string
}

interface ProductVisualization extends RowDataPacket {
  product_id: number
  visualization_type: string
  ar_model_url: string
  color_variants: any
  placement_points: any
  is_active: boolean
}

// GET: Get virtual try-on data and history
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const productId = url.searchParams.get('product_id')
    const sessionId = url.searchParams.get('session_id')

    const connection = await dbConnect.getConnection()
    
    try {
      let data = {}

      switch (type) {
        case 'history':
          data = await getTryOnHistory(user.id, connection)
          break

        case 'face_analysis':
          data = await getFaceAnalysis(user.id, connection)
          break

        case 'product_compatibility':
          if (productId) {
            data = await getProductCompatibility(user.id, parseInt(productId), connection)
          }
          break

        case 'session_result':
          if (sessionId) {
            data = await getSessionResult(user.id, parseInt(sessionId), connection)
          }
          break

        case 'ar_models':
          data = await getARModels(productId, connection)
          break

        default:
          data = await getVirtualTryOnOverview(user.id, connection)
      }

      return NextResponse.json(data)

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching virtual try-on data:', error)
    return NextResponse.json(
      { message: 'Failed to fetch virtual try-on data' },
      { status: 500 }
    )
  }
}

// POST: Create virtual try-on session or upload face image
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, product_id, face_image, settings, session_type } = body

    const connection = await dbConnect.getConnection()

    try {
      let result

      switch (action) {
        case 'start_session':
          result = await startVirtualTryOnSession(user.id, product_id, face_image, session_type, settings, connection)
          break

        case 'analyze_face':
          result = await analyzeFaceFeatures(user.id, face_image, connection)
          break

        case 'apply_makeup':
          result = await applyVirtualMakeup(user.id, body, connection)
          break

        case 'save_look':
          result = await saveVirtualLook(user.id, body, connection)
          break

        case 'share_result':
          result = await shareVirtualResult(user.id, body, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
      }

      return NextResponse.json(result)

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error processing virtual try-on:', error)
    return NextResponse.json(
      { message: 'Failed to process virtual try-on' },
      { status: 500 }
    )
  }
}

async function getTryOnHistory(userId: number, connection: any) {
  const [sessions] = await connection.execute(
    `SELECT vts.*, p.name as product_name, p.brand, p.image_url as product_image,
            c.name as category
     FROM virtual_tryon_sessions vts
     JOIN products p ON vts.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     WHERE vts.user_id = ?
     ORDER BY vts.created_at DESC
     LIMIT 20`,
    [userId]
  ) as [VirtualTryOnSession[], any]

  return { sessions }
}

async function getFaceAnalysis(userId: number, connection: any) {
  const [analysis] = await connection.execute(
    `SELECT * FROM face_analysis 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [userId]
  ) as [FaceAnalysis[], any]

  return { 
    analysis: analysis[0] || null,
    recommendations: analysis[0] ? await generateFaceBasedRecommendations(analysis[0], connection) : []
  }
}

async function getProductCompatibility(userId: number, productId: number, connection: any) {
  // Get user's face analysis
  const [faceAnalysis] = await connection.execute(
    `SELECT * FROM face_analysis 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [userId]
  ) as [FaceAnalysis[], any]

  // Get product visualization data
  const [productViz] = await connection.execute(
    `SELECT * FROM product_visualizations 
     WHERE product_id = ? AND is_active = 1`,
    [productId]
  ) as [ProductVisualization[], any]

  // Calculate compatibility score
  const compatibilityScore = calculateCompatibilityScore(faceAnalysis[0], productViz[0])

  return {
    compatibility_score: compatibilityScore,
    face_analysis: faceAnalysis[0] || null,
    product_visualization: productViz[0] || null,
    suggestions: await getCompatibilitySuggestions(faceAnalysis[0], productId, connection)
  }
}

async function getSessionResult(userId: number, sessionId: number, connection: any) {
  const [session] = await connection.execute(
    `SELECT vts.*, p.name as product_name, p.brand
     FROM virtual_tryon_sessions vts
     JOIN products p ON vts.product_id = p.id
     WHERE vts.id = ? AND vts.user_id = ?`,
    [sessionId, userId]
  ) as [VirtualTryOnSession[], any]

  return { session: session[0] || null }
}

async function getARModels(productId: string | null, connection: any) {
  const query = productId 
    ? 'SELECT * FROM product_visualizations WHERE product_id = ? AND is_active = 1'
    : 'SELECT * FROM product_visualizations WHERE is_active = 1 LIMIT 50'
  
  const params = productId ? [parseInt(productId)] : []

  const [models] = await connection.execute(query, params) as [ProductVisualization[], any]

  return { ar_models: models }
}

async function getVirtualTryOnOverview(userId: number, connection: any) {
  // Get recent sessions
  const [recentSessions] = await connection.execute(
    `SELECT vts.*, p.name as product_name, p.image_url as product_image
     FROM virtual_tryon_sessions vts
     JOIN products p ON vts.product_id = p.id
     WHERE vts.user_id = ?
     ORDER BY vts.created_at DESC
     LIMIT 5`,
    [userId]
  ) as [VirtualTryOnSession[], any]

  // Get saved looks
  const [savedLooks] = await connection.execute(
    `SELECT * FROM saved_virtual_looks 
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  ) as [any[], any]

  // Get compatible products
  const compatibleProducts = await getRecommendedProducts(userId, connection)

  return {
    recent_sessions: recentSessions,
    saved_looks: savedLooks,
    compatible_products: compatibleProducts,
    features_available: [
      'Lipstick Try-On',
      'Foundation Matching',
      'Eyeshadow Simulation',
      'Blush Application',
      'Hair Color Preview',
      'Face Shape Analysis'
    ]
  }
}

async function startVirtualTryOnSession(
  userId: number, 
  productId: number, 
  faceImage: string, 
  sessionType: string, 
  settings: any, 
  connection: any
) {
  // Store the face image (in production, upload to cloud storage)
  const faceImageUrl = await storeFaceImage(faceImage, userId)
  
  // Create session record
  const [result] = await connection.execute(
    `INSERT INTO virtual_tryon_sessions 
     (user_id, product_id, session_type, face_image_url, settings, status) 
     VALUES (?, ?, ?, ?, ?, 'processing')`,
    [userId, productId, sessionType, faceImageUrl, JSON.stringify(settings)]
  )

  const sessionId = result.insertId

  // Process the virtual try-on (this would call ML service in production)
  const processedResult = await processVirtualTryOn(sessionId, faceImageUrl, productId, sessionType, settings)

  // Update session with results
  await connection.execute(
    `UPDATE virtual_tryon_sessions 
     SET result_image_url = ?, confidence_score = ?, status = 'completed'
     WHERE id = ?`,
    [processedResult.resultImageUrl, processedResult.confidenceScore, sessionId]
  )

  return {
    session_id: sessionId,
    result_image_url: processedResult.resultImageUrl,
    confidence_score: processedResult.confidenceScore,
    processing_time: processedResult.processingTime,
    suggestions: processedResult.suggestions
  }
}

async function analyzeFaceFeatures(userId: number, faceImage: string, connection: any) {
  // Store face image
  const faceImageUrl = await storeFaceImage(faceImage, userId)
  
  // Analyze face features (this would call ML service in production)
  const analysis = await performFaceAnalysis(faceImageUrl)

  // Store analysis results
  await connection.execute(
    `INSERT INTO face_analysis 
     (user_id, face_shape, skin_tone, eye_color, lip_shape, face_features, analysis_confidence) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     face_shape = VALUES(face_shape),
     skin_tone = VALUES(skin_tone),
     eye_color = VALUES(eye_color),
     lip_shape = VALUES(lip_shape),
     face_features = VALUES(face_features),
     analysis_confidence = VALUES(analysis_confidence),
     updated_at = NOW()`,
    [
      userId,
      analysis.faceShape,
      analysis.skinTone,
      analysis.eyeColor,
      analysis.lipShape,
      JSON.stringify(analysis.features),
      analysis.confidence
    ]
  )

  return {
    analysis,
    recommendations: await generateFaceBasedRecommendations(analysis, connection)
  }
}

async function applyVirtualMakeup(userId: number, data: any, connection: any) {
  const { face_image, makeup_config } = data

  // Process virtual makeup application
  const result = await processVirtualMakeup(face_image, makeup_config)

  // Create session record
  const [sessionResult] = await connection.execute(
    `INSERT INTO virtual_tryon_sessions 
     (user_id, session_type, face_image_url, result_image_url, settings, confidence_score, status) 
     VALUES (?, 'makeup', ?, ?, ?, ?, 'completed')`,
    [userId, result.originalImageUrl, result.resultImageUrl, JSON.stringify(makeup_config), result.confidenceScore]
  )

  return {
    session_id: sessionResult.insertId,
    result_image_url: result.resultImageUrl,
    confidence_score: result.confidenceScore,
    makeup_breakdown: result.makeupBreakdown
  }
}

async function saveVirtualLook(userId: number, data: any, connection: any) {
  const { session_id, look_name, is_public } = data

  const [result] = await connection.execute(
    `INSERT INTO saved_virtual_looks 
     (user_id, session_id, look_name, is_public) 
     VALUES (?, ?, ?, ?)`,
    [userId, session_id, look_name, is_public || false]
  )

  return {
    look_id: result.insertId,
    message: 'Look saved successfully'
  }
}

async function shareVirtualResult(userId: number, data: any, connection: any) {
  const { session_id, platform, message } = data

  // Create share record
  await connection.execute(
    `INSERT INTO virtual_tryon_shares 
     (user_id, session_id, platform, message) 
     VALUES (?, ?, ?, ?)`,
    [userId, session_id, platform, message]
  )

  // Generate shareable link/image
  const shareUrl = await generateShareableContent(session_id, platform)

  return {
    share_url: shareUrl,
    message: 'Content ready to share'
  }
}

// Mock ML service functions (in production, these would call actual ML APIs)

async function storeFaceImage(faceImage: string, userId: number): Promise<string> {
  // In production: upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
  const filename = `face_${userId}_${Date.now()}.jpg`
  const url = `/uploads/faces/${filename}`
  
  // Mock implementation - store base64 image
  // In real implementation, you'd decode base64 and upload to cloud storage
  
  return url
}

async function processVirtualTryOn(sessionId: number, faceImageUrl: string, productId: number, sessionType: string, settings: any) {
  // Mock ML processing - in production, this would call TensorFlow, OpenCV, or AR Kit APIs
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

  return {
    resultImageUrl: `/uploads/results/result_${sessionId}.jpg`,
    confidenceScore: 0.85 + Math.random() * 0.15,
    processingTime: 2.1,
    suggestions: [
      'Try a slightly lighter shade for better color match',
      'Consider blending more at the edges',
      'This color complements your skin tone well'
    ]
  }
}

async function performFaceAnalysis(faceImageUrl: string) {
  // Mock face analysis - in production, use services like Azure Face API, Google Vision API
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    faceShape: ['oval', 'round', 'square', 'heart', 'diamond'][Math.floor(Math.random() * 5)],
    skinTone: ['fair', 'light', 'medium', 'olive', 'dark'][Math.floor(Math.random() * 5)],
    eyeColor: ['brown', 'blue', 'green', 'hazel', 'gray'][Math.floor(Math.random() * 5)],
    lipShape: ['full', 'thin', 'wide', 'heart', 'downturned'][Math.floor(Math.random() * 5)],
    features: {
      eyeSize: 'medium',
      noseBridge: 'straight',
      cheekbones: 'prominent',
      jawline: 'defined'
    },
    confidence: 0.92
  }
}

async function processVirtualMakeup(faceImage: string, makeupConfig: any) {
  // Mock makeup application - in production, use AR libraries
  await new Promise(resolve => setTimeout(resolve, 1800))

  return {
    originalImageUrl: '/temp/original.jpg',
    resultImageUrl: '/uploads/makeup/result.jpg',
    confidenceScore: 0.88,
    makeupBreakdown: {
      foundation: makeupConfig.foundation || 'Medium coverage applied',
      lipstick: makeupConfig.lipstick || 'Natural pink applied',
      eyeshadow: makeupConfig.eyeshadow || 'Neutral brown applied',
      blush: makeupConfig.blush || 'Subtle peach applied'
    }
  }
}

async function generateFaceBasedRecommendations(analysis: any, connection: any) {
  // Generate product recommendations based on face analysis
  const [recommendations] = await connection.execute(
    `SELECT p.*, c.name as category 
     FROM products p
     JOIN categories c ON p.category_id = c.id
     JOIN product_skin_matches psm ON p.id = psm.product_id
     WHERE psm.skin_tone = ? OR psm.face_shape = ?
     ORDER BY p.rating DESC
     LIMIT 10`,
    [analysis.skinTone || analysis.skin_tone, analysis.faceShape || analysis.face_shape]
  )

  return recommendations
}

function calculateCompatibilityScore(faceAnalysis: any, productViz: any): number {
  if (!faceAnalysis || !productViz) return 0.5

  // Mock compatibility calculation
  let score = 0.7 // Base score

  // Adjust based on skin tone match
  if (faceAnalysis.skin_tone && productViz.color_variants) {
    score += 0.1
  }

  // Adjust based on face shape
  if (faceAnalysis.face_shape) {
    score += 0.1
  }

  return Math.min(score, 1.0)
}

async function getCompatibilitySuggestions(faceAnalysis: any, productId: number, connection: any) {
  if (!faceAnalysis) return []

  // Get similar products that might work better
  const [suggestions] = await connection.execute(
    `SELECT p.*, c.name as category 
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = (SELECT category_id FROM products WHERE id = ?)
     AND p.id != ?
     ORDER BY p.rating DESC
     LIMIT 5`,
    [productId, productId]
  )

  return suggestions
}

async function getRecommendedProducts(userId: number, connection: any) {
  const [products] = await connection.execute(
    `SELECT p.*, c.name as category, pv.ar_model_url
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN product_visualizations pv ON p.id = pv.product_id
     WHERE pv.ar_model_url IS NOT NULL
     AND p.is_active = 1
     ORDER BY p.rating DESC
     LIMIT 12`,
    []
  )

  return products
}

async function generateShareableContent(sessionId: number, platform: string): Promise<string> {
  // Generate platform-specific shareable content
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aynbeauty.com'
  return `${baseUrl}/virtual-tryon/share/${sessionId}?platform=${platform}`
}