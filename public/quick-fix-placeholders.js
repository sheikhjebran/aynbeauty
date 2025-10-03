// Quick fix: Create a minimal 1x1 PNG as placeholder
// This will prevent 404 errors while you generate proper images

const fs = require("fs");

// Minimal 1x1 transparent PNG (43 bytes)
const transparentPNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

// Minimal 1x1 gray PNG (67 bytes) - better for visibility
const grayPNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2M4c+YMIwAAVwCp8x6GQwAAAABJRU5ErkJggg==",
  "base64"
);

// Write minimal placeholder files
fs.writeFileSync("placeholder-product.png", grayPNG);
fs.writeFileSync("placeholder-campaign.png", grayPNG);

console.log("✅ Created minimal PNG placeholders");
console.log("📝 These are 1x1 pixel images to prevent 404 errors");
console.log(
  "🎨 To create proper placeholders, open: create-proper-placeholder.html"
);

// Also create proper placeholders using canvas
const path = require("path");

// Create HTML file for generating proper images
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AYN Beauty - Generate Placeholder Images</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f8f9fa; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #495057; 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .preview { 
            text-align: center; 
            margin: 30px 0; 
        }
        canvas { 
            border: 2px solid #dee2e6; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .buttons { 
            text-align: center; 
            margin: 30px 0; 
        }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 15px 30px; 
            margin: 10px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 16px; 
            font-weight: 500;
            transition: background 0.2s; 
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
        .campaign-btn { 
            background: #dc3545; 
        }
        .campaign-btn:hover { 
            background: #c82333; 
        }
        .instructions { 
            background: #e3f2fd; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .steps { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .steps ol { 
            margin: 10px 0; 
        }
        .steps li { 
            margin: 8px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 AYN Beauty Placeholder Generator</h1>
        
        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <p>Click the buttons below to generate and download proper placeholder images for your AYN Beauty store.</p>
        </div>
        
        <div class="preview">
            <canvas id="canvas" width="400" height="400"></canvas>
        </div>
        
        <div class="buttons">
            <button class="product-btn" onclick="generateAndDownload('product')">
                📦 Download Product Placeholder (JPG)
            </button>
            <button class="campaign-btn" onclick="generateAndDownload('campaign')">
                🎯 Download Campaign Placeholder (JPG)
            </button>
            <button onclick="generateAndDownload('brand')">
                🏷️ Download Brand Placeholder (JPG)
            </button>
        </div>
        
        <div class="steps">
            <h3>📂 Next Steps:</h3>
            <ol>
                <li>Click the buttons above to download placeholder images</li>
                <li>Save <strong>placeholder-product.jpg</strong> to your <code>public/</code> folder</li>
                <li>Save <strong>placeholder-campaign.jpg</strong> to your <code>public/</code> folder</li>
                <li>Restart your Next.js development server</li>
                <li>No more 404 errors! 🎉</li>
            </ol>
        </div>
    </div>

    <script>
        function createPlaceholder(type) {
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
            ctx.strokeRect(2, 2, 396, 396);
            
            // Inner border
            ctx.strokeStyle = '#ced4da';
            ctx.lineWidth = 1;
            ctx.strokeRect(20, 20, 360, 360);
            
            // Decorative elements based on type
            ctx.globalAlpha = 0.15;
            
            if (type === 'product') {
                // Beauty product shapes
                ctx.fillStyle = '#f472b6';
                ctx.fillRect(120, 80, 40, 100);
                ctx.beginPath();
                ctx.arc(140, 70, 20, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#a78bfa';
                ctx.beginPath();
                ctx.arc(220, 100, 25, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#ec4899';
                ctx.fillRect(240, 80, 30, 80);
            } else if (type === 'campaign') {
                // Campaign/banner shapes
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(80, 90, 240, 20);
                ctx.fillRect(80, 120, 240, 20);
                ctx.fillRect(80, 150, 240, 20);
                
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(100, 100, 30, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(300, 140, 25, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Brand/generic shapes
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(150, 80, 100, 100);
                
                ctx.fillStyle = '#1d4ed8';
                ctx.beginPath();
                ctx.arc(200, 130, 40, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Reset alpha
            ctx.globalAlpha = 1;
            
            // Text
            ctx.textAlign = 'center';
            ctx.fillStyle = '#495057';
            
            // Main brand text
            ctx.font = 'bold 42px Arial, sans-serif';
            ctx.fillText('AYN', 200, 230);
            
            ctx.font = 'bold 42px Arial, sans-serif';
            ctx.fillText('Beauty', 200, 280);
            
            // Subtitle based on type
            ctx.font = '18px Arial, sans-serif';
            ctx.fillStyle = '#6c757d';
            let subtitle = '';
            switch(type) {
                case 'product': subtitle = 'Product Image'; break;
                case 'campaign': subtitle = 'Campaign Banner'; break;
                case 'brand': subtitle = 'Brand Image'; break;
                default: subtitle = 'Placeholder Image';
            }
            ctx.fillText(subtitle, 200, 310);
            
            // Dimensions
            ctx.font = '12px Arial, sans-serif';
            ctx.fillStyle = '#adb5bd';
            ctx.fillText('400 × 400 pixels', 200, 340);
            
            return canvas;
        }
        
        function generateAndDownload(type) {
            const canvas = createPlaceholder(type);
            
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`placeholder-\${type}.jpg\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Show success message
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Downloaded!';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            }, 'image/jpeg', 0.9);
        }
        
        // Create initial preview
        createPlaceholder('product');
    </script>
</body>
</html>`;

fs.writeFileSync("placeholder-generator-final.html", htmlContent);
console.log("🌟 Created placeholder-generator-final.html");
console.log("🌐 Open this file in your browser to generate proper JPG images");
