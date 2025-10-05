require("dotenv").config({ path: ".env.local" });

// Simple test to check what might be wrong with the API
console.log("🔍 API DEBUGGING CHECKLIST");
console.log("=========================\n");

// Check environment variables
console.log("1. Environment Variables:");
console.log(`   DB_HOST: ${process.env.DB_HOST || "Not set"}`);
console.log(`   DB_USER: ${process.env.DB_USER || "Not set"}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || "Not set"}`);
console.log(
  `   JWT_SECRET: ${process.env.JWT_SECRET ? "Set" : "NOT SET - CRITICAL!"}`
);

console.log("\n2. Common 400 Error Causes:");
console.log("   ❌ Missing JWT_SECRET in .env file");
console.log("   ❌ Frontend not sending Authorization header");
console.log(
  "   ❌ Missing required fields (name, description, price, category)"
);
console.log("   ❌ Category name mismatch (case sensitive)");
console.log("   ❌ Invalid JSON in request body");

console.log("\n3. Valid Categories Available:");
console.log("   - Skincare");
console.log("   - Makeup");
console.log("   - Haircare");
console.log("   - Fragrance");
console.log("   - Tools & Accessories");
console.log("   - Body Care");
console.log("   - Nail Care");

console.log("\n4. Example Valid POST Request:");
console.log(`
curl -X POST http://66.116.199.206:3000/api/admin/inventory \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "name": "Test Product",
    "description": "Test description", 
    "price": 29.99,
    "category": "Skincare",
    "stock_quantity": 10
  }'
`);

console.log("\n5. Next Steps:");
console.log("   1. Check if JWT_SECRET is set in .env.local");
console.log("   2. Verify frontend sends proper Authorization header");
console.log("   3. Check browser Network tab for actual request payload");
console.log("   4. Ensure category name exactly matches database values");

if (!process.env.JWT_SECRET) {
  console.log("\n🚨 CRITICAL: JWT_SECRET is not set!");
  console.log("   Add this to your .env.local file:");
  console.log("   JWT_SECRET=your-super-secret-key-here");
}
