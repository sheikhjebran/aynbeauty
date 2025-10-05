import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health checks
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      checks: {
        database: 'pending',
        uploads: 'pending',
        build: 'pending'
      }
    }

    // Check if build directory exists
    try {
      const fs = require('fs')
      const path = require('path')
      const buildPath = path.join(process.cwd(), '.next')
      health.checks.build = fs.existsSync(buildPath) ? 'ok' : 'failed'
    } catch (error) {
      health.checks.build = 'error'
    }

    // Check uploads directory
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsPath = path.join(process.cwd(), 'public', 'uploads', 'products')
      health.checks.uploads = fs.existsSync(uploadsPath) ? 'ok' : 'failed'
    } catch (error) {
      health.checks.uploads = 'error'
    }

    // Check database connection
    try {
      const dbConnect = require('@/lib/database').default
      const connection = await dbConnect.getConnection()
      await connection.execute('SELECT 1')
      connection.release()
      health.checks.database = 'ok'
    } catch (error) {
      health.checks.database = 'failed'
    }

    // Determine overall status
    const allChecksOk = Object.values(health.checks).every(check => check === 'ok')
    health.status = allChecksOk ? 'healthy' : 'degraded'

    return NextResponse.json(health, {
      status: allChecksOk ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}