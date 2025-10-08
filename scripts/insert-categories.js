require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function checkAndInsertCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "aynbeauty",
  });

  try {
    // Check current categories
    console.log("🔍 Checking current categories...");
    const [currentCategories] = await connection.execute(
      "SELECT * FROM categories"
    );
    console.log(`Found ${currentCategories.length} categories:`);
    if (currentCategories.length > 0) {
      console.table(currentCategories);
    } else {
      console.log("No categories found. Inserting default categories...");

      // Insert the categories
      const categories = [
        ["Skincare", "skincare", "Skincare products for all skin types", 1, 1],
        ["Bath and Body", "bath-and-body", "Bath and body products", 1, 2],
        ["Lips", "lips", "Lip care and color products", 1, 3],
        ["Fragrances", "fragrance", "Perfumes and fragrances", 1, 4],
        ["Eyes", "eyes", "Eye makeup and care products", 1, 5],
        ["Nails", "nails", "Nail care and color products", 1, 6],
        ["Combo Sets", "combo-sets", "Combo sets for a complete look", 1, 7],
      ];

      for (const [
        name,
        slug,
        description,
        is_active,
        sort_order,
      ] of categories) {
        await connection.execute(
          "INSERT INTO categories (name, slug, description, is_active, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [name, slug, description, is_active, sort_order]
        );
        console.log(`✅ Inserted: ${name}`);
      }

      // Check again
      const [newCategories] = await connection.execute(
        "SELECT * FROM categories"
      );
      console.log(
        `\n🎉 Successfully inserted ${newCategories.length} categories:`
      );
      console.table(newCategories);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkAndInsertCategories();
