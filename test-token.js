// Test token decoding
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local" });

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcklkIjo4LCJlbWFpbCI6InNoZWlraGplYnJhbkBnbWFpbC5jb20iLCJpYXQiOjE3NTk1MjIyMDUsImV4cCI6MTc2MDEyNzAwNX0.i7ZQI-bJ4FlfOea0YT_82-nZc7QLfSI6wACa3_CXjWo";

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("✓ Token is valid");
  console.log("Decoded payload:", decoded);
} catch (error) {
  console.log("✗ Token verification failed:", error.message);
}

// Test what the review creation looks like
const reviewData = {
  action: "create_review",
  product_id: 15,
  rating: 5,
  comment: "Great product!",
};

console.log("Review data:", reviewData);
