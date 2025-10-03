const fs = require("fs");
const path = require("path");

// Simple function to create a data URL for a basic placeholder
function createPlaceholderDataURL() {
  // This is a simple 1x1 pixel transparent PNG as base64
  const transparentPixel =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  // Better placeholder - a simple colored rectangle with text
  const svgPlaceholder = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f8f9fa"/>
    <rect x="50" y="50" width="300" height="300" fill="#e9ecef" stroke="#dee2e6" stroke-width="2" rx="8"/>
    <text x="200" y="180" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="24" font-weight="bold">AYN Beauty</text>
    <text x="200" y="210" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">Product Image</text>
    <circle cx="200" cy="120" r="25" fill="#f472b6" opacity="0.3"/>
    <circle cx="160" cy="100" r="15" fill="#a78bfa" opacity="0.4"/>
    <circle cx="240" cy="100" r="15" fill="#34d399" opacity="0.4"/>
    <text x="200" y="280" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="12">400 x 400</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svgPlaceholder).toString(
    "base64"
  )}`;
}

// Create a simple HTML file that can generate the image
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Generate Placeholder</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
    <h2>Placeholder Image Generator for AYN Beauty</h2>
    <div style="margin: 20px 0;">
        <button onclick="downloadPlaceholder('placeholder-product.jpg')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
            Download Product Placeholder
        </button>
        <button onclick="downloadPlaceholder('placeholder-campaign.jpg')" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
            Download Campaign Placeholder
        </button>
    </div>
    
    <canvas id="canvas" width="400" height="400" style="border: 1px solid #ddd; display: block; margin: 20px 0;"></canvas>
    
    <script>
        function createPlaceholder(type = 'product') {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, 400, 400);
            
            // Background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, 400, 400);
            
            // Border
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, 398, 398);
            
            // Inner area
            ctx.fillStyle = '#e9ecef';
            ctx.fillRect(50, 50, 300, 300);
            ctx.strokeStyle = '#dee2e6';
            ctx.strokeRect(50, 50, 300, 300);
            
            // Decorative circles
            ctx.fillStyle = '#f472b6';
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(200, 120, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#a78bfa';
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(160, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#34d399';
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(240, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Text
            ctx.globalAlpha = 1;
            ctx.textAlign = 'center';
            
            // Brand name
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#6c757d';
            ctx.fillText('AYN Beauty', 200, 180);
            
            // Type
            ctx.font = '16px Arial';
            ctx.fillStyle = '#9ca3af';
            const typeText = type === 'product' ? 'Product Image' : 'Campaign Image';
            ctx.fillText(typeText, 200, 210);
            
            // Dimensions
            ctx.font = '12px Arial';
            ctx.fillStyle = '#d1d5db';
            ctx.fillText('400 x 400', 200, 280);
            
            return canvas;
        }
        
        function downloadPlaceholder(filename) {
            const type = filename.includes('product') ? 'product' : 'campaign';
            const canvas = createPlaceholder(type);
            
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.9);
        }
        
        // Create initial preview
        createPlaceholder('product');
    </script>
</body>
</html>`;

// Write the HTML file
fs.writeFileSync(
  path.join(__dirname, "placeholder-generator.html"),
  htmlContent
);

console.log("✅ Placeholder generator created!");
console.log(
  "📂 Open placeholder-generator.html in your browser to download placeholder images"
);
console.log("📍 Save the downloaded images to your public directory");

// Also create a simple text file with instructions
const instructions = `
# How to Fix Missing Placeholder Images

## Quick Solution:
1. Open the file: placeholder-generator.html (in this same directory)
2. Click "Download Product Placeholder" button
3. Save the downloaded file as "placeholder-product.jpg" in the public/ directory
4. Click "Download Campaign Placeholder" button  
5. Save as "placeholder-campaign.jpg" in the public/ directory

## Alternative Solutions:

### Option 1: Use any 400x400 image
- Find any beauty product image online
- Resize it to 400x400 pixels
- Save as placeholder-product.jpg in public/ directory

### Option 2: Create a simple placeholder
- Use any image editor (Paint, Photoshop, GIMP)
- Create a 400x400 image with text "AYN Beauty - Product Image"
- Save as placeholder-product.jpg in public/ directory

### Option 3: Use online placeholder generators
- Visit: https://via.placeholder.com/400x400/f8f9fa/6c757d?text=AYN+Beauty
- Save the image as placeholder-product.jpg in public/ directory

## File Structure:
Your public directory should look like:
public/
├── placeholder-product.jpg       ← Main placeholder for products
├── placeholder-campaign.jpg      ← Placeholder for campaigns  
├── images/
│   ├── products/                 ← Future product images
│   ├── categories/               ← Category images
│   ├── brands/                   ← Brand logos
│   ├── banners/                  ← Banner images
│   └── campaigns/                ← Campaign images
└── other files...

Once you add placeholder-product.jpg to the public/ directory, 
the 404 errors will disappear!
`;

fs.writeFileSync(
  path.join(__dirname, "PLACEHOLDER_INSTRUCTIONS.txt"),
  instructions
);

console.log("📝 Instructions saved to PLACEHOLDER_INSTRUCTIONS.txt");
