require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function seedCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "aynbeauty",
  });

  try {
    console.log("🔍 Checking categories in database...");
    const [categories] = await connection.execute(
      "SELECT * FROM categories ORDER BY name"
    );

    if (categories.length === 0) {
      console.log("❌ No categories found! Adding sample categories...");

      // Add sample categories
      const sampleCategories = [
        {
          name: "Skincare",
          slug: "skincare",
          description: "Skincare products for all skin types",
        },
        {
          name: "Makeup",
          slug: "makeup",
          description: "Makeup and cosmetic products",
        },
        {
          name: "Haircare",
          slug: "haircare",
          description: "Hair care and styling products",
        },
        {
          name: "Fragrance",
          slug: "fragrance",
          description: "Perfumes and fragrances",
        },
        {
          name: "Tools & Accessories",
          slug: "tools-accessories",
          description: "Beauty tools and accessories",
        },
        {
          name: "Body Care",
          slug: "body-care",
          description: "Body lotions, scrubs and care products",
        },
        {
          name: "Nail Care",
          slug: "nail-care",
          description: "Nail polish and nail care products",
        },
      ];

      for (const category of sampleCategories) {
        await connection.execute(
          "INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
          [category.name, category.slug, category.description]
        );
        console.log(`✅ Added category: ${category.name}`);
      }

      console.log(
        `\n🎉 Successfully added ${sampleCategories.length} categories!`
      );
    } else {
      console.log(`✅ Found ${categories.length} existing categories:`);
      categories.forEach((cat) => {
        console.log(`   - ${cat.name} (ID: ${cat.id})`);
      });
      console.log("\nℹ️  Categories already exist. No action needed.");
    }

    // Also check if we have any admin users
    console.log("\n🔍 Checking admin users...");
    const [adminUsers] = await connection.execute(
      "SELECT id, email, role FROM users WHERE role = 'admin'"
    );

    if (adminUsers.length === 0) {
      console.log(
        "⚠️  No admin users found! You may need to run: npm run admin:reset"
      );
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach((user) => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
    console.log("\n✅ Database connection closed.");
  }
}

seedCategories();
