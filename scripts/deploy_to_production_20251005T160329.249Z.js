const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function deployToProduction() {
  console.log('🚀 DEPLOYING LOCAL SCHEMA TO PRODUCTION');
  console.log('=====================================\n');
  
  let connection;
  
  try {
    const databaseName = process.env.DB_NAME || 'aynbeauty';
    console.log(`📊 Target database: ${databaseName}`);
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    console.log('✅ Connected to MySQL server');
    
    // Drop and recreate database
    console.log(`\n🗑️  Dropping database '${databaseName}' if exists...`);
    await connection.execute(`DROP DATABASE IF EXISTS \`${databaseName}\``);
    console.log('✅ Database dropped');
    
    console.log(`\n🆕 Creating fresh database '${databaseName}'...`);
    await connection.execute(`CREATE DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Fresh database created');
    
    await connection.end();
    
    // Connect to the new database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: databaseName,
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    console.log(`✅ Connected to database '${databaseName}'`);
    
    // Execute the master deployment script
    const schemaFile = './database/generated-migrations/20251005T160329.249Z_deploy_complete_schema.sql';
    console.log(`\n📋 Executing schema deployment...`);
    
    const schemaSQL = await fs.readFile(schemaFile, 'utf8');
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement && !statement.startsWith('--')) {
        try {
          await connection.execute(statement);
          if (i % 10 === 0) {
            console.log(`   Executed ${i + 1}/${statements.length} statements...`);
          }
        } catch (error) {
          console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Schema deployment completed');
    
    await connection.end();
    console.log('\n✅ Production deployment successful!');
    console.log('\n🎯 Next steps:');
    console.log('1. Fix admin password: node scripts/fix-admin-password-prod.js');
    console.log('2. Restart application: pm2 restart aynbeauty --update-env');
    console.log('3. Test admin login: admin@aynbeauty.com / admin123');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

deployToProduction();