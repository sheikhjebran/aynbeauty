require("dotenv").config({ path: ".env.local" });

// Import database modules directly since we're using TypeScript
const mysql = require("mysql2/promise");

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aynbeauty",
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Execute query function
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

const fs = require("fs");
const path = require("path");

async function analyzeImageUsage() {
  try {
    console.log("📊 Product Images Analysis");
    console.log("===========================\n");

    // Get all images from product_images table
    const productImages = await executeQuery(
      "SELECT * FROM product_images ORDER BY product_id"
    );
    console.log(
      `Found ${productImages.length} entries in product_images table:`
    );

    if (productImages.length > 0) {
      productImages.slice(0, 5).forEach((img) => {
        console.log(
          `- ID: ${img.id}, Product: ${img.product_id}, URL: ${img.image_url}, Primary: ${img.is_primary}`
        );
      });
      if (productImages.length > 5) {
        console.log(`... and ${productImages.length - 5} more`);
      }
    }
    console.log("");

    // Get all products with their image references
    const products = await executeQuery(
      "SELECT id, name, image_url, primary_image FROM products ORDER BY id"
    );
    console.log(`Found ${products.length} products in database:`);

    if (products.length > 0) {
      products.slice(0, 5).forEach((p) => {
        console.log(
          `- Product ${p.id}: "${p.name}" -> image_url: ${
            p.image_url || "null"
          }, primary_image: ${p.primary_image || "null"}`
        );
      });
      if (products.length > 5) {
        console.log(`... and ${products.length - 5} more`);
      }
    }
    console.log("");

    // Collect all image URLs referenced in database
    const referencedImages = new Set();

    // From product_images table
    productImages.forEach((img) => {
      if (img.image_url) {
        // Extract filename from URL
        const filename = path.basename(img.image_url);
        referencedImages.add(filename);
      }
    });

    // From products table
    products.forEach((p) => {
      if (p.image_url) {
        const filename = path.basename(p.image_url);
        referencedImages.add(filename);
      }
      if (p.primary_image) {
        const filename = path.basename(p.primary_image);
        referencedImages.add(filename);
      }
    });

    console.log(`📋 Referenced images in database: ${referencedImages.size}`);
    Array.from(referencedImages)
      .slice(0, 5)
      .forEach((img) => console.log(`- ${img}`));
    if (referencedImages.size > 5) {
      console.log(`... and ${referencedImages.size - 5} more`);
    }
    console.log("");

    // Read files from uploads directory
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );
    let filesOnDisk = [];

    try {
      filesOnDisk = fs.readdirSync(uploadsDir);
      console.log(`📁 Files in uploads directory: ${filesOnDisk.length}`);
      filesOnDisk.slice(0, 5).forEach((file) => console.log(`- ${file}`));
      if (filesOnDisk.length > 5) {
        console.log(`... and ${filesOnDisk.length - 5} more`);
      }
    } catch (error) {
      console.log(`❌ Could not read uploads directory: ${error.message}`);
      return;
    }
    console.log("");

    // Find unused files
    const unusedFiles = filesOnDisk.filter(
      (file) => !referencedImages.has(file)
    );

    console.log(`🗑️ Unused files found: ${unusedFiles.length}`);
    if (unusedFiles.length > 0) {
      unusedFiles.forEach((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(
          `- ${file} (${sizeMB} MB, modified: ${
            stats.mtime.toISOString().split("T")[0]
          })`
        );
      });

      const totalSize = unusedFiles.reduce((total, file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return total + stats.size;
      }, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`\n💾 Total space used by unused files: ${totalSizeMB} MB`);
    }

    // Find referenced files that don't exist on disk
    const missingFiles = Array.from(referencedImages).filter(
      (img) => !filesOnDisk.includes(img)
    );
    if (missingFiles.length > 0) {
      console.log(
        `\n⚠️ Referenced files missing from disk: ${missingFiles.length}`
      );
      missingFiles.forEach((file) => console.log(`- ${file}`));
    }
  } catch (error) {
    console.error("❌ Analysis failed:", error);
  }
}

analyzeImageUsage();
