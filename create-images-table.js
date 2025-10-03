const mysql = require("mysql2/promise");

async function createProductImagesTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aynbeauty",
  });

  try {
    console.log("Creating product_images table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        alt_text VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_primary (is_primary),
        INDEX idx_sort_order (sort_order)
      )
    `);
    console.log("product_images table created successfully!");

    console.log("Table structure:");
    const [columns] = await connection.execute("DESCRIBE product_images");
    console.table(columns);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

createProductImagesTable();
