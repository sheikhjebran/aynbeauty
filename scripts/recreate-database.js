const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

// Extract database name from DB_NAME if it's a connection string
function getDatabaseName() {
  let dbName = process.env.DB_NAME || "aynbeauty";

  if (dbName.includes("mysql://") || dbName.includes("@")) {
    const match = dbName.match(/\/([^?\/]+)(\?|$)/);
    if (match) {
      dbName = match[1];
    } else {
      dbName = "aynbeauty";
    }
  }

  return dbName;
}

async function recreateDatabase() {
  console.log("🗑️  DROPPING AND RECREATING DATABASE WITH FRESH SCHEMA");
  console.log("=====================================================\n");

  let connection;

  try {
    const databaseName = getDatabaseName();
    console.log(`📊 Target database: ${databaseName}`);

    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: parseInt(process.env.DB_PORT || "3306"),
    });
    console.log("✅ Connected to MySQL server");

    // Drop the database if it exists
    console.log(`\n🗑️  Dropping database '${databaseName}' if exists...`);
    await connection.execute(`DROP DATABASE IF EXISTS \`${databaseName}\``);
    console.log("✅ Database dropped successfully");

    // Create fresh database
    console.log(`\n🆕 Creating fresh database '${databaseName}'...`);
    await connection.execute(
      `CREATE DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log("✅ Fresh database created");

    await connection.end();
    console.log("\n✅ Database recreation completed successfully!");
    console.log("\n🎯 Next steps:");
    console.log("1. Run fresh migrations: npm run fresh:migrate");
    console.log(
      "2. Fix admin password: node scripts/fix-admin-password-prod.js"
    );
    console.log("3. Restart application: pm2 restart aynbeauty --update-env");
  } catch (error) {
    console.error("❌ Error recreating database:", error.message);
    if (connection) {
      await connection.end();
    }
  }
}

recreateDatabase();
