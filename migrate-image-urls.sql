-- Update existing image URLs to use API route for better cache control
-- Run this to update existing products to use the new image serving API

-- Update products table
UPDATE products 
SET image_url = REPLACE(image_url, '/uploads/', '/api/images/')
WHERE image_url LIKE '/uploads/%';

UPDATE products 
SET primary_image = REPLACE(primary_image, '/uploads/', '/api/images/')
WHERE primary_image LIKE '/uploads/%';

-- Update product_images table
UPDATE product_images 
SET image_url = REPLACE(image_url, '/uploads/', '/api/images/')
WHERE image_url LIKE '/uploads/%';

-- Show updated records
SELECT 'Updated products' as table_name, COUNT(*) as count FROM products WHERE image_url LIKE '/api/images/%'
UNION ALL
SELECT 'Updated product_images' as table_name, COUNT(*) as count FROM product_images WHERE image_url LIKE '/api/images/%';