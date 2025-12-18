#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("\n=== Post-Build: Copy Static Assets for Standalone ===\n");

const rootDir = path.join(__dirname, "..");
const standaloneDir = path.join(rootDir, ".next", "standalone");
const staticDir = path.join(rootDir, ".next", "static");
const publicDir = path.join(rootDir, "public");

try {
  // Check if standalone build exists
  if (!fs.existsSync(standaloneDir)) {
    console.error("✗ .next/standalone not found!");
    console.error("Run 'npm run build' first");
    process.exit(1);
  }

  // Copy .next/static to .next/standalone/.next/static
  console.log("1. Copying static files to standalone...");
  const standaloneStaticDest = path.join(standaloneDir, ".next", "static");

  if (!fs.existsSync(staticDir)) {
    console.error("✗ .next/static not found!");
    process.exit(1);
  }

  // Create directory if it doesn't exist
  fs.mkdirSync(path.dirname(standaloneStaticDest), { recursive: true });

  // Copy directory
  if (process.platform === "win32") {
    // Windows
    execSync(`xcopy /E /I /Y "${staticDir}" "${standaloneStaticDest}"`, {
      stdio: "inherit",
    });
  } else {
    // Unix/Linux
    execSync(`cp -r "${staticDir}" "${standaloneStaticDest}"`, {
      stdio: "inherit",
    });
  }
  console.log("✓ Static files copied\n");

  // Copy public to .next/standalone/public
  console.log("2. Copying public directory to standalone...");
  const standalonePublicDest = path.join(standaloneDir, "public");

  if (fs.existsSync(publicDir)) {
    if (process.platform === "win32") {
      // Windows
      execSync(`xcopy /E /I /Y "${publicDir}" "${standalonePublicDest}"`, {
        stdio: "inherit",
      });
    } else {
      // Unix/Linux
      execSync(`cp -r "${publicDir}" "${standalonePublicDest}"`, {
        stdio: "inherit",
      });
    }
    console.log("✓ Public files copied\n");
  } else {
    console.log("⚠ No public directory found (this might be OK)\n");
  }

  // Verify standalone structure
  console.log("3. Verifying standalone structure...");
  const criticalPaths = [
    path.join(standaloneDir, "server.js"),
    path.join(standaloneDir, ".next", "static"),
    path.join(standaloneDir, "public"),
  ];

  let allPresent = true;
  for (const checkPath of criticalPaths) {
    const relativePath = path.relative(rootDir, checkPath);
    if (fs.existsSync(checkPath)) {
      console.log(`✓ ${relativePath}`);
    } else {
      console.error(`✗ ${relativePath} MISSING!`);
      allPresent = false;
    }
  }

  console.log("");
  if (allPresent) {
    console.log("✓ All critical files present");
    console.log("\nStandalone build is ready!");
    console.log("Start with: pm2 start ecosystem.config.js\n");
  } else {
    console.error("✗ Some files are missing!");
    process.exit(1);
  }
} catch (error) {
  console.error("✗ Error during post-build:", error.message);
  process.exit(1);
}
