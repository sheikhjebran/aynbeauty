const mysql = require("mysql2/promise");

async function setupCategories() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aynbeauty",
  });

  try {
    // Check if categories table exists
    const [categories] = await connection.execute(
      "SELECT * FROM categories LIMIT 10"
    );
    console.log("Categories found:");
    console.table(categories);
  } catch (error) {
    console.log("Categories table does not exist, creating...");

    // Create categories table
    await connection.execute(`CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    const cats = [
      { name: "Skincare", slug: "skincare" },
      { name: "Makeup", slug: "makeup" },
      { name: "Haircare", slug: "haircare" },
      { name: "Fragrance", slug: "fragrance" },
      { name: "Body Care", slug: "body-care" },
      { name: "Men's Grooming", slug: "mens-grooming" },
      { name: "Tools & Accessories", slug: "tools-accessories" },
      { name: "Gift Sets", slug: "gift-sets" },
      { name: "Wellness", slug: "wellness" },
    ];

    for (const cat of cats) {
      await connection.execute(
        "INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)",
        [cat.name, cat.slug]
      );
    }

    console.log("Categories created");
    const [newCategories] = await connection.execute(
      "SELECT * FROM categories"
    );
    console.table(newCategories);
  } finally {
    await connection.end();
  }
}

setupCategories();
