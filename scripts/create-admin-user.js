const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

async function createAdminUser() {
  console.log("👤 CREATING ADMIN USER FOR PRODUCTION");
  console.log("====================================\n");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
    });
    console.log("✅ Connected to database");

    // Hash the admin password
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Generated password hash");

    // Insert admin user
    const adminData = {
      first_name: "Admin",
      last_name: "User",
      email: "admin@aynbeauty.com",
      password: hashedPassword,
      phone: "+1234567890",
      role: "admin",
      is_active: 1,
      email_verified: 1,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const insertQuery = `
      INSERT INTO users (
        first_name, last_name, email, password, phone, role, 
        is_active, email_verified, email_verified_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      adminData.first_name,
      adminData.last_name,
      adminData.email,
      adminData.password,
      adminData.phone,
      adminData.role,
      adminData.is_active,
      adminData.email_verified,
      adminData.email_verified_at,
      adminData.created_at,
      adminData.updated_at,
    ];

    await connection.execute(insertQuery, values);
    console.log("✅ Admin user created");

    // Verify the user was created
    const [users] = await connection.execute(
      "SELECT id, email, role, is_active, email_verified FROM users WHERE email = ?",
      [adminData.email]
    );

    if (users.length > 0) {
      const user = users[0];
      console.log("\n👤 Admin User Created:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.is_active ? "Yes" : "No"}`);
      console.log(`   Email Verified: ${user.email_verified ? "Yes" : "No"}`);

      // Test password
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      console.log(
        `   Password Test: ${isPasswordValid ? "✅ Valid" : "❌ Invalid"}`
      );
    }

    // Insert some basic categories
    console.log("\n📂 Creating basic categories...");
    const categories = [
      { name: "Skincare", slug: "skincare", description: "Skincare products" },
      { name: "Makeup", slug: "makeup", description: "Makeup products" },
      { name: "Haircare", slug: "haircare", description: "Haircare products" },
      {
        name: "Fragrance",
        slug: "fragrance",
        description: "Fragrance products",
      },
      {
        name: "Body Care",
        slug: "body-care",
        description: "Body care products",
      },
    ];

    for (const category of categories) {
      await connection.execute(
        "INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
        [category.name, category.slug, category.description]
      );
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Insert some basic brands
    console.log("\n🏷️ Creating basic brands...");
    const brands = [
      {
        name: "AYN Beauty",
        slug: "ayn-beauty",
        description: "Our signature brand",
      },
      {
        name: "Premium Collection",
        slug: "premium-collection",
        description: "Premium products",
      },
      {
        name: "Natural Essentials",
        slug: "natural-essentials",
        description: "Natural products",
      },
    ];

    for (const brand of brands) {
      await connection.execute(
        "INSERT INTO brands (name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
        [brand.name, brand.slug, brand.description]
      );
    }
    console.log(`✅ Created ${brands.length} brands`);

    await connection.end();

    console.log("\n🎉 SUCCESS!");
    console.log("Admin user and basic data created successfully!");
    console.log("\n🔑 Admin Login Credentials:");
    console.log("Email: admin@aynbeauty.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

createAdminUser();
