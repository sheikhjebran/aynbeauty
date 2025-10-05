const mysql = require("mysql2/promise");

const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "ayn",
  password: "aynBeauty@123",
  database: "aynbeauty",
  charset: "utf8mb4",
};

async function testQuery() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    console.log("Testing different LIMIT approaches...");

    // Test 1: String interpolation (not recommended but works)
    const limit = 2;
    const offset = 0;
    const [products1] = await connection.query(`
      SELECT p.id, p.name FROM products p LIMIT ${limit} OFFSET ${offset}
    `);
    console.log("Test 1 - String interpolation:", products1);

    // Test 2: Check MySQL version
    const [version] = await connection.query("SELECT VERSION() as version");
    console.log("MySQL version:", version);

    await connection.end();
    console.log("Tests completed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

testQuery();
