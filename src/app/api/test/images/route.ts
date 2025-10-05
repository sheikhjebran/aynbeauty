import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    
    // List all files in uploads directory
    let files: string[] = []
    let directoryExists = false
    
    try {
      const stats = await fs.stat(uploadsDir)
      directoryExists = stats.isDirectory()
      
      if (directoryExists) {
        files = await fs.readdir(uploadsDir)
      }
    } catch (error) {
      console.error('Directory access error:', error)
    }

    // Test image API endpoint
    const testResults = []
    
    for (const file of files.slice(0, 3)) { // Test first 3 files
      try {
        const response = await fetch(`${new URL(request.url).origin}/api/images/products/${file}`)
        testResults.push({
          file,
          status: response.status,
          contentType: response.headers.get('content-type'),
          cacheControl: response.headers.get('cache-control')
        })
      } catch (error) {
        testResults.push({
          file,
          error: String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      uploadsDirectory: uploadsDir,
      directoryExists,
      totalFiles: files.length,
      files: files.slice(0, 10),
      apiTests: testResults,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', message: String(error) },
      { status: 500 }
    )
  }
}