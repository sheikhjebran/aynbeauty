const mysql = require("mysql2/promise");

async function createWishlistTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aynbeauty",
  });

  try {
    console.log("Creating wishlist_items table...");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        product_id int(11) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_user_product (user_id, product_id),
        KEY idx_user_id (user_id),
        KEY idx_product_id (product_id),
        CONSTRAINT wishlist_items_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT wishlist_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("✅ wishlist_items table created successfully");

    // Verify the table
    const [rows] = await connection.execute("DESCRIBE wishlist_items");
    console.log("Table structure:");
    rows.forEach((row) => {
      console.log(
        `  ${row.Field}: ${row.Type} ${
          row.Null === "NO" ? "NOT NULL" : "NULL"
        } ${row.Key ? `(${row.Key})` : ""}`
      );
    });
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await connection.end();
  }
}

createWishlistTable();
