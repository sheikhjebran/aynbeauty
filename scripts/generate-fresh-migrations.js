require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

class FreshMigrationGenerator {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
      port: parseInt(process.env.DB_PORT || "3306"),
    };
  }

  async connect() {
    this.connection = await mysql.createConnection(this.config);
    console.log("✅ Connected to database for migration generation");
  }

  async generateFreshMigrations() {
    console.log("🏗️  GENERATING FRESH MIGRATION SYSTEM");
    console.log("====================================\\n");

    try {
      // Read the database analysis
      const analysisPath = path.join(__dirname, "database_analysis.json");
      const analysisData = JSON.parse(await fs.readFile(analysisPath, "utf8"));

      console.log(
        `📊 Found ${
          Object.keys(analysisData.tables).length
        } tables to migrate\\n`
      );

      // Create migrations directory
      const migrationsDir = path.join(__dirname, "..", "migrations");
      await fs.mkdir(migrationsDir, { recursive: true });

      // Group tables by dependency order for migrations
      const tableGroups = this.groupTablesByDependency(analysisData.tables);

      // Generate migration files for each group
      for (let i = 0; i < tableGroups.length; i++) {
        const migrationNumber = String(i + 1).padStart(3, "0");
        const timestamp = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const migrationName = `${timestamp}_${migrationNumber}_${tableGroups[i].name}.sql`;

        const migrationContent = await this.generateMigrationContent(
          tableGroups[i]
        );

        const migrationPath = path.join(migrationsDir, migrationName);
        await fs.writeFile(migrationPath, migrationContent);

        console.log(`✅ Generated: ${migrationName}`);
      }

      // Generate rollback migrations
      await this.generateRollbackMigrations(tableGroups, migrationsDir);

      // Generate migration runner
      await this.generateMigrationRunner();

      // Generate package.json scripts
      await this.updatePackageJsonScripts();

      console.log("\\n🎉 Fresh migration system generated successfully!");
      console.log("\\nAvailable commands:");
      console.log("  npm run migrate:up    - Apply all migrations");
      console.log("  npm run migrate:down  - Rollback last migration");
      console.log(
        "  npm run migrate:fresh - Drop all tables and re-run migrations"
      );
      console.log(
        "  npm run migrate:reset - Rollback all migrations and re-run"
      );
    } catch (error) {
      console.error("❌ Migration generation failed:", error);
      throw error;
    }
  }

  groupTablesByDependency(tables) {
    // Define dependency-aware table groups
    const groups = [
      {
        name: "core_tables",
        description: "Core tables with no dependencies",
        tables: ["users", "brands", "categories", "migrations"],
      },
      {
        name: "product_tables",
        description: "Product and content related tables",
        tables: [
          "products",
          "product_images",
          "product_attributes",
          "content_blocks",
        ],
      },
      {
        name: "customer_tables",
        description: "Customer related tables",
        tables: ["addresses", "user_addresses", "wishlists", "wishlist_items"],
      },
      {
        name: "commerce_tables",
        description: "E-commerce and order tables",
        tables: ["cart_items", "orders", "order_items", "payments"],
      },
      {
        name: "marketing_tables",
        description: "Marketing and campaign tables",
        tables: [
          "campaigns",
          "marketing_campaigns",
          "coupons",
          "order_coupons",
        ],
      },
      {
        name: "review_tables",
        description: "Review and rating tables",
        tables: ["product_reviews"],
      },
    ];

    // Add table definitions to each group
    return groups
      .map((group) => ({
        ...group,
        tableDefinitions: group.tables
          .filter((tableName) => tables[tableName])
          .map((tableName) => tables[tableName]),
      }))
      .filter((group) => group.tableDefinitions.length > 0);
  }

  async generateMigrationContent(group) {
    let content = `-- Migration: ${group.description}\n`;
    content += `-- Tables: ${group.tables.join(", ")}\n`;
    content += `-- Generated: ${new Date().toISOString()}\n\n`;

    content += `-- Disable foreign key checks\n`;
    content += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    for (const table of group.tableDefinitions) {
      content += `-- Create ${table.name} table\n`;
      content += `DROP TABLE IF EXISTS \`${table.name}\`;\n\n`;
      content += `${table.createSQL};\n\n`;
    }

    content += `-- Re-enable foreign key checks\n`;
    content += `SET FOREIGN_KEY_CHECKS = 1;\n`;

    return content;
  }

  async generateRollbackMigrations(tableGroups, migrationsDir) {
    console.log("\\n🔄 Generating rollback migrations...");

    for (let i = 0; i < tableGroups.length; i++) {
      const migrationNumber = String(i + 1).padStart(3, "0");
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const rollbackName = `${timestamp}_${migrationNumber}_${tableGroups[i].name}_rollback.sql`;

      let rollbackContent = `-- Rollback: ${tableGroups[i].description}\n`;
      rollbackContent += `-- Tables: ${tableGroups[i].tables.join(", ")}\n`;
      rollbackContent += `-- Generated: ${new Date().toISOString()}\n\n`;

      rollbackContent += `-- Disable foreign key checks\n`;
      rollbackContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

      // Drop tables in reverse order
      for (let j = tableGroups[i].tableDefinitions.length - 1; j >= 0; j--) {
        const table = tableGroups[i].tableDefinitions[j];
        rollbackContent += `-- Drop ${table.name} table\n`;
        rollbackContent += `DROP TABLE IF EXISTS \`${table.name}\`;\n\n`;
      }

      rollbackContent += `-- Re-enable foreign key checks\n`;
      rollbackContent += `SET FOREIGN_KEY_CHECKS = 1;\n`;

      const rollbackPath = path.join(migrationsDir, rollbackName);
      await fs.writeFile(rollbackPath, rollbackContent);

      console.log(`✅ Generated rollback: ${rollbackName}`);
    }
  }

  async generateMigrationRunner() {
    const runnerContent = `require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

class MigrationRunner {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aynbeauty',
      port: parseInt(process.env.DB_PORT || '3306')
    };
  }

  async connect() {
    this.connection = await mysql.createConnection(this.config);
    console.log('✅ Connected to database');
  }

  async ensureMigrationsTable() {
    await this.connection.execute(\`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
  }

  async getExecutedMigrations() {
    const [rows] = await this.connection.execute('SELECT filename FROM migrations ORDER BY batch, executed_at');
    return rows.map(row => row.filename);
  }

  async getAvailableMigrations() {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = await fs.readdir(migrationsDir);
    return files
      .filter(file => file.endsWith('.sql') && !file.includes('_rollback'))
      .sort();
  }

  async executeMigrationFile(filename) {
    const migrationPath = path.join(__dirname, '..', 'migrations', filename);
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    // Split SQL into statements and execute
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await this.connection.execute(statement);
      }
    }
  }

  async validateTableSchema(tableName, expectedSchema) {
    try {
      // Get current table structure
      const [currentColumns] = await this.connection.execute(\`
        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      \`, [this.config.database, tableName]);

      // Compare with expected schema
      if (currentColumns.length !== expectedSchema.columns.length) {
        console.log(\`⚠️  Column count mismatch for \${tableName}: expected \${expectedSchema.columns.length}, got \${currentColumns.length}\`);
        return false;
      }

      console.log(\`✅ Table \${tableName} schema matches migration\`);
      return true;
    } catch (error) {
      console.log(\`❌ Table \${tableName} does not exist or has validation errors\`);
      return false;
    }
  }

  async runMigrations() {
    console.log('🚀 Running migrations...');
    
    await this.ensureMigrationsTable();
    
    const executed = await this.getExecutedMigrations();
    const available = await this.getAvailableMigrations();
    const pending = available.filter(migration => !executed.includes(migration));

    if (pending.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(\`📋 Found \${pending.length} pending migrations:\`);
    pending.forEach(migration => console.log(\`   - \${migration}\`));

    let batch = 1;
    if (executed.length > 0) {
      const [batchResult] = await this.connection.execute('SELECT MAX(batch) as max_batch FROM migrations');
      batch = (batchResult[0].max_batch || 0) + 1;
    }

    for (const migration of pending) {
      console.log(\`\\n⚡ Executing: \${migration}\`);
      
      try {
        await this.executeMigrationFile(migration);
        
        // Record migration
        await this.connection.execute(
          'INSERT INTO migrations (filename, batch) VALUES (?, ?)',
          [migration, batch]
        );
        
        console.log(\`✅ Completed: \${migration}\`);
      } catch (error) {
        console.error(\`❌ Failed to execute \${migration}:\`, error.message);
        throw error;
      }
    }

    console.log(\`\\n🎉 All migrations completed successfully!\`);
  }

  async rollbackLastBatch() {
    console.log('🔄 Rolling back last migration batch...');
    
    const [batchResult] = await this.connection.execute('SELECT MAX(batch) as max_batch FROM migrations');
    const lastBatch = batchResult[0].max_batch;
    
    if (!lastBatch) {
      console.log('✅ No migrations to rollback');
      return;
    }

    const [migrations] = await this.connection.execute(
      'SELECT filename FROM migrations WHERE batch = ? ORDER BY executed_at DESC',
      [lastBatch]
    );

    for (const migration of migrations) {
      const rollbackFile = migration.filename.replace('.sql', '_rollback.sql');
      console.log(\`🔄 Rolling back: \${migration.filename}\`);
      
      try {
        await this.executeMigrationFile(rollbackFile);
        await this.connection.execute('DELETE FROM migrations WHERE filename = ?', [migration.filename]);
        console.log(\`✅ Rolled back: \${migration.filename}\`);
      } catch (error) {
        console.error(\`❌ Failed to rollback \${migration.filename}:\`, error.message);
        throw error;
      }
    }

    console.log('🎉 Rollback completed successfully!');
  }

  async freshMigration() {
    console.log('🆕 Running fresh migration (drop all tables)...');
    
    // Get all tables except migrations
    const [tables] = await this.connection.execute(\`
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = ? AND TABLE_NAME != 'migrations'
      ORDER BY TABLE_NAME
    \`, [this.config.database]);

    // Drop all tables
    await this.connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of tables) {
      await this.connection.execute(\`DROP TABLE IF EXISTS \\\`\${table.TABLE_NAME}\\\`\`);
      console.log(\`🗑️  Dropped table: \${table.TABLE_NAME}\`);
    }
    await this.connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Clear migrations table
    await this.connection.execute('DELETE FROM migrations');
    
    // Run all migrations
    await this.runMigrations();
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Disconnected from database');
    }
  }
}

// CLI interface
const command = process.argv[2];

(async () => {
  const runner = new MigrationRunner();
  
  try {
    await runner.connect();
    
    switch (command) {
      case 'up':
        await runner.runMigrations();
        break;
      case 'down':
        await runner.rollbackLastBatch();
        break;
      case 'fresh':
        await runner.freshMigration();
        break;
      case 'reset':
        await runner.rollbackLastBatch();
        await runner.runMigrations();
        break;
      default:
        console.log('Available commands:');
        console.log('  node scripts/migrate.js up     - Run pending migrations');
        console.log('  node scripts/migrate.js down   - Rollback last batch');
        console.log('  node scripts/migrate.js fresh  - Drop all tables and re-run');
        console.log('  node scripts/migrate.js reset  - Rollback all and re-run');
        break;
    }
    
    await runner.disconnect();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await runner.disconnect();
    process.exit(1);
  }
})();

module.exports = MigrationRunner;`;

    const runnerPath = path.join(__dirname, "..", "scripts", "migrate.js");
    await fs.writeFile(runnerPath, runnerContent);
    console.log("✅ Generated migration runner: scripts/migrate.js");
  }

  async updatePackageJsonScripts() {
    const packageJsonPath = path.join(__dirname, "..", "package.json");

    try {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );

      // Add migration scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        "migrate:up": "node scripts/migrate.js up",
        "migrate:down": "node scripts/migrate.js down",
        "migrate:fresh": "node scripts/migrate.js fresh",
        "migrate:reset": "node scripts/migrate.js reset",
        "db:analyze": "node scripts/analyze-database.js",
        "db:generate-migrations": "node scripts/generate-fresh-migrations.js",
      };

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log("✅ Updated package.json with migration scripts");
    } catch (error) {
      console.error("⚠️  Failed to update package.json:", error.message);
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Disconnected from database");
    }
  }
}

// Run if executed directly
if (require.main === module) {
  (async () => {
    const generator = new FreshMigrationGenerator();

    try {
      await generator.connect();
      await generator.generateFreshMigrations();
      await generator.disconnect();
    } catch (error) {
      console.error("❌ Generation failed:", error);
      await generator.disconnect();
      process.exit(1);
    }
  })();
}

module.exports = FreshMigrationGenerator;
