#!/usr/bin/env node

const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function setupDatabase() {
  let connection;

  try {
    console.log("🚀 Starting AYN Beauty database setup...\n");

    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      charset: "utf8mb4",
    });

    console.log("✅ Connected to MySQL server");

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || "aynbeauty";
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${dbName}' created/verified`);

    // Use the database
    await connection.execute(`USE \`${dbName}\``);
    console.log(`✅ Using database '${dbName}'`);

    // Read and execute schema files
    const fs = require("fs");
    const path = require("path");

    // Core schema
    const coreSchemaPath = path.join(__dirname, "../database/schema.sql");
    if (fs.existsSync(coreSchemaPath)) {
      const coreSchema = fs.readFileSync(coreSchemaPath, "utf8");
      const statements = coreSchema.split(";").filter((stmt) => stmt.trim());

      console.log("📊 Creating core tables...");
      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }
      console.log("✅ Core tables created");
    } else {
      console.log("⚠️ Core schema file not found, creating basic tables...");
      await createBasicTables(connection);
    }

    // Advanced features schema
    const advancedSchemaPath = path.join(
      __dirname,
      "../database/advanced_features_schema.sql"
    );
    if (fs.existsSync(advancedSchemaPath)) {
      const advancedSchema = fs.readFileSync(advancedSchemaPath, "utf8");
      const statements = advancedSchema
        .split(";")
        .filter((stmt) => stmt.trim());

      console.log("🤖 Creating advanced AI/ML tables...");
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.execute(statement);
          } catch (error) {
            // Skip duplicate table errors
            if (!error.message.includes("already exists")) {
              console.warn(`Warning: ${error.message}`);
            }
          }
        }
      }
      console.log("✅ Advanced tables created");
    }

    // Insert sample data
    console.log("📝 Inserting sample data...");
    await insertSampleData(connection);

    console.log("\n🎉 Database setup completed successfully!");
    console.log("🌐 Your AYN Beauty website is ready to use!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createBasicTables(connection) {
  const basicTables = `
    -- Categories
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      image_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Brands
    CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      logo_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Products
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      short_description VARCHAR(500),
      sku VARCHAR(100) UNIQUE,
      price DECIMAL(10,2) NOT NULL,
      discounted_price DECIMAL(10,2),
      category_id INT,
      brand_id INT,
      stock_quantity INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
    );

    -- Product Images
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      alt_text VARCHAR(255),
      sort_order INT DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- Users
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(20),
      date_of_birth DATE,
      gender ENUM('male', 'female', 'other'),
      is_active BOOLEAN DEFAULT TRUE,
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Content Blocks
    CREATE TABLE IF NOT EXISTS content_blocks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      page_location VARCHAR(100) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      start_date TIMESTAMP NULL,
      end_date TIMESTAMP NULL,
      link_url VARCHAR(500),
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  const statements = basicTables.split(";").filter((stmt) => stmt.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.execute(statement);
    }
  }
}

async function insertSampleData(connection) {
  // Insert categories
  await connection.execute(`
    INSERT IGNORE INTO categories (name, slug, description) VALUES
    ('Makeup', 'makeup', 'Complete makeup collection for all occasions'),
    ('Skincare', 'skincare', 'Skincare products for healthy, glowing skin'),
    ('Fragrance', 'fragrance', 'Luxurious fragrances for every mood'),
    ('Hair Care', 'hair-care', 'Professional hair care products')
  `);

  // Insert brands
  await connection.execute(`
    INSERT IGNORE INTO brands (name, slug, description) VALUES
    ('Maybelline', 'maybelline', 'Global makeup brand with innovative products'),
    ('L\\'Oreal', 'loreal', 'Leading beauty brand with premium products'),
    ('Lakme', 'lakme', 'India\\'s premier beauty brand'),
    ('MAC', 'mac', 'Professional makeup artistry brand')
  `);

  // Insert sample products
  await connection.execute(`
    INSERT IGNORE INTO products (name, slug, description, price, discounted_price, category_id, brand_id, stock_quantity, is_featured) VALUES
    ('Fit Me Foundation', 'fit-me-foundation', 'Perfect match foundation for all skin tones', 799.00, 679.00, 1, 1, 50, TRUE),
    ('Super Stay Lipstick', 'super-stay-lipstick', 'Long-lasting liquid lipstick', 649.00, 549.00, 1, 1, 75, TRUE),
    ('Revitalift Serum', 'revitalift-serum', 'Anti-aging serum with vitamin C', 1299.00, 1099.00, 2, 2, 30, TRUE),
    ('Absolute Kajal', 'absolute-kajal', 'Waterproof kajal for bold eyes', 350.00, 315.00, 1, 3, 100, FALSE),
    ('Studio Fix Foundation', 'studio-fix-foundation', 'Full coverage foundation', 2800.00, 2520.00, 1, 4, 25, TRUE),
    ('Hyaluronic Acid Serum', 'hyaluronic-acid-serum', 'Hydrating serum for dry skin', 899.00, 719.00, 2, 2, 40, FALSE)
  `);

  // Insert sample content blocks
  await connection.execute(`
    INSERT IGNORE INTO content_blocks (title, content, page_location, display_order, image_url, link_url) VALUES
    ('Welcome to AYN Beauty', 'Discover premium beauty products from top brands', 'homepage_banner', 1, '/images/banner1.jpg', '/products'),
    ('New Arrivals', 'Check out our latest beauty collection', 'homepage_banner', 2, '/images/banner2.jpg', '/products?new=true'),
    ('Special Offers', 'Up to 30% off on selected items', 'homepage_banner', 3, '/images/banner3.jpeg', '/offers')
  `);

  console.log("✅ Sample data inserted");
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
