require('dotenv').config({ path: '.env.local' });require('dotenv').config({ path: '.env.local' });const mysql = require("mysql2/promise");

const mysql = require('mysql2/promise');

const mysql = require('mysql2/promise');

async function checkProductsTable() {

  let connection;async function checkProducts() {

  

  try {async function checkProductsTable() {  const connection = await mysql.createConnection({

    connection = await mysql.createConnection({

      host: process.env.DB_HOST || 'localhost',  let connection;    host: "localhost",

      port: process.env.DB_PORT || 3306,

      user: process.env.DB_USER || 'root',      user: "root",

      password: process.env.DB_PASSWORD || '',

      database: process.env.DB_NAME || 'aynbeauty'  try {    password: "HYDsheik@143",

    });

    connection = await mysql.createConnection({    database: "aynbeauty",

    console.log('📊 Products Table Structure:');

    console.log('============================');      host: process.env.DB_HOST || 'localhost',  });

    

    const [columns] = await connection.execute('DESCRIBE products');      port: process.env.DB_PORT || 3306,

    

    columns.forEach((column, index) => {      user: process.env.DB_USER || 'root',  try {

      const nullability = column.Null === 'NO' ? 'NOT NULL' : 'NULL';

      const key = column.Key ? ` [${column.Key}]` : '';      password: process.env.DB_PASSWORD || '',    const [rows] = await connection.execute(

      const defaultVal = column.Default !== null ? ` DEFAULT '${column.Default}'` : '';

      const extra = column.Extra ? ` ${column.Extra}` : '';      database: process.env.DB_NAME || 'aynbeauty'      "SELECT id, name FROM products LIMIT 10"

      

      console.log(`${(index + 1).toString().padStart(2)}. ${column.Field.padEnd(25)} ${column.Type.padEnd(20)} ${nullability.padEnd(8)}${key}${defaultVal}${extra}`);    });    );

    });

        console.log("Available products:");

    // Check for specific columns

    const requiredColumns = ['image_url', 'primary_image', 'is_trending', 'is_must_have', 'is_new_arrival'];    console.log('📊 Products Table Structure:');    rows.forEach((row) => {

    console.log('\n🔍 Required columns check:');

        console.log('============================');      console.log(`ID: ${row.id}, Name: ${row.name}`);

    requiredColumns.forEach(col => {

      const found = columns.find(c => c.Field === col);        });

      if (found) {

        console.log(`✅ ${col} - ${found.Type}`);    const [columns] = await connection.execute('DESCRIBE products');  } catch (error) {

      } else {

        console.log(`❌ ${col} - NOT FOUND`);        console.error("Error:", error);

      }

    });    columns.forEach((column, index) => {  } finally {

    

  } catch (error) {      const nullability = column.Null === 'NO' ? 'NOT NULL' : 'NULL';    await connection.end();

    console.error('❌ Error:', error.message);

  } finally {      const key = column.Key ? ` [${column.Key}]` : '';  }

    if (connection) {

      await connection.end();      const defaultVal = column.Default !== null ? ` DEFAULT '${column.Default}'` : '';}

    }

  }      const extra = column.Extra ? ` ${column.Extra}` : '';

}

      checkProducts();

checkProductsTable();
      console.log(`${(index + 1).toString().padStart(2)}. ${column.Field.padEnd(25)} ${column.Type.padEnd(20)} ${nullability.padEnd(8)}${key}${defaultVal}${extra}`);
    });
    
    // Check for specific columns
    const requiredColumns = ['image_url', 'primary_image', 'is_trending', 'is_must_have', 'is_new_arrival'];
    console.log('\n🔍 Required columns check:');
    
    requiredColumns.forEach(col => {
      const found = columns.find(c => c.Field === col);
      if (found) {
        console.log(`✅ ${col} - ${found.Type}`);
      } else {
        console.log(`❌ ${col} - NOT FOUND`);
      }
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProductsTable();