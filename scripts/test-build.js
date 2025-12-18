#!/usr/bin/env node

/**
 * Test Post-Build Script Locally
 * This validates that the post-build script works correctly before deployment
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("\n=== Testing Post-Build Script ===\n");

const rootDir = process.cwd();
const nextDir = path.join(rootDir, ".next");
const standaloneDir = path.join(nextDir, "standalone");

// Check if .next exists
if (!fs.existsSync(nextDir)) {
  console.error("✗ .next directory not found");
  console.log("\nRun this test after building:");
  console.log("  npm run build");
  process.exit(1);
}

console.log("✓ .next directory exists\n");

// Check standalone mode
if (!fs.existsSync(standaloneDir)) {
  console.error("✗ Standalone mode not enabled");
  console.log("\nMake sure next.config.js has:");
  console.log('  output: "standalone"');
  process.exit(1);
}

console.log("✓ Standalone build exists\n");

// Check for post-build script
const postBuildScript = path.join(rootDir, "scripts", "post-build.js");
if (!fs.existsSync(postBuildScript)) {
  console.error("✗ post-build.js not found");
  process.exit(1);
}

console.log("✓ post-build.js exists\n");

// Check if static files were copied
const checks = [
  {
    name: "server.js",
    path: path.join(standaloneDir, "server.js"),
    critical: true,
  },
  {
    name: "Static files (.next/static)",
    path: path.join(standaloneDir, ".next", "static"),
    critical: true,
    isDir: true,
  },
  {
    name: "Public files",
    path: path.join(standaloneDir, "public"),
    critical: true,
    isDir: true,
  },
  {
    name: "node_modules",
    path: path.join(standaloneDir, "node_modules"),
    critical: false,
    isDir: true,
  },
];

console.log("Checking standalone structure:\n");

let allCriticalPresent = true;

for (const check of checks) {
  const exists = fs.existsSync(check.path);
  const relativePath = path.relative(rootDir, check.path);

  if (exists) {
    if (check.isDir) {
      const files = fs.readdirSync(check.path);
      const fileCount = countFiles(check.path);
      console.log(`✓ ${check.name}: ${fileCount} files`);
    } else {
      const stats = fs.statSync(check.path);
      console.log(`✓ ${check.name}: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  } else {
    if (check.critical) {
      console.error(`✗ ${check.name}: MISSING (CRITICAL)`);
      allCriticalPresent = false;
    } else {
      console.log(`⚠ ${check.name}: Missing (optional)`);
    }
  }
}

console.log("");

// Count files function
function countFiles(dir) {
  let count = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        count += countFiles(filePath);
      } else {
        count++;
      }
    }
  } catch (err) {
    // Ignore errors
  }
  return count;
}

// Check package.json build command
console.log("Checking package.json build command:\n");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, "package.json"), "utf8")
);
const buildCommand = packageJson.scripts?.build;

if (buildCommand) {
  console.log(`Build command: ${buildCommand}`);
  if (buildCommand.includes("post-build")) {
    console.log("✓ Build command includes post-build\n");
  } else {
    console.warn("⚠ Build command does NOT include post-build");
    console.log("Update package.json to:");
    console.log('  "build": "next build && node scripts/post-build.js"\n');
  }
} else {
  console.error("✗ No build command found in package.json\n");
}

// Final verdict
console.log("=== Test Results ===\n");

if (allCriticalPresent) {
  console.log("✅ All critical files present!");
  console.log("✅ Standalone build is ready for deployment\n");
  console.log("Deploy with:");
  console.log("  git add .");
  console.log('  git commit -m "Deploy with static assets fix"');
  console.log("  git push origin main");
  console.log("\nOr run on server:");
  console.log("  sudo bash scripts/deploy-with-static-fix.sh\n");
  process.exit(0);
} else {
  console.error("✗ Some critical files are missing!");
  console.log("\nTry running:");
  console.log("  npm run build\n");
  process.exit(1);
}
