require('dotenv').config({ path: '.env.local' });requ  const connection = await mysql.createConnection({

const mysql = require('mysql2/promise');    host: process.env.DB_HOST || 'localhost',

    port: process.env.DB_PORT || 3306,

async function checkMigrations() {    user: process.env.DB_USER || 'root',

  const connection = await mysql.createConnection({    password: process.env.DB_PASSWORD || '',

    host: process.env.DB_HOST || 'localhost',    database: process.env.DB_NAME || 'aynbeauty'

    port: process.env.DB_PORT || 3306,  });tenv").config({ path: ".env.local" });

    user: process.env.DB_USER || 'root',const mysql = require("mysql2/promise");

    password: process.env.DB_PASSWORD || '',

    database: process.env.DB_NAME || 'aynbeauty'async function checkMigrations() {

  });  const connection = await mysql.createConnection({

    host: process.env.MYSQL_HOST,

  try {    port: process.env.MYSQL_PORT,

    const [rows] = await connection.execute('SELECT * FROM migrations ORDER BY executed_at');    user: process.env.MYSQL_USER,

    console.log('Current migrations:');    password: process.env.MYSQL_PASSWORD,

    console.table(rows);    database: process.env.MYSQL_DATABASE,

  } catch (error) {  });

    console.log('Error:', error.message);

  } finally {  try {

    await connection.end();    const [rows] = await connection.execute(

  }      "SELECT * FROM migrations ORDER BY executed_at"

}    );

    console.log("Current migrations:");

checkMigrations();    console.table(rows);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkMigrations();
