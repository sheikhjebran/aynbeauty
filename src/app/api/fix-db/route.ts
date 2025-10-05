import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection()
    
    // Create addresses table
    const createAddressesTable = `
      CREATE TABLE IF NOT EXISTS addresses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        type ENUM('shipping', 'billing') NOT NULL DEFAULT 'shipping',
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        company VARCHAR(200),
        address_line_1 TEXT NOT NULL,
        address_line_2 TEXT,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'India',
        phone VARCHAR(20),
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    
    await connection.execute(createAddressesTable)
    console.log('Addresses table created')
    
    // Add payment_method column to orders
    try {
      await connection.execute('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50)')
      console.log('payment_method column added')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('payment_method column already exists')
    }
    
    // Add payment_reference column to orders
    try {
      await connection.execute('ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(200)')
      console.log('payment_reference column added')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('payment_reference column already exists')
    }
    
    await connection.end()
    
    return NextResponse.json({ 
      message: 'Database schema updated successfully',
      details: [
        'addresses table created',
        'payment_method column added to orders',
        'payment_reference column added to orders'
      ]
    })
    
  } catch (error) {
    console.error('Database schema update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update database schema',
      details: error 
    }, { status: 500 })
  }
}