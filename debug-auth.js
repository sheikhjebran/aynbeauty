// Debug authentication tokens
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local" });

async function debugAuth() {
  console.log("=== AUTHENTICATION DEBUG ===");

  // Check environment variables
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
  console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length || 0);

  // Test token generation
  const testPayload = { id: 1, email: "test@example.com" };
  try {
    const testToken = jwt.sign(testPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log("✓ Token generation works");

    // Test token verification
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    console.log("✓ Token verification works");
    console.log("Decoded payload:", decoded);
  } catch (error) {
    console.log("✗ Token test failed:", error.message);
  }
}

debugAuth().catch(console.error);
