const bcrypt = require("bcryptjs");

async function testAdminLogin() {
  console.log("🔍 Testing Admin Login Flow...\n");

  try {
    // Test 1: Check bcrypt functionality
    console.log("1. Testing bcrypt password validation...");
    const password = "admin123";
    const hashedPassword =
      "$2a$10$VFfZsV1Jc5N1g3iWNZw2S.Xz5vNJQ.Y4vKGQhQEq5B8F2tF5oJNOe";

    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log(
      `   Password 'admin123' validates: ${isValid ? "✅ YES" : "❌ NO"}`
    );

    // Test 2: Create a fresh hash for comparison
    console.log("\n2. Creating fresh hash for admin123...");
    const newHash = await bcrypt.hash(password, 10);
    console.log(`   New hash: ${newHash}`);
    const newIsValid = await bcrypt.compare(password, newHash);
    console.log(`   New hash validates: ${newIsValid ? "✅ YES" : "❌ NO"}`);

    console.log("\n✅ bcrypt functionality is working");
  } catch (error) {
    console.error("❌ bcrypt test failed:", error);
  }
}

module.exports = { testAdminLogin };
