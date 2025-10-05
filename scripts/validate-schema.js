require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

class SchemaValidator {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
      port: parseInt(process.env.DB_PORT || "3306"),
    };
    this.expectedSchema = null;
  }

  async connect() {
    this.connection = await mysql.createConnection(this.config);
    console.log("✅ Connected to database for schema validation");
  }

  async loadExpectedSchema() {
    const analysisPath = path.join(__dirname, "database_analysis.json");
    const analysisData = JSON.parse(await fs.readFile(analysisPath, "utf8"));
    this.expectedSchema = analysisData.tables;
    console.log(
      `📋 Loaded expected schema for ${
        Object.keys(this.expectedSchema).length
      } tables`
    );
  }

  async getCurrentDatabaseSchema() {
    const currentSchema = {};

    // Get all current tables
    const [tables] = await this.connection.execute("SHOW TABLES");
    const tableNames = tables.map((row) => Object.values(row)[0]);

    for (const tableName of tableNames) {
      currentSchema[tableName] = await this.analyzeCurrentTable(tableName);
    }

    return currentSchema;
  }

  async analyzeCurrentTable(tableName) {
    const tableInfo = {
      name: tableName,
      columns: [],
      indexes: [],
      foreignKeys: [],
      createSQL: "",
    };

    try {
      // Get CREATE TABLE statement
      const [createResult] = await this.connection.execute(
        `SHOW CREATE TABLE \`${tableName}\``
      );
      tableInfo.createSQL = createResult[0]["Create Table"];

      // Get column information
      const [columns] = await this.connection.execute(
        `
        SELECT 
          COLUMN_NAME,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `,
        [this.config.database, tableName]
      );

      tableInfo.columns = columns.map((col) => ({
        name: col.COLUMN_NAME,
        type: col.COLUMN_TYPE,
        nullable: col.IS_NULLABLE === "YES",
        default: col.COLUMN_DEFAULT,
        extra: col.EXTRA,
      }));

      // Get indexes
      const [indexes] = await this.connection.execute(
        `SHOW INDEX FROM \`${tableName}\``
      );
      const indexMap = {};

      indexes.forEach((idx) => {
        if (!indexMap[idx.Key_name]) {
          indexMap[idx.Key_name] = {
            name: idx.Key_name,
            unique: idx.Non_unique === 0,
            columns: [],
          };
        }
        indexMap[idx.Key_name].columns.push(idx.Column_name);
      });

      tableInfo.indexes = Object.values(indexMap);

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
        [this.config.database, tableName]
      );

      tableInfo.foreignKeys = foreignKeys.map((fk) => ({
        name: fk.CONSTRAINT_NAME,
        column: fk.COLUMN_NAME,
        referencedTable: fk.REFERENCED_TABLE_NAME,
        referencedColumn: fk.REFERENCED_COLUMN_NAME,
      }));

      return tableInfo;
    } catch (error) {
      console.error(`❌ Failed to analyze table ${tableName}:`, error.message);
      return tableInfo;
    }
  }

  async validateSchema() {
    console.log("🔍 VALIDATING DATABASE SCHEMA");
    console.log("============================\\n");

    await this.loadExpectedSchema();
    const currentSchema = await this.getCurrentDatabaseSchema();

    const validation = {
      valid: true,
      issues: [],
      summary: {
        tablesMatched: 0,
        tablesMissing: 0,
        tablesExtra: 0,
        columnsMatched: 0,
        columnsMissing: 0,
        columnsExtra: 0,
      },
    };

    // Check for missing tables
    const expectedTables = Object.keys(this.expectedSchema);
    const currentTables = Object.keys(currentSchema);

    const missingTables = expectedTables.filter(
      (table) => !currentTables.includes(table)
    );
    const extraTables = currentTables.filter(
      (table) => !expectedTables.includes(table)
    );

    if (missingTables.length > 0) {
      validation.valid = false;
      validation.issues.push({
        type: "missing_tables",
        tables: missingTables,
        message: `Missing tables: ${missingTables.join(", ")}`,
      });
      validation.summary.tablesMissing = missingTables.length;
    }

    if (extraTables.length > 0) {
      validation.issues.push({
        type: "extra_tables",
        tables: extraTables,
        message: `Extra tables found: ${extraTables.join(", ")}`,
      });
      validation.summary.tablesExtra = extraTables.length;
    }

    // Validate each table that exists in both schemas
    const commonTables = expectedTables.filter((table) =>
      currentTables.includes(table)
    );
    validation.summary.tablesMatched = commonTables.length;

    for (const tableName of commonTables) {
      const expectedTable = this.expectedSchema[tableName];
      const currentTable = currentSchema[tableName];

      console.log(`🔍 Validating table: ${tableName}`);

      // Validate columns
      const columnValidation = this.validateTableColumns(
        tableName,
        expectedTable,
        currentTable
      );
      if (!columnValidation.valid) {
        validation.valid = false;
        validation.issues.push(...columnValidation.issues);
      }

      validation.summary.columnsMatched += columnValidation.matched;
      validation.summary.columnsMissing += columnValidation.missing;
      validation.summary.columnsExtra += columnValidation.extra;

      // Check if table structure completely matches
      if (columnValidation.valid) {
        console.log(`   ✅ Schema matches`);
      } else {
        console.log(`   ❌ Schema mismatch detected`);
      }
    }

    return validation;
  }

  validateTableColumns(tableName, expectedTable, currentTable) {
    const validation = {
      valid: true,
      issues: [],
      matched: 0,
      missing: 0,
      extra: 0,
    };

    const expectedColumns = expectedTable.columns.map((col) => col.name);
    const currentColumns = currentTable.columns.map((col) => col.name);

    const missingColumns = expectedColumns.filter(
      (col) => !currentColumns.includes(col)
    );
    const extraColumns = currentColumns.filter(
      (col) => !expectedColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      validation.valid = false;
      validation.missing = missingColumns.length;
      validation.issues.push({
        type: "missing_columns",
        table: tableName,
        columns: missingColumns,
        message: `Table ${tableName} missing columns: ${missingColumns.join(
          ", "
        )}`,
      });
    }

    if (extraColumns.length > 0) {
      validation.extra = extraColumns.length;
      validation.issues.push({
        type: "extra_columns",
        table: tableName,
        columns: extraColumns,
        message: `Table ${tableName} has extra columns: ${extraColumns.join(
          ", "
        )}`,
      });
    }

    const commonColumns = expectedColumns.filter((col) =>
      currentColumns.includes(col)
    );
    validation.matched = commonColumns.length;

    // Validate column types for common columns
    for (const columnName of commonColumns) {
      const expectedColumn = expectedTable.columns.find(
        (col) => col.name === columnName
      );
      const currentColumn = currentTable.columns.find(
        (col) => col.name === columnName
      );

      if (expectedColumn.type !== currentColumn.type) {
        validation.valid = false;
        validation.issues.push({
          type: "column_type_mismatch",
          table: tableName,
          column: columnName,
          expected: expectedColumn.type,
          actual: currentColumn.type,
          message: `Column ${tableName}.${columnName} type mismatch: expected ${expectedColumn.type}, got ${currentColumn.type}`,
        });
      }
    }

    return validation;
  }

  async repairSchema(validation) {
    console.log("\\n🔧 REPAIRING SCHEMA ISSUES");
    console.log("=========================\\n");

    for (const issue of validation.issues) {
      switch (issue.type) {
        case "missing_tables":
          await this.recreateMissingTables(issue.tables);
          break;
        case "missing_columns":
          await this.addMissingColumns(issue);
          break;
        case "extra_tables":
          await this.removeExtraTables(issue.tables);
          break;
        case "column_type_mismatch":
          await this.fixColumnType(issue);
          break;
      }
    }

    console.log("\\n✅ Schema repair completed");
  }

  async recreateMissingTables(missingTables) {
    console.log(`🔧 Recreating missing tables: ${missingTables.join(", ")}`);

    for (const tableName of missingTables) {
      const expectedTable = this.expectedSchema[tableName];
      console.log(`   🏗️  Creating table: ${tableName}`);

      try {
        await this.connection.execute(expectedTable.createSQL);
        console.log(`   ✅ Created: ${tableName}`);
      } catch (error) {
        console.error(`   ❌ Failed to create ${tableName}:`, error.message);
      }
    }
  }

  async removeExtraTables(extraTables) {
    console.log(`🗑️  Removing extra tables: ${extraTables.join(", ")}`);

    await this.connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    for (const tableName of extraTables) {
      console.log(`   🗑️  Dropping table: ${tableName}`);

      try {
        await this.connection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`   ✅ Dropped: ${tableName}`);
      } catch (error) {
        console.error(`   ❌ Failed to drop ${tableName}:`, error.message);
      }
    }

    await this.connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  }

  async addMissingColumns(issue) {
    console.log(
      `🔧 Adding missing columns to ${issue.table}: ${issue.columns.join(", ")}`
    );

    const expectedTable = this.expectedSchema[issue.table];

    for (const columnName of issue.columns) {
      const columnDef = expectedTable.columns.find(
        (col) => col.name === columnName
      );

      if (columnDef) {
        console.log(`   ➕ Adding column: ${issue.table}.${columnName}`);

        // This is a simplified approach - in practice, you'd need to parse the CREATE TABLE
        // statement to get the exact column definition
        console.log(
          `   ⚠️  Manual intervention required for column: ${columnName}`
        );
      }
    }
  }

  async fixColumnType(issue) {
    console.log(`🔧 Fixing column type: ${issue.table}.${issue.column}`);
    console.log(`   Expected: ${issue.expected}, Actual: ${issue.actual}`);
    console.log(`   ⚠️  Manual intervention recommended for type changes`);
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Disconnected from database");
    }
  }

  async generateValidationReport(validation) {
    const report = {
      timestamp: new Date().toISOString(),
      database: this.config.database,
      validation: validation,
      recommendations: [],
    };

    // Generate recommendations
    if (!validation.valid) {
      report.recommendations.push("Run migrations to fix schema issues");

      if (validation.summary.tablesMissing > 0) {
        report.recommendations.push(
          "Missing tables detected - consider running fresh migration"
        );
      }

      if (validation.summary.columnsMissing > 0) {
        report.recommendations.push(
          "Missing columns detected - check migration files"
        );
      }
    } else {
      report.recommendations.push("Schema is valid - no action needed");
    }

    // Save report
    const reportPath = path.join(
      __dirname,
      "..",
      "schema_validation_report.json"
    );
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`\\n📊 VALIDATION SUMMARY`);
    console.log("===================");
    console.log(`Status: ${validation.valid ? "✅ VALID" : "❌ INVALID"}`);
    console.log(
      `Tables: ${validation.summary.tablesMatched} matched, ${validation.summary.tablesMissing} missing, ${validation.summary.tablesExtra} extra`
    );
    console.log(
      `Columns: ${validation.summary.columnsMatched} matched, ${validation.summary.columnsMissing} missing, ${validation.summary.columnsExtra} extra`
    );
    console.log(`Issues: ${validation.issues.length}`);
    console.log(`\\n📁 Report saved to: ${reportPath}`);

    return report;
  }
}

// CLI interface
const command = process.argv[2];

(async () => {
  const validator = new SchemaValidator();

  try {
    await validator.connect();

    switch (command) {
      case "validate":
        const validation = await validator.validateSchema();
        await validator.generateValidationReport(validation);
        break;
      case "repair":
        const validationForRepair = await validator.validateSchema();
        if (!validationForRepair.valid) {
          await validator.repairSchema(validationForRepair);
        } else {
          console.log("✅ Schema is already valid - no repair needed");
        }
        break;
      default:
        console.log("Available commands:");
        console.log(
          "  node scripts/validate-schema.js validate - Validate current schema"
        );
        console.log(
          "  node scripts/validate-schema.js repair   - Repair schema issues"
        );
        break;
    }

    await validator.disconnect();
  } catch (error) {
    console.error("❌ Schema validation failed:", error);
    await validator.disconnect();
    process.exit(1);
  }
})();

module.exports = SchemaValidator;
