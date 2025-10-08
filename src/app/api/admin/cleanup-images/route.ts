import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Middleware to verify admin access
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { error: 'No token provided', status: 401 }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.role !== 'admin') {
      return { error: 'Access denied. Admin role required.', status: 403 }
    }

    return { user: decoded }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}

interface ImageAnalysis {
  referencedImages: Set<string>
  filesOnDisk: string[]
  unusedFiles: string[]
  missingFiles: string[]
  totalUnusedSize: number
}

async function analyzeImages(): Promise<ImageAnalysis> {
  // Get all images from product_images table
  const productImages = await executeQuery('SELECT image_url FROM product_images WHERE image_url IS NOT NULL') as any[]
  
  // Get all products with their image references
  const products = await executeQuery('SELECT image_url, primary_image FROM products WHERE image_url IS NOT NULL OR primary_image IS NOT NULL') as any[]
  
  // Collect all image URLs referenced in database
  const referencedImages = new Set<string>()
  
  // From product_images table
  productImages.forEach(img => {
    if (img.image_url) {
      const filename = path.basename(img.image_url)
      referencedImages.add(filename)
    }
  })
  
  // From products table
  products.forEach(p => {
    if (p.image_url) {
      const filename = path.basename(p.image_url)
      referencedImages.add(filename)
    }
    if (p.primary_image) {
      const filename = path.basename(p.primary_image)
      referencedImages.add(filename)
    }
  })
  
  // Read files from uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  let filesOnDisk: string[] = []
  
  try {
    filesOnDisk = fs.readdirSync(uploadsDir).filter(file => {
      const filePath = path.join(uploadsDir, file)
      return fs.statSync(filePath).isFile()
    })
  } catch (error) {
    console.error('Could not read uploads directory:', error)
    filesOnDisk = []
  }
  
  // Find unused files
  const unusedFiles = filesOnDisk.filter(file => !referencedImages.has(file))
  
  // Find missing files
  const missingFiles = Array.from(referencedImages).filter(img => !filesOnDisk.includes(img))
  
  // Calculate total size of unused files
  const totalUnusedSize = unusedFiles.reduce((total, file) => {
    try {
      const filePath = path.join(uploadsDir, file)
      const stats = fs.statSync(filePath)
      return total + stats.size
    } catch {
      return total
    }
  }, 0)
  
  return {
    referencedImages,
    filesOnDisk,
    unusedFiles,
    missingFiles,
    totalUnusedSize
  }
}

// GET /api/admin/cleanup-images - Analyze unused images and get history
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const includeHistory = searchParams.get('history') === 'true'

    const analysis = await analyzeImages()
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    
    // Get detailed info for unused files
    const unusedFilesDetails = analysis.unusedFiles.map(file => {
      try {
        const filePath = path.join(uploadsDir, file)
        const stats = fs.statSync(filePath)
        const daysOld = Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24))
        return {
          filename: file,
          size: stats.size,
          sizeFormatted: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          lastModified: stats.mtime,
          lastModifiedFormatted: stats.mtime.toISOString().split('T')[0],
          daysOld
        }
      } catch {
        return {
          filename: file,
          size: 0,
          sizeFormatted: '0 MB',
          lastModified: new Date(),
          lastModifiedFormatted: 'Unknown',
          daysOld: 0
        }
      }
    })

    const response: any = {
      success: true,
      analysis: {
        totalFiles: analysis.filesOnDisk.length,
        referencedFiles: analysis.referencedImages.size,
        unusedFiles: analysis.unusedFiles.length,
        missingFilesCount: analysis.missingFiles.length,
        totalUnusedSize: analysis.totalUnusedSize,
        totalUnusedSizeFormatted: `${(analysis.totalUnusedSize / (1024 * 1024)).toFixed(2)} MB`,
        unusedFilesDetails,
        missingFiles: analysis.missingFiles
      }
    }

    // Include cleanup history if requested
    if (includeHistory) {
      try {
        const history = await executeQuery(
          `SELECT id, files_deleted, files_failed, space_saved, cleanup_type, 
                  admin_user_id, created_at
           FROM cleanup_history 
           ORDER BY created_at DESC 
           LIMIT 10`
        ) as any[]
        
        response.history = history.map(h => ({
          ...h,
          spaceSavedFormatted: `${(h.space_saved / (1024 * 1024)).toFixed(2)} MB`,
          createdAtFormatted: h.created_at.toISOString().split('T')[0]
        }))
      } catch (error) {
        console.error('Could not fetch cleanup history:', error)
        response.history = []
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze images' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/cleanup-images - Clean up unused images
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'dry-run' // 'dry-run' or 'execute'
    const files = searchParams.get('files') // Comma-separated list of specific files to delete
    
    const analysis = await analyzeImages()
    
    let filesToDelete = analysis.unusedFiles
    
    // If specific files are provided, only delete those
    if (files) {
      const requestedFiles = files.split(',').map(f => f.trim())
      filesToDelete = analysis.unusedFiles.filter(file => requestedFiles.includes(file))
    }
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const results = {
      mode,
      totalFilesToDelete: filesToDelete.length,
      deletedFiles: [] as string[],
      failedFiles: [] as { filename: string, error: string }[],
      spaceSaved: 0
    }
    
    if (mode === 'execute') {
      // Actually delete the files
      for (const file of filesToDelete) {
        try {
          const filePath = path.join(uploadsDir, file)
          const stats = fs.statSync(filePath)
          fs.unlinkSync(filePath)
          results.deletedFiles.push(file)
          results.spaceSaved += stats.size
        } catch (error) {
          results.failedFiles.push({
            filename: file,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    } else {
      // Dry run - just calculate what would be deleted
      for (const file of filesToDelete) {
        try {
          const filePath = path.join(uploadsDir, file)
          const stats = fs.statSync(filePath)
          results.deletedFiles.push(file)
          results.spaceSaved += stats.size
        } catch (error) {
          results.failedFiles.push({
            filename: file,
            error: error instanceof Error ? error.message : 'File not found'
          })
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: mode === 'execute' 
        ? `Successfully cleaned up ${results.deletedFiles.length} unused images`
        : `Dry run: Would delete ${results.deletedFiles.length} unused images`,
      results: {
        ...results,
        spaceSavedFormatted: `${(results.spaceSaved / (1024 * 1024)).toFixed(2)} MB`
      }
    })

    // Log the cleanup operation if it was executed
    if (mode === 'execute' && results.deletedFiles.length > 0) {
      try {
        await executeQuery(
          `INSERT INTO cleanup_history (files_deleted, files_failed, space_saved, cleanup_type, admin_user_id, created_at) 
           VALUES (?, ?, ?, 'manual', ?, NOW())`,
          [results.deletedFiles.length, results.failedFiles.length, results.spaceSaved, authResult.user.userId]
        )
      } catch (error) {
        console.error('Could not log cleanup to database:', error)
      }
    }

  } catch (error) {
    console.error('Image cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup images' },
      { status: 500 }
    )
  }
}