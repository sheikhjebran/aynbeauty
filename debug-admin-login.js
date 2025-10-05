// Debug Admin Login Script// Debug Admin Login Script// Debug admin login functionality

require('dotenv').config({ path: '.env.local' });

const mysql = require('mysql2/promise');// Run this to test admin authentication locallyconst testAdminLogin = async () => {

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');  try {



async function debugAdminLogin() {require('dotenv').config({ path: '.env.local' });    console.log("Testing admin login...");

  let connection;

  const mysql = require('mysql2/promise');

  try {

    // Extract database name from DB_NAME if it's a connection stringconst bcrypt = require('bcryptjs');    const response = await fetch("http://localhost:3000/api/auth/signin", {

    let dbName = process.env.DB_NAME || "aynbeauty";

const jwt = require('jsonwebtoken');      method: "POST",

    if (dbName.includes("mysql://") || dbName.includes("@")) {

      const match = dbName.match(/\/([^?\/]+)(\?|$)/);      headers: {

      if (match) {

        dbName = match[1];async function debugAdminLogin() {        "Content-Type": "application/json",

      } else {

        dbName = "aynbeauty";  let connection;      },

      }

    }        body: JSON.stringify({



    connection = await mysql.createConnection({  try {        email: "admin@aynbeauty.com",

      host: process.env.DB_HOST || 'localhost',

      port: process.env.DB_PORT || 3306,    // Extract database name from DB_NAME if it's a connection string        password: "admin123",

      user: process.env.DB_USER || 'root',

      password: process.env.DB_PASSWORD || '',    let dbName = process.env.DB_NAME || "aynbeauty";      }),

      database: dbName,

    });    });



    console.log('🔐 ADMIN LOGIN DEBUG');    if (dbName.includes("mysql://") || dbName.includes("@")) {

    console.log('==================');

      const match = dbName.match(/\/([^?\/]+)(\?|$)/);    console.log("Response status:", response.status);

    // Test admin user lookup

    const [users] = await connection.execute(      if (match) {    const data = await response.json();

      'SELECT id, email, password, first_name, last_name, role, is_active, email_verified FROM users WHERE email = ?',

      ['admin@aynbeauty.com']        dbName = match[1];    console.log("Response data:", JSON.stringify(data, null, 2));

    );

      } else {

    if (users.length === 0) {

      console.log('❌ Admin user not found');        dbName = "aynbeauty";    if (data.success) {

      return;

    }      }      console.log("✅ Login successful");



    const user = users[0];    }      console.log("User role:", data.user?.role);

    console.log('👤 Admin user found:');

    console.log(`   Role: ${user.role}`);      console.log("Is Admin flag:", data.isAdmin);

    console.log(`   Active: ${user.is_active}`);

    console.log(`   Email Verified: ${user.email_verified}`);    connection = await mysql.createConnection({



    // Test password validation      host: process.env.DB_HOST || 'localhost',      if (data.isAdmin) {

    const testPassword = 'admin123';

    const isValidPassword = await bcrypt.compare(testPassword, user.password);      port: process.env.DB_PORT || 3306,        console.log("✅ Admin flag is correctly set to true");

    console.log('🔑 Password validation:', isValidPassword ? '✅' : '❌');

      user: process.env.DB_USER || 'root',      } else {

    if (!isValidPassword) {

      console.log('❌ Password validation failed');      password: process.env.DB_PASSWORD || '',        console.log("❌ Admin flag is missing or false");

      return;

    }      database: dbName,      }



    console.log('✅ Admin login should work properly!');    });    } else {

    

  } catch (error) {      console.log("❌ Login failed:", data.error);

    console.error('❌ Debug error:', error.message);

  } finally {    console.log('🔐 ADMIN LOGIN DEBUG');    }

    if (connection) {

      await connection.end();    console.log('==================');  } catch (error) {

    }

  }    console.log();    console.error("Error testing admin login:", error.message);

}

  }

debugAdminLogin();
    // Test admin user lookup};

    const [users] = await connection.execute(

      'SELECT id, email, password, first_name, last_name, role, is_active, email_verified FROM users WHERE email = ?',testAdminLogin();

      ['admin@aynbeauty.com']
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    const user = users[0];
    console.log('👤 Admin user found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.is_active}`);
    console.log(`   Email Verified: ${user.email_verified}`);
    console.log();

    // Test password validation
    const testPassword = 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    console.log('🔑 Password validation:');
    console.log(`   Test password: ${testPassword}`);
    console.log(`   Valid: ${isValidPassword ? '✅' : '❌'}`);
    console.log();

    if (!isValidPassword) {
      console.log('❌ Password validation failed');
      return;
    }

    // Test JWT generation
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎫 JWT Token generated:');
    console.log(`   Token: ${token.substring(0, 50)}...`);
    console.log(`   Secret: ${JWT_SECRET}`);
    console.log();

    // Test token verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ JWT verification successful:');
      console.log(`   User ID: ${decoded.userId}`);
      console.log(`   Email: ${decoded.email}`);
      console.log(`   Role: ${decoded.role}`);
      console.log();
    } catch (error) {
      console.log('❌ JWT verification failed:', error.message);
      return;
    }

    // Simulate login response
    const { password: _, ...userWithoutPassword } = user;
    const loginResponse = {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      isAdmin: user.role === 'admin'
    };

    console.log('📋 Expected login response:');
    console.log('   success:', loginResponse.success);
    console.log('   isAdmin:', loginResponse.isAdmin);
    console.log('   user.role:', loginResponse.user.role);
    console.log();

    console.log('✅ Admin login should work properly!');
    console.log();
    console.log('🎯 Next steps:');
    console.log('   1. Try logging in with admin@aynbeauty.com / admin123');
    console.log('   2. Check browser console for any JavaScript errors');
    console.log('   3. Check localStorage after login for token and user data');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugAdminLogin();