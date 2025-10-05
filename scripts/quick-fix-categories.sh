#!/bin/bash
# Quick fix for inventory API - check and add categories

echo "🔍 Checking categories..."
mysql -h localhost -u root -p"$DB_PASSWORD" aynbeauty -e "SELECT COUNT(*) as category_count FROM categories;"

echo "📝 Adding sample categories if none exist..."
mysql -h localhost -u root -p"$DB_PASSWORD" aynbeauty <<EOF
INSERT IGNORE INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES 
('Skincare', 'skincare', 'Skincare products for all skin types', 1, NOW(), NOW()),
('Makeup', 'makeup', 'Makeup and cosmetic products', 1, NOW(), NOW()),
('Haircare', 'haircare', 'Hair care and styling products', 1, NOW(), NOW()),
('Fragrance', 'fragrance', 'Perfumes and fragrances', 1, NOW(), NOW()),
('Tools & Accessories', 'tools-accessories', 'Beauty tools and accessories', 1, NOW(), NOW()),
('Body Care', 'body-care', 'Body lotions, scrubs and care products', 1, NOW(), NOW()),
('Nail Care', 'nail-care', 'Nail polish and nail care products', 1, NOW(), NOW());
EOF

echo "✅ Categories added. Checking final count..."
mysql -h localhost -u root -p"$DB_PASSWORD" aynbeauty -e "SELECT name FROM categories ORDER BY name;"

echo "🎉 Done! Try your inventory API now."