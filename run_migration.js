const mysql = require('mysql2/promise');const my    // Create connection

const fs = require('fs');    connection = await mysql.createConnection({

const path = require('path');      host: 'localhost',

      user: 'root',

async function runMigration() {      password: '',

  let connection;      database: 'aynbeauty',

        multipleStatements: true

  try {    });quire("mysql2/promise");

    // Create connectionconst fs = require("fs");

    connection = await mysql.createConnection({const path = require("path");

      host: 'localhost',

      user: 'root',async function runMigration() {

      password: '',  let connection;

      database: 'aynbeauty',

      multipleStatements: true  try {

    });    // Create connection

    connection = await mysql.createConnection({

    console.log('Connected to MySQL database');      host: "localhost",

      user: "root",

    // Read the SQL file      password: "smiledoc123",

    const sqlPath = path.join(__dirname, 'database_fixes.sql');      database: "aynbeauty",

    const sql = fs.readFileSync(sqlPath, 'utf8');      multipleStatements: true,

    });

    // Execute the migration

    console.log('Running database migration...');    console.log("Connected to MySQL database");

    const [results] = await connection.execute(sql);

        // Read the SQL file

    console.log('Migration completed successfully!');    const sqlPath = path.join(__dirname, "database_fixes.sql");

    console.log('Results:', results);    const sql = fs.readFileSync(sqlPath, "utf8");



    // Verify the changes    // Execute the migration

    console.log('\n--- Checking addresses table ---');    console.log("Running database migration...");

    const [addressesDesc] = await connection.execute('DESCRIBE addresses');    const [results] = await connection.execute(sql);

    console.table(addressesDesc);

    console.log("Migration completed successfully!");

    console.log('\n--- Checking orders table columns ---');    console.log("Results:", results);

    const [ordersDesc] = await connection.execute('DESCRIBE orders');

    console.table(ordersDesc);    // Verify the changes

    console.log("\n--- Checking addresses table ---");

  } catch (error) {    const [addressesDesc] = await connection.execute("DESCRIBE addresses");

    console.error('Migration failed:', error);    console.table(addressesDesc);

    process.exit(1);

  } finally {    console.log("\n--- Checking orders table columns ---");

    if (connection) {    const [ordersDesc] = await connection.execute("DESCRIBE orders");

      await connection.end();    console.table(ordersDesc);

      console.log('\nDatabase connection closed');  } catch (error) {

    }    console.error("Migration failed:", error);

  }    process.exit(1);

}  } finally {

    if (connection) {

runMigration();      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

runMigration();
