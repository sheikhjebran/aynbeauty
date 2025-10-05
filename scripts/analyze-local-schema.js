const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({ path: ".env.local" });

class DatabaseSchemaAnalyzer {
  constructor() {
    this.connection = null;
    this.outputDir = "./database/generated-migrations";
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
      port: parseInt(process.env.DB_PORT || "3306"),
    });
    console.log("✅ Connected to local database");
  }

  async getAllTables() {
    const [tables] = await this.connection.execute("SHOW TABLES");
    return tables.map((row) => Object.values(row)[0]);
  }

  async getTableSchema(tableName) {
    // Get table creation SQL
    const [createTable] = await this.connection.execute(
      `SHOW CREATE TABLE \`${tableName}\``
    );
    const createSQL = createTable[0]["Create Table"];

    // Get table columns with detailed info
    const [columns] = await this.connection.execute(
      `
      SELECT 
        COLUMN_NAME,
        COLUMN_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        EXTRA,
        COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `,
      [process.env.DB_NAME || "aynbeauty", tableName]
    );

    // Get indexes
    const [indexes] = await this.connection.execute(
      `SHOW INDEX FROM \`${tableName}\``
    );

    // Get foreign keys
    const [foreignKeys] = await this.connection.execute(
      `
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [process.env.DB_NAME || "aynbeauty", tableName]
    );

    return {
      name: tableName,
      createSQL,
      columns,
      indexes,
      foreignKeys,
    };
  }

  async getSampleData(tableName, limit = 5) {
    try {
      const [rows] = await this.connection.execute(
        `SELECT * FROM \`${tableName}\` LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      console.log(
        `⚠️  Could not get sample data for ${tableName}: ${error.message}`
      );
      return [];
    }
  }

  async generateMigrationFile(tableSchema, timestamp, index) {
    const fileName = `${timestamp}_create_${tableSchema.name}_table.sql`;
    const filePath = path.join(this.outputDir, fileName);

    let sql = `-- Migration: Create ${tableSchema.name} table\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    // Drop table if exists
    sql += `DROP TABLE IF EXISTS \`${tableSchema.name}\`;\n\n`;

    // Create table
    sql += `${tableSchema.createSQL};\n\n`;

    // Add comments about the table structure
    sql += `-- Table: ${tableSchema.name}\n`;
    sql += `-- Columns: ${tableSchema.columns.length}\n`;
    sql += `-- Indexes: ${tableSchema.indexes.length}\n`;
    sql += `-- Foreign Keys: ${tableSchema.foreignKeys.length}\n\n`;

    await fs.writeFile(filePath, sql);
    console.log(`✅ Generated: ${fileName}`);
    return fileName;
  }

  async generateDataFile(tableName, sampleData, timestamp) {
    if (sampleData.length === 0) return null;

    const fileName = `${timestamp}_insert_${tableName}_data.sql`;
    const filePath = path.join(this.outputDir, fileName);

    let sql = `-- Sample data for ${tableName}\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    if (sampleData.length > 0) {
      const columns = Object.keys(sampleData[0]);
      const columnNames = columns.map((col) => `\`${col}\``).join(", ");

      sql += `INSERT INTO \`${tableName}\` (${columnNames}) VALUES\n`;

      const values = sampleData.map((row) => {
        const rowValues = columns.map((col) => {
          const value = row[col];
          if (value === null) return "NULL";
          if (typeof value === "string")
            return `'${value.replace(/'/g, "''")}'`;
          if (value instanceof Date)
            return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
          return value;
        });
        return `(${rowValues.join(", ")})`;
      });

      sql += values.join(",\n") + ";\n\n";
    }

    await fs.writeFile(filePath, sql);
    console.log(`✅ Generated data: ${fileName}`);
    return fileName;
  }

  async createOutputDirectory() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
    console.log(`📁 Created output directory: ${this.outputDir}`);
  }

  async generateMasterScript(migrationFiles, timestamp) {
    const fileName = `${timestamp}_deploy_complete_schema.sql`;
    const filePath = path.join(this.outputDir, fileName);

    let sql = `-- Complete Database Schema Deployment\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Database: ${process.env.DB_NAME || "aynbeauty"}\n\n`;

    sql += `-- Disable foreign key checks for clean deployment\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Include all migration files
    for (const file of migrationFiles) {
      if (file) {
        sql += `-- Source: ${file}\n`;
        const fileContent = await fs.readFile(
          path.join(this.outputDir, file),
          "utf8"
        );
        sql += fileContent + "\n";
      }
    }

    sql += `-- Re-enable foreign key checks\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;

    await fs.writeFile(filePath, sql);
    console.log(`✅ Generated master script: ${fileName}`);
    return fileName;
  }

  async generateDeploymentScript(timestamp) {
    const scriptName = `deploy_to_production_${timestamp}.js`;
    const scriptPath = path.join("./scripts", scriptName);

    const script = `const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function deployToProduction() {
  console.log('🚀 DEPLOYING LOCAL SCHEMA TO PRODUCTION');
  console.log('=====================================\\n');
  
  let connection;
  
  try {
    const databaseName = process.env.DB_NAME || 'aynbeauty';
    console.log(\`📊 Target database: \${databaseName}\`);
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    console.log('✅ Connected to MySQL server');
    
    // Drop and recreate database
    console.log(\`\\n🗑️  Dropping database '\${databaseName}' if exists...\`);
    await connection.execute(\`DROP DATABASE IF EXISTS \\\`\${databaseName}\\\`\`);
    console.log('✅ Database dropped');
    
    console.log(\`\\n🆕 Creating fresh database '\${databaseName}'...\`);
    await connection.execute(\`CREATE DATABASE \\\`\${databaseName}\\\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci\`);
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
    console.log(\`✅ Connected to database '\${databaseName}'\`);
    
    // Execute the master deployment script
    const schemaFile = './database/generated-migrations/${timestamp}_deploy_complete_schema.sql';
    console.log(\`\\n📋 Executing schema deployment...\`);
    
    const schemaSQL = await fs.readFile(schemaFile, 'utf8');
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement && !statement.startsWith('--')) {
        try {
          await connection.execute(statement);
          if (i % 10 === 0) {
            console.log(\`   Executed \${i + 1}/\${statements.length} statements...\`);
          }
        } catch (error) {
          console.error(\`❌ Error executing statement: \${statement.substring(0, 100)}...\`);
          console.error(\`   Error: \${error.message}\`);
        }
      }
    }
    
    console.log('✅ Schema deployment completed');
    
    await connection.end();
    console.log('\\n✅ Production deployment successful!');
    console.log('\\n🎯 Next steps:');
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

deployToProduction();`;

    await fs.writeFile(scriptPath, script);
    console.log(`✅ Generated deployment script: ${scriptName}`);
    return scriptName;
  }

  async analyze() {
    console.log("🔍 ANALYZING LOCAL DATABASE SCHEMA");
    console.log("==================================\n");

    try {
      await this.connect();
      await this.createOutputDirectory();

      // Get all tables
      const tables = await this.getAllTables();
      console.log(`📋 Found ${tables.length} tables: ${tables.join(", ")}\n`);

      const timestamp = new Date()
        .toISOString()
        .replace(/[:-]/g, "")
        .replace(/\\.\\d{3}Z/, "");
      const migrationFiles = [];

      // Analyze each table
      for (let i = 0; i < tables.length; i++) {
        const tableName = tables[i];
        console.log(`🔍 Analyzing table: ${tableName}`);

        const schema = await this.getTableSchema(tableName);
        const sampleData = await this.getSampleData(tableName);

        console.log(`   - Columns: ${schema.columns.length}`);
        console.log(`   - Indexes: ${schema.indexes.length}`);
        console.log(`   - Foreign Keys: ${schema.foreignKeys.length}`);
        console.log(`   - Sample Data: ${sampleData.length} rows`);

        // Generate migration file for table structure
        const migrationFile = await this.generateMigrationFile(
          schema,
          timestamp,
          i + 1
        );
        migrationFiles.push(migrationFile);

        // Generate data file if there's sample data
        if (sampleData.length > 0) {
          const dataFile = await this.generateDataFile(
            tableName,
            sampleData,
            timestamp
          );
          if (dataFile) migrationFiles.push(dataFile);
        }

        console.log("");
      }

      // Generate master deployment script
      const masterScript = await this.generateMasterScript(
        migrationFiles,
        timestamp
      );

      // Generate production deployment script
      const deployScript = await this.generateDeploymentScript(timestamp);

      await this.connection.end();

      console.log("🎉 ANALYSIS COMPLETE!");
      console.log("====================");
      console.log(`📁 Generated ${migrationFiles.length} migration files`);
      console.log(`📄 Master script: ${masterScript}`);
      console.log(`🚀 Deploy script: ${deployScript}`);
      console.log(`\\n🎯 To deploy to production:`);
      console.log(`1. Upload files to server`);
      console.log(`2. Run: node scripts/${deployScript}`);
    } catch (error) {
      console.error("❌ Analysis failed:", error.message);
      if (this.connection) {
        await this.connection.end();
      }
    }
  }
}

// Run the analyzer
const analyzer = new DatabaseSchemaAnalyzer();
analyzer.analyze();
