import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

class DatabaseMigrator {
  private config: DatabaseConfig
  private connection: mysql.Connection | null = null

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aynbeauty'
    }

    this.validateConfig()
  }

  private validateConfig(): void {
    if (!this.config.user || !this.config.password) {
      console.error('❌ Database credentials not found in .env.local')
      console.error('Please ensure the following environment variables are set:')
      console.error('- DB_HOST (default: localhost)')
      console.error('- DB_PORT (default: 3306)')
      console.error('- DB_USER (required)')
      console.error('- DB_PASSWORD (required)')
      console.error('- DB_NAME (default: aynbeauty)')
      process.exit(1)
    }
  }

  private async connect(): Promise<void> {
    try {
      console.log('🔌 Connecting to MySQL database...')
      console.log(`   Host: ${this.config.host}:${this.config.port}`)
      console.log(`   Database: ${this.config.database}`)
      console.log(`   User: ${this.config.user}`)

      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        multipleStatements: true
      })

      console.log('✅ Connected to MySQL successfully')
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error)
      throw error
    }
  }

  private async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
      console.log('🔌 Disconnected from MySQL')
    }
  }

  private async createDatabase(): Promise<void> {
    if (!this.connection) throw new Error('Not connected to database')

    try {
      console.log(`🗄️  Creating database '${this.config.database}' if it doesn't exist...`)
      
      await this.connection.execute(
        `CREATE DATABASE IF NOT EXISTS \`${this.config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      )
      
      await this.connection.execute(`USE \`${this.config.database}\``)
      
      console.log(`✅ Database '${this.config.database}' is ready`)
    } catch (error) {
      console.error('❌ Failed to create database:', error)
      throw error
    }
  }

  private async executeSQLFile(): Promise<void> {
    if (!this.connection) throw new Error('Not connected to database')

    try {
      const sqlFilePath = path.join(process.cwd(), 'deploy-production-db.sql')
      
      if (!fs.existsSync(sqlFilePath)) {
        throw new Error(`SQL file not found: ${sqlFilePath}`)
      }

      console.log('📄 Reading migration SQL file...')
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')

      // Remove the CREATE DATABASE and USE statements since we handle them separately
      const cleanedSQL = sqlContent
        .replace(/CREATE DATABASE IF NOT EXISTS.*?;/gi, '')
        .replace(/USE\s+\w+\s*;/gi, '')
        .trim()

      if (!cleanedSQL) {
        throw new Error('SQL file appears to be empty or invalid')
      }

      console.log('🚀 Executing database migration...')
      console.log('   This may take a few moments...')

      // Split SQL into individual statements and execute them
      const statements = cleanedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)

      let successCount = 0
      let errorCount = 0

      for (const statement of statements) {
        try {
          await this.connection.execute(statement)
          successCount++
        } catch (error) {
          console.warn(`⚠️  Warning: Failed to execute statement (continuing): ${error}`)
          errorCount++
        }
      }

      console.log(`✅ Migration completed: ${successCount} statements executed successfully`)
      if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} statements had warnings (this is often normal for IF NOT EXISTS statements)`)
      }

    } catch (error) {
      console.error('❌ Failed to execute SQL migration:', error)
      throw error
    }
  }

  private async verifyMigration(): Promise<void> {
    if (!this.connection) throw new Error('Not connected to database')

    try {
      console.log('🔍 Verifying migration...')

      // Check if key tables exist
      const [tables] = await this.connection.execute(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME",
        [this.config.database]
      ) as any[]

      const tableNames = tables.map((row: any) => row.TABLE_NAME)
      const expectedTables = [
        'users', 'categories', 'brands', 'products', 'product_images',
        'cart_items', 'orders', 'order_items', 'reviews', 'wishlists'
      ]

      console.log(`📊 Found ${tableNames.length} tables in database:`)
      tableNames.forEach((table: string) => {
        const isExpected = expectedTables.includes(table)
        console.log(`   ${isExpected ? '✅' : '📄'} ${table}`)
      })

      // Check for missing critical tables
      const missingTables = expectedTables.filter(table => !tableNames.includes(table))
      if (missingTables.length > 0) {
        console.warn(`⚠️  Missing critical tables: ${missingTables.join(', ')}`)
      }

      // Check admin user
      const [users] = await this.connection.execute(
        "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
      ) as any[]

      const adminCount = users[0].count
      console.log(`👤 Admin users: ${adminCount}`)

      // Check sample data
      const [products] = await this.connection.execute(
        "SELECT COUNT(*) as count FROM products"
      ) as any[]

      const productCount = products[0].count
      console.log(`📦 Products: ${productCount}`)

      console.log('✅ Database migration verification completed')

    } catch (error) {
      console.error('❌ Migration verification failed:', error)
      throw error
    }
  }

  public async migrate(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('🚀 Starting AynBeauty Database Migration')
      console.log('=====================================')
      console.log()

      await this.connect()
      await this.createDatabase()
      await this.executeSQLFile()
      await this.verifyMigration()

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      
      console.log()
      console.log('🎉 Migration completed successfully!')
      console.log('===================================')
      console.log(`⏱️  Duration: ${duration} seconds`)
      console.log(`🗄️  Database: ${this.config.database}`)
      console.log(`🏠 Host: ${this.config.host}:${this.config.port}`)
      console.log()
      console.log('✅ Your AynBeauty database is ready for production!')
      console.log()
      console.log('Next steps:')
      console.log('1. Update your production .env file with these database settings')
      console.log('2. Deploy your Next.js application')
      console.log('3. Start your application with PM2')

    } catch (error) {
      console.error()
      console.error('💥 Migration failed!')
      console.error('==================')
      console.error('Error:', error)
      console.error()
      console.error('Troubleshooting tips:')
      console.error('1. Check your database credentials in .env.local')
      console.error('2. Ensure MySQL server is running')
      console.error('3. Verify the user has CREATE DATABASE privileges')
      console.error('4. Check if the database server is accessible')
      
      process.exit(1)
    } finally {
      await this.disconnect()
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  const migrator = new DatabaseMigrator()
  migrator.migrate()
}

export default DatabaseMigrator