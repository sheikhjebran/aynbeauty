const mysql = require("mysql2/promise");

async function checkTables() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aynbeauty",
  });

  try {
    console.log("Checking if required tables exist...");

    // Check wishlist_items table
    try {
      const [wishlistRows] = await connection.execute(
        "DESCRIBE wishlist_items"
      );
      console.log("✅ wishlist_items table exists");
      console.log(
        "Columns:",
        wishlistRows.map((row) => `${row.Field} (${row.Type})`)
      );
    } catch (error) {
      console.log("❌ wishlist_items table does not exist");
    }

    // Check cart_items table
    try {
      const [cartRows] = await connection.execute("DESCRIBE cart_items");
      console.log("✅ cart_items table exists");
      console.log(
        "Columns:",
        cartRows.map((row) => `${row.Field} (${row.Type})`)
      );
    } catch (error) {
      console.log("❌ cart_items table does not exist");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

checkTables();
