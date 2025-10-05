require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

class DatabaseAnalyzer {
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
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log("✅ Connected to database for analysis");
      return true;
    } catch (error) {
      console.error("❌ Failed to connect to database:", error.message);
      return false;
    }
  }

  async analyzeCompleteDatabase() {
    console.log("🔍 COMPLETE DATABASE ANALYSIS");
    console.log("=============================\\n");

    const analysis = {
      database: this.config.database,
      timestamp: new Date().toISOString(),
      tables: {},
      summary: {},
    };

    try {
      // Get all tables
      const [tables] = await this.connection.execute("SHOW TABLES");
      const tableNames = tables.map((row) => Object.values(row)[0]);

      console.log(`📊 Found ${tableNames.length} tables:\\n`);

      for (const tableName of tableNames) {
        console.log(`🔍 Analyzing table: ${tableName}`);

        // Get table structure
        const tableAnalysis = await this.analyzeTable(tableName);
        analysis.tables[tableName] = tableAnalysis;

        console.log(`   - Columns: ${tableAnalysis.columns.length}`);
        console.log(`   - Indexes: ${tableAnalysis.indexes.length}`);
        console.log(`   - Foreign Keys: ${tableAnalysis.foreignKeys.length}`);
        console.log(`   - Rows: ${tableAnalysis.rowCount}`);
      }

      // Generate summary
      analysis.summary = {
        totalTables: tableNames.length,
        totalColumns: Object.values(analysis.tables).reduce(
          (sum, table) => sum + table.columns.length,
          0
        ),
        totalIndexes: Object.values(analysis.tables).reduce(
          (sum, table) => sum + table.indexes.length,
          0
        ),
        totalForeignKeys: Object.values(analysis.tables).reduce(
          (sum, table) => sum + table.foreignKeys.length,
          0
        ),
        totalRows: Object.values(analysis.tables).reduce(
          (sum, table) => sum + table.rowCount,
          0
        ),
      };

      // Save analysis to file
      const analysisFile = path.join(__dirname, "database_analysis.json");
      await fs.writeFile(analysisFile, JSON.stringify(analysis, null, 2));

      console.log("\\n📊 DATABASE SUMMARY");
      console.log("==================");
      console.log(`Tables: ${analysis.summary.totalTables}`);
      console.log(`Columns: ${analysis.summary.totalColumns}`);
      console.log(`Indexes: ${analysis.summary.totalIndexes}`);
      console.log(`Foreign Keys: ${analysis.summary.totalForeignKeys}`);
      console.log(`Total Rows: ${analysis.summary.totalRows}`);
      console.log(`\\n📁 Analysis saved to: ${analysisFile}`);

      return analysis;
    } catch (error) {
      console.error("❌ Database analysis failed:", error);
      throw error;
    }
  }

  async analyzeTable(tableName) {
    const tableInfo = {
      name: tableName,
      columns: [],
      indexes: [],
      foreignKeys: [],
      createSQL: "",
      rowCount: 0,
      engine: "",
      charset: "",
      collation: "",
    };

    try {
      // Get CREATE TABLE statement
      const [createResult] = await this.connection.execute(
        `SHOW CREATE TABLE \`${tableName}\``
      );
      tableInfo.createSQL = createResult[0]["Create Table"];

      // Extract engine, charset, collation from CREATE statement
      const engineMatch = tableInfo.createSQL.match(/ENGINE=([A-Za-z0-9]+)/);
      const charsetMatch = tableInfo.createSQL.match(
        /DEFAULT CHARSET=([A-Za-z0-9_]+)/
      );
      const collationMatch = tableInfo.createSQL.match(
        /COLLATE=([A-Za-z0-9_]+)/
      );

      tableInfo.engine = engineMatch ? engineMatch[1] : "Unknown";
      tableInfo.charset = charsetMatch ? charsetMatch[1] : "Unknown";
      tableInfo.collation = collationMatch ? collationMatch[1] : "Unknown";

      // Get column information
      const [columns] = await this.connection.execute(
        `
        SELECT 
          COLUMN_NAME,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          EXTRA,
          COLUMN_COMMENT,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          NUMERIC_PRECISION,
          NUMERIC_SCALE
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `,
        [this.config.database, tableName]
      );

      tableInfo.columns = columns.map((col) => ({
        name: col.COLUMN_NAME,
        type: col.COLUMN_TYPE,
        dataType: col.DATA_TYPE,
        nullable: col.IS_NULLABLE === "YES",
        default: col.COLUMN_DEFAULT,
        extra: col.EXTRA,
        comment: col.COLUMN_COMMENT,
        maxLength: col.CHARACTER_MAXIMUM_LENGTH,
        precision: col.NUMERIC_PRECISION,
        scale: col.NUMERIC_SCALE,
      }));

      // Get index information
      const [indexes] = await this.connection.execute(
        `SHOW INDEX FROM \`${tableName}\``
      );
      const indexMap = {};

      indexes.forEach((idx) => {
        if (!indexMap[idx.Key_name]) {
          indexMap[idx.Key_name] = {
            name: idx.Key_name,
            unique: idx.Non_unique === 0,
            type: idx.Index_type,
            columns: [],
          };
        }
        indexMap[idx.Key_name].columns.push({
          column: idx.Column_name,
          order: idx.Seq_in_index,
        });
      });

      tableInfo.indexes = Object.values(indexMap);

      // Get foreign key information
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
        [this.config.database, tableName]
      );

      tableInfo.foreignKeys = foreignKeys.map((fk) => ({
        name: fk.CONSTRAINT_NAME,
        column: fk.COLUMN_NAME,
        referencedTable: fk.REFERENCED_TABLE_NAME,
        referencedColumn: fk.REFERENCED_COLUMN_NAME,
      }));

      // Get row count
      const [countResult] = await this.connection.execute(
        `SELECT COUNT(*) as count FROM \`${tableName}\``
      );
      tableInfo.rowCount = countResult[0].count;

      return tableInfo;
    } catch (error) {
      console.error(`❌ Failed to analyze table ${tableName}:`, error.message);
      return tableInfo;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Disconnected from database");
    }
  }
}

// Run analysis if this script is executed directly
if (require.main === module) {
  (async () => {
    const analyzer = new DatabaseAnalyzer();

    try {
      const connected = await analyzer.connect();
      if (!connected) {
        process.exit(1);
      }

      await analyzer.analyzeCompleteDatabase();
      await analyzer.disconnect();

      console.log("\\n🎉 Database analysis completed successfully!");
    } catch (error) {
      console.error("❌ Analysis failed:", error);
      await analyzer.disconnect();
      process.exit(1);
    }
  })();
}

module.exports = DatabaseAnalyzer;
