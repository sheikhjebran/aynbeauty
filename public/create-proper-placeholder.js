const fs = require("fs");

// Create a simple HTML file that can be used to generate a proper image
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AYN Beauty Placeholder Generator</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .preview {
            width: 400px;
            height: 400px;
            margin: 20px auto;
            border: 2px solid #ddd;
            border-radius: 8px;
        }
        .buttons {
            text-align: center;
            margin: 20px 0;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            margin: 0 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #0056b3;
        }
        .product-btn {
            background: #28a745;
        }
        .product-btn:hover {
            background: #1e7e34;
        }
        .instructions {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 AYN Beauty Placeholder Generator</h1>
        <p>Generate professional placeholder images for your beauty e-commerce platform.</p>
        
        <div class="buttons">
            <button onclick="generateImage('product')" class="product-btn">Generate Product Placeholder</button>
            <button onclick="generateImage('campaign')">Generate Campaign Placeholder</button>
        </div>
        
        <canvas id="canvas" class="preview" width="400" height="400"></canvas>
        
        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <ol>
                <li>Click "Generate Product Placeholder" to create the main placeholder</li>
                <li>Right-click the generated image and save as <code>placeholder-product.jpg</code></li>
                <li>Place the file in your <code>public/</code> directory</li>
                <li>Restart your Next.js development server</li>
            </ol>
            <p><strong>Note:</strong> This will create a proper JPEG image that Next.js can handle without SVG issues.</p>
        </div>
    </div>

    <script>
        function generateImage(type = 'product') {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, 400, 400);
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 400, 400);
            gradient.addColorStop(0, '#f8f9fa');
            gradient.addColorStop(1, '#e9ecef');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 400);
            
            // Border
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, 0, 400, 400);
            
            // Inner frame
            ctx.strokeStyle = '#ced4da';
            ctx.lineWidth = 2;
            ctx.strokeRect(30, 30, 340, 340);
            
            // Beauty product illustrations
            ctx.fillStyle = '#f472b6';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(120, 80, 40, 100);
            ctx.beginPath();
            ctx.arc(140, 70, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#a78bfa';
            ctx.beginPath();
            ctx.arc(180, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(220, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#34d399';
            ctx.fillRect(240, 80, 30, 80);
            
            // Reset alpha
            ctx.globalAlpha = 1;
            
            // Text content
            ctx.textAlign = 'center';
            ctx.fillStyle = '#495057';
            
            // Main brand text
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.fillText('AYN', 200, 220);
            
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.fillText('Beauty', 200, 260);
            
            // Subtitle
            ctx.font = '18px Arial, sans-serif';
            ctx.fillStyle = '#6c757d';
            const subtitle = type === 'product' ? 'Product Image' : 'Campaign Banner';
            ctx.fillText(subtitle, 200, 290);
            
            // Dimensions
            ctx.font = '14px Arial, sans-serif';
            ctx.fillStyle = '#adb5bd';
            ctx.fillText('400 × 400 pixels', 200, 320);
            
            // Decorative elements
            ctx.fillStyle = '#ffc107';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(80, 350, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fd7e14';
            ctx.beginPath();
            ctx.arc(320, 350, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            
            // Download functionality
            setTimeout(() => {
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = type === 'product' ? 'placeholder-product.jpg' : 'placeholder-campaign.jpg';
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/jpeg', 0.95);
            }, 100);
        }
        
        // Generate initial preview
        window.onload = function() {
            generateImage('product');
        };
    </script>
</body>
</html>`;

fs.writeFileSync("proper-placeholder-generator.html", htmlContent);

console.log("✅ Created proper-placeholder-generator.html");
console.log(
  "📂 Open this file in your browser to generate proper JPEG placeholders"
);
console.log("💡 This will fix the SVG/JPEG type mismatch issue");

// Also create a quick fix instruction
const quickFix = `
# Quick Fix for SVG/JPEG Issue

## Problem:
Next.js detected that placeholder-product.jpg is actually SVG content and blocked it.

## Solutions:

### Option 1: Generate Proper JPEG (Recommended)
1. Open 'proper-placeholder-generator.html' in your browser
2. Click "Generate Product Placeholder" 
3. The file will auto-download as 'placeholder-product.jpg'
4. Replace the current placeholder-product.jpg with this new file
5. Restart your Next.js server

### Option 2: Use Different File Extension
1. Rename placeholder-product.jpg to placeholder-product.svg
2. Update your code to use .svg extension instead of .jpg
3. Keep the Next.js config with dangerouslyAllowSVG: true

### Option 3: Download Real Images
1. Visit: https://via.placeholder.com/400x400/f8f9fa/6c757d.jpg?text=AYN+Beauty
2. Save as placeholder-product.jpg
3. Replace the current file

The generated JPEG will be a proper raster image that Next.js can handle without issues.
`;

fs.writeFileSync("FIX_SVG_ISSUE.txt", quickFix);
console.log("📝 Created FIX_SVG_ISSUE.txt with detailed instructions");
