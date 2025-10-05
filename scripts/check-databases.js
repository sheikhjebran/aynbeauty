const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function listDatabases() {
  let connection;

  try {
    console.log(
      "🔍 Checking available databases for user:",
      process.env.DB_USER
    );
    console.log("=====================================");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL successfully");

    // List all databases the user has access to
    const [databases] = await connection.execute("SHOW DATABASES");
    const dbNames = databases
      .map((row) => row.Database)
      .filter(
        (name) =>
          ![
            "information_schema",
            "performance_schema",
            "mysql",
            "sys",
          ].includes(name)
      );

    if (dbNames.length > 0) {
      console.log("\n📋 Available databases:");
      dbNames.forEach((name, index) => {
        console.log(`   ${index + 1}. ${name}`);
      });

      console.log("\n💡 To use one of these databases:");
      console.log("   1. Update your .env.local file:");
      console.log(`      DB_NAME=${dbNames[0]}`);
      console.log("   2. Run: npm run migrate:production");

      if (dbNames.includes("aynbeauty")) {
        console.log("\n🎉 Great! Database 'aynbeauty' already exists!");
        console.log(
          "   You can run the migration directly: npm run migrate:production"
        );
      }
    } else {
      console.log("\n❌ No accessible databases found.");
      console.log("   Please contact BigRock support to:");
      console.log("   - Create a database named 'aynbeauty'");
      console.log("   - Grant access to user 'ayn'");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.message.includes("Access denied")) {
      console.log("\n🔧 Please check your database credentials in .env.local");
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

listDatabases();
