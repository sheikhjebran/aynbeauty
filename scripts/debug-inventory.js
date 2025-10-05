require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function debugInventoryAPI() {
  console.log("🔍 DEBUGGING INVENTORY API ISSUES");
  console.log("================================\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "aynbeauty",
  });

  try {
    // 1. Check database connection
    console.log("1. ✅ Database connection successful");

    // 2. Check categories table
    console.log("\n2. 🔍 Checking categories table...");
    const [categories] = await connection.execute(
      "SELECT COUNT(*) as count FROM categories"
    );
    console.log(`   Found ${categories[0].count} categories`);

    if (categories[0].count === 0) {
      console.log("   ❌ NO CATEGORIES FOUND! This will cause 400 errors.");
      console.log("   💡 Run: npm run db:seed-categories");
    }

    // 3. Check products table structure
    console.log("\n3. 🔍 Checking products table structure...");
    const [productColumns] = await connection.execute("DESCRIBE products");
    const requiredColumns = ["name", "description", "price", "category_id"];
    const existingColumns = productColumns.map((col) => col.Field);

    requiredColumns.forEach((col) => {
      if (existingColumns.includes(col)) {
        console.log(`   ✅ ${col} column exists`);
      } else {
        console.log(`   ❌ ${col} column MISSING!`);
      }
    });

    // 4. Check admin users
    console.log("\n4. 🔍 Checking admin users...");
    const [adminUsers] = await connection.execute(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );
    console.log(`   Found ${adminUsers[0].count} admin users`);

    if (adminUsers[0].count === 0) {
      console.log(
        "   ❌ NO ADMIN USERS FOUND! This will cause 401/403 errors."
      );
      console.log("   💡 Run: npm run admin:reset");
    }

    // 5. Check environment variables
    console.log("\n5. 🔍 Checking environment variables...");
    const envVars = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
    envVars.forEach((varName) => {
      const value = process.env[varName];
      if (value) {
        console.log(`   ✅ ${varName} is set`);
      } else {
        console.log(`   ❌ ${varName} is NOT set!`);
      }
    });

    // 6. Test sample category lookup
    console.log("\n6. 🔍 Testing category lookup...");
    const [sampleCategory] = await connection.execute(
      "SELECT id, name FROM categories LIMIT 1"
    );
    if (sampleCategory.length > 0) {
      console.log(
        `   ✅ Sample category found: "${sampleCategory[0].name}" (ID: ${sampleCategory[0].id})`
      );
    } else {
      console.log("   ❌ No categories available for testing");
    }

    console.log("\n🎯 POTENTIAL SOLUTIONS:");
    console.log("======================");

    if (categories[0].count === 0) {
      console.log("1. Add categories: npm run db:seed-categories");
    }

    if (adminUsers[0].count === 0) {
      console.log("2. Create admin user: npm run admin:reset");
    }

    console.log("3. Check JWT_SECRET in your .env file");
    console.log("4. Ensure frontend sends proper Authorization header");
    console.log(
      "5. Verify all required fields (name, description, price, category) are sent in POST request"
    );
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    await connection.end();
  }
}

debugInventoryAPI();
