require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aynbeauty",
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

async function automaticCleanup() {
  console.log("🤖 Automatic Image Cleanup");
  console.log("==========================");
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log("");

  try {
    // Get all images from database
    const productImages = await executeQuery(
      "SELECT image_url FROM product_images WHERE image_url IS NOT NULL"
    );
    const products = await executeQuery(
      "SELECT image_url, primary_image FROM products WHERE image_url IS NOT NULL OR primary_image IS NOT NULL"
    );

    // Collect referenced images
    const referencedImages = new Set();

    productImages.forEach((img) => {
      if (img.image_url) {
        const filename = path.basename(img.image_url);
        referencedImages.add(filename);
      }
    });

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

    // Read files from uploads directory
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );
    let filesOnDisk = [];

    try {
      filesOnDisk = fs.readdirSync(uploadsDir).filter((file) => {
        const filePath = path.join(uploadsDir, file);
        return fs.statSync(filePath).isFile();
      });
    } catch (error) {
      console.log(`❌ Could not read uploads directory: ${error.message}`);
      return;
    }

    // Find unused files older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const unusedFiles = filesOnDisk.filter((file) => {
      if (referencedImages.has(file)) return false;

      try {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return stats.mtime < sevenDaysAgo;
      } catch {
        return false;
      }
    });

    console.log(`📊 Analysis Results:`);
    console.log(`   - Total files on disk: ${filesOnDisk.length}`);
    console.log(`   - Referenced in database: ${referencedImages.size}`);
    console.log(`   - Unused files (>7 days old): ${unusedFiles.length}`);
    console.log("");

    if (unusedFiles.length === 0) {
      console.log("✅ No old unused files found - nothing to clean up!");
      return;
    }

    // Calculate space to be saved
    let totalSize = 0;
    const fileDetails = [];

    for (const file of unusedFiles) {
      try {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        fileDetails.push({
          filename: file,
          size: stats.size,
          lastModified: stats.mtime,
        });
      } catch (error) {
        console.log(`⚠️  Could not get stats for ${file}: ${error.message}`);
      }
    }

    console.log(`🗑️  Files to be cleaned up:`);
    fileDetails.forEach((file) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const daysOld = Math.floor(
        (Date.now() - file.lastModified.getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(`   - ${file.filename} (${sizeMB} MB, ${daysOld} days old)`);
    });

    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`\n💾 Total space to reclaim: ${totalSizeMB} MB`);
    console.log("");

    // Check if this is a dry run
    const isDryRun = process.argv.includes("--dry-run");

    if (isDryRun) {
      console.log("🔍 DRY RUN MODE - No files will be deleted");
      console.log("Run without --dry-run flag to actually delete files");
      return;
    }

    // Delete the files
    let deletedCount = 0;
    let failedCount = 0;
    let spaceSaved = 0;

    console.log("🗑️  Starting file deletion...");

    for (const file of unusedFiles) {
      try {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        fs.unlinkSync(filePath);
        deletedCount++;
        spaceSaved += stats.size;
        console.log(`✅ Deleted: ${file}`);
      } catch (error) {
        failedCount++;
        console.log(`❌ Failed to delete ${file}: ${error.message}`);
      }
    }

    const spaceSavedMB = (spaceSaved / (1024 * 1024)).toFixed(2);
    console.log("");
    console.log("📈 Cleanup Summary:");
    console.log(`   - Files deleted: ${deletedCount}`);
    console.log(`   - Files failed: ${failedCount}`);
    console.log(`   - Space saved: ${spaceSavedMB} MB`);
    console.log(`   - Completed at: ${new Date().toISOString()}`);

    // Log to cleanup history
    try {
      await executeQuery(
        `INSERT INTO cleanup_history (files_deleted, files_failed, space_saved, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [deletedCount, failedCount, spaceSaved]
      );
      console.log("✅ Cleanup logged to database");
    } catch (error) {
      console.log("⚠️  Could not log to database:", error.message);
    }
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await pool.end();
  }
}

// Run the cleanup
automaticCleanup();
