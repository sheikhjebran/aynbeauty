import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()
    
    // Revalidate specific paths or all paths
    if (path) {
      revalidatePath(path)
    } else {
      // Revalidate common paths where images are displayed
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/admin/inventory')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cache revalidated successfully',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}