const mysql = require("mysql2/promise");

async function checkProducts() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "HYDsheik@143",
    database: "aynbeauty",
  });

  try {
    const [rows] = await connection.execute(
      "SELECT id, name FROM products LIMIT 10"
    );
    console.log("Available products:");
    rows.forEach((row) => {
      console.log(`ID: ${row.id}, Name: ${row.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

checkProducts();
