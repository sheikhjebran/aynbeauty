require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function checkCategories() {
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
      console.log(
        "❌ No categories found! This could be causing the API error."
      );
      console.log("📝 Adding sample categories...");

      // Add sample categories
      const sampleCategories = [
        {
          name: "Skincare",
          slug: "skincare",
          description: "Skincare products",
        },
        { name: "Makeup", slug: "makeup", description: "Makeup products" },
        {
          name: "Haircare",
          slug: "haircare",
          description: "Hair care products",
        },
        {
          name: "Fragrance",
          slug: "fragrance",
          description: "Perfumes and fragrances",
        },
        {
          name: "Tools",
          slug: "tools",
          description: "Beauty tools and accessories",
        },
      ];

      for (const category of sampleCategories) {
        await connection.execute(
          "INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
          [category.name, category.slug, category.description]
        );
        console.log(`✅ Added category: ${category.name}`);
      }
    } else {
      console.log(`✅ Found ${categories.length} categories:`);
      categories.forEach((cat) => {
        console.log(`   - ${cat.name} (ID: ${cat.id})`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkCategories();
