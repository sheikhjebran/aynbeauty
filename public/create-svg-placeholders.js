// Simple placeholder image as base64 data URL
// This is a minimal PNG image with AYN Beauty branding

const createSimplePlaceholder = () => {
  // Create a simple SVG and convert to data URL
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8f9fa"/>
          <stop offset="100%" style="stop-color:#e9ecef"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <rect x="40" y="40" width="320" height="320" fill="none" stroke="#dee2e6" stroke-width="2" rx="12"/>
      
      <!-- Beauty product icons -->
      <circle cx="150" cy="120" r="20" fill="#f472b6" opacity="0.3"/>
      <circle cx="250" cy="120" r="20" fill="#a78bfa" opacity="0.3"/>
      <rect x="180" y="140" width="40" height="60" rx="20" fill="#ec4899" opacity="0.3"/>
      
      <!-- Text -->
      <text x="200" y="220" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="28" font-weight="bold">AYN</text>
      <text x="200" y="250" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="28" font-weight="bold">Beauty</text>
      <text x="200" y="280" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">Product Image</text>
      <text x="200" y="320" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="12">400 × 400</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

console.log("SVG Data URL:");
console.log(createSimplePlaceholder());

// Also create physical files
const fs = require("fs");

// Create the SVG file
const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f9fa"/>
      <stop offset="100%" style="stop-color:#e9ecef"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect x="40" y="40" width="320" height="320" fill="none" stroke="#dee2e6" stroke-width="2" rx="12"/>
  
  <!-- Beauty product icons -->
  <circle cx="150" cy="120" r="20" fill="#f472b6" opacity="0.3"/>
  <circle cx="250" cy="120" r="20" fill="#a78bfa" opacity="0.3"/>
  <rect x="180" y="140" width="40" height="60" rx="20" fill="#ec4899" opacity="0.3"/>
  
  <!-- Text -->
  <text x="200" y="220" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="28" font-weight="bold">AYN</text>
  <text x="200" y="250" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="28" font-weight="bold">Beauty</text>
  <text x="200" y="280" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">Product Image</text>
  <text x="200" y="320" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="12">400 × 400</text>
</svg>`;

fs.writeFileSync("placeholder-product.svg", svgContent);

// Create campaign placeholder
const campaignSvg = svgContent.replace("Product Image", "Campaign Banner");
fs.writeFileSync("placeholder-campaign.svg", campaignSvg);

console.log("\n✅ Created placeholder-product.svg");
console.log("✅ Created placeholder-campaign.svg");
console.log("\n📝 To fix the 404 errors immediately:");
console.log(
  "1. Rename placeholder-product.svg to placeholder-product.jpg (browsers will accept SVG with .jpg extension)"
);
console.log("2. Or convert the SVG files to JPG using any online converter");
console.log(
  "3. Or open placeholder-generator.html in your browser to download proper JPG files"
);

module.exports = { createSimplePlaceholder };
