import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Check if uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    
    let directoryExists = false
    let files: string[] = []
    
    try {
      const stats = await fs.stat(uploadsDir)
      directoryExists = stats.isDirectory()
      
      if (directoryExists) {
        files = await fs.readdir(uploadsDir)
      }
    } catch (error) {
      // Directory doesn't exist
    }

    // Test specific file that was mentioned in the error
    const testFile = 'product_1759681945109_ajo3vkslsrl_0.jpeg'
    const testFilePath = path.join(uploadsDir, testFile)
    
    let testFileExists = false
    let testFileStats = null
    
    try {
      testFileStats = await fs.stat(testFilePath)
      testFileExists = true
    } catch (error) {
      // File doesn't exist
    }

    return NextResponse.json({
      success: true,
      uploadsDirectory: uploadsDir,
      directoryExists,
      filesCount: files.length,
      files: files.slice(0, 10), // First 10 files
      testFile: {
        name: testFile,
        exists: testFileExists,
        path: testFilePath,
        stats: testFileStats ? {
          size: testFileStats.size,
          modified: testFileStats.mtime
        } : null
      },
      currentWorkingDirectory: process.cwd()
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', message: String(error) },
      { status: 500 }
    )
  }
}