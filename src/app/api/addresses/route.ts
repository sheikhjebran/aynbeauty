import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getConnection } from '@/lib/db'
import { RowDataPacket } from 'mysql2'

interface User {
  id: number;
  email: string;
  role: string;
}

interface Address extends RowDataPacket {
  id: number;
  user_id: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/addresses - Get user addresses
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User

    const connection = await getConnection()
    
    const [addresses] = await connection.execute<Address[]>(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [decoded.id]
    )

    await connection.end()

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/addresses - Create new address
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User

    const { 
      type, 
      first_name, 
      last_name, 
      company, 
      address_line_1, 
      address_line_2, 
      city, 
      state, 
      postal_code, 
      country, 
      phone, 
      is_default 
    } = await req.json()

    if (!type || !first_name || !last_name || !address_line_1 || !city || !state || !postal_code || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const connection = await getConnection()

    // If this is being set as default, unset other defaults for this user and type
    if (is_default) {
      await connection.execute(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND type = ?',
        [decoded.id, type]
      )
    }

    const [result] = await connection.execute(
      `INSERT INTO addresses (
        user_id, type, first_name, last_name, company, 
        address_line_1, address_line_2, city, state, postal_code, 
        country, phone, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.id, type, first_name, last_name, company,
        address_line_1, address_line_2, city, state, postal_code,
        country, phone, is_default || false
      ]
    )

    await connection.end()

    return NextResponse.json({ 
      message: 'Address created successfully',
      address_id: (result as any).insertId
    })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}