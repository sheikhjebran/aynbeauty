import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
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
    
    await executeQuery(createAddressesTable)
    console.log('Addresses table created')
    
    // Add payment_method column to orders
    try {
      await executeQuery('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50)')
      console.log('payment_method column added')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('payment_method column already exists')
    }
    
    // Add payment_reference column to orders
    try {
      await executeQuery('ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(200)')
      console.log('payment_reference column added')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('payment_reference column already exists')
    }
    
    // Add variant_id column to order_items
    try {
      await executeQuery('ALTER TABLE order_items ADD COLUMN variant_id INT NULL')
      console.log('variant_id column added to order_items')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('variant_id column already exists in order_items')
    }
    
    // Add variant_name column to order_items
    try {
      await executeQuery('ALTER TABLE order_items ADD COLUMN variant_name VARCHAR(200) NULL')
      console.log('variant_name column added to order_items')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('variant_name column already exists in order_items')
    }
    
    // Add unit_price column to order_items
    try {
      await executeQuery('ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0')
      console.log('unit_price column added to order_items')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('unit_price column already exists in order_items')
    }
    
    // Add total_price column to order_items
    try {
      await executeQuery('ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0')
      console.log('total_price column added to order_items')
    } catch (error: any) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error
      }
      console.log('total_price column already exists in order_items')
    }
    
    return NextResponse.json({ 
      message: 'Database schema updated successfully',
      details: [
        'addresses table created',
        'payment_method column added to orders',
        'payment_reference column added to orders',
        'variant_id column added to order_items',
        'variant_name column added to order_items',
        'unit_price column added to order_items',
        'total_price column added to order_items'
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