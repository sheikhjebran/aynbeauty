import { executeQuery } from '../lib/database.js'
import bcrypt from 'bcryptjs'

// Admin credentials
const ADMIN_EMAIL = 'admin@aynbeauty.com'
const ADMIN_PASSWORD = 'admin123' // You should change this to a secure password

export async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await executeQuery(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      [ADMIN_EMAIL, 'admin']
    ) as any[]

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

    // Create admin user
    await executeQuery(
      `INSERT INTO users (
        email, 
        password, 
        first_name, 
        last_name, 
        role, 
        is_verified, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        ADMIN_EMAIL,
        hashedPassword,
        'Admin',
        'User',
        'admin',
        1
      ]
    )

    console.log('✅ Admin user created successfully')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    console.log('⚠️  Please change the default password after first login')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createAdminUser()
}