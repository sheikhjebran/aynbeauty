-- Migration: Insert sample data
-- Created: 2024-10-01T00:00:02.000Z
-- Description: Insert initial sample data for testing

-- Insert Categories
INSERT IGNORE INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Makeup', 'makeup', 'Complete makeup collection for all occasions', '/images/categories/makeup.jpg'),
(2, 'Skincare', 'skincare', 'Skincare products for healthy, glowing skin', '/images/categories/skincare.jpg'),
(3, 'Fragrance', 'fragrance', 'Luxurious fragrances for every mood', '/images/categories/fragrance.jpg'),
(4, 'Hair Care', 'hair-care', 'Professional hair care products', '/images/categories/haircare.jpg'),
(5, 'Face', 'face', 'Face makeup products', '/images/categories/face.jpg'),
(6, 'Eyes', 'eyes', 'Eye makeup products', '/images/categories/eyes.jpg'),
(7, 'Lips', 'lips', 'Lip makeup products', '/images/categories/lips.jpg');

-- Update categories with parent relationships
UPDATE categories SET parent_id = 1 WHERE id IN (5, 6, 7);

-- Insert Brands
INSERT IGNORE INTO brands (id, name, slug, description, logo_url) VALUES
(1, 'Maybelline', 'maybelline', 'Global makeup brand with innovative products', '/images/brands/maybelline.jpg'),
(2, 'L\'Oreal', 'loreal', 'Leading beauty brand with premium products', '/images/brands/loreal.jpg'),
(3, 'Lakme', 'lakme', 'India\'s premier beauty brand', '/images/brands/lakme.jpg'),
(4, 'MAC', 'mac', 'Professional makeup artistry brand', '/images/brands/mac.jpg'),
(5, 'Nykaa', 'nykaa', 'India\'s own beauty brand', '/images/brands/nykaa.jpg'),
(6, 'The Ordinary', 'the-ordinary', 'Simple, effective skincare', '/images/brands/ordinary.jpg');

-- Insert Sample Products
INSERT IGNORE INTO products (id, name, slug, description, short_description, sku, price, discounted_price, category_id, brand_id, stock_quantity, is_featured) VALUES
(1, 'Fit Me Foundation', 'fit-me-foundation', 'Perfect match foundation for all skin tones with buildable coverage', 'Perfect match foundation for all skin tones', 'MAY-FIT-001', 799.00, 679.00, 5, 1, 50, TRUE),
(2, 'Super Stay Lipstick', 'super-stay-lipstick', 'Long-lasting liquid lipstick that stays put for up to 16 hours', 'Long-lasting liquid lipstick', 'MAY-LIP-001', 649.00, 549.00, 7, 1, 75, TRUE),
(3, 'Revitalift Serum', 'revitalift-serum', 'Anti-aging serum with vitamin C for youthful skin', 'Anti-aging serum with vitamin C', 'LOR-SER-001', 1299.00, 1099.00, 2, 2, 30, TRUE),
(4, 'Absolute Kajal', 'absolute-kajal', 'Waterproof kajal for bold, dramatic eyes', 'Waterproof kajal for bold eyes', 'LAK-KAJ-001', 350.00, 315.00, 6, 3, 100, FALSE),
(5, 'Studio Fix Foundation', 'studio-fix-foundation', 'Full coverage foundation for flawless skin', 'Full coverage foundation', 'MAC-FOU-001', 2800.00, 2520.00, 5, 4, 25, TRUE),
(6, 'Hyaluronic Acid Serum', 'hyaluronic-acid-serum', 'Hydrating serum for dry and dehydrated skin', 'Hydrating serum for dry skin', 'ORD-HYA-001', 899.00, 719.00, 2, 6, 40, FALSE),
(7, 'Matte Lipstick', 'matte-lipstick', 'Comfortable matte lipstick in vibrant shades', 'Comfortable matte lipstick', 'NYK-MAT-001', 499.00, 399.00, 7, 5, 60, TRUE),
(8, 'Concealer Palette', 'concealer-palette', 'Multi-shade concealer palette for perfect coverage', 'Multi-shade concealer palette', 'LAK-CON-001', 750.00, 675.00, 5, 3, 35, FALSE);

-- Insert Product Images
INSERT IGNORE INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, '/images/products/fit-me-foundation-1.jpg', 'Maybelline Fit Me Foundation', 1, TRUE),
(1, '/images/products/fit-me-foundation-2.jpg', 'Fit Me Foundation Shades', 2, FALSE),
(2, '/images/products/super-stay-lipstick-1.jpg', 'Maybelline Super Stay Lipstick', 1, TRUE),
(2, '/images/products/super-stay-lipstick-2.jpg', 'Super Stay Lipstick Application', 2, FALSE),
(3, '/images/products/revitalift-serum-1.jpg', 'L\'Oreal Revitalift Serum', 1, TRUE),
(4, '/images/products/absolute-kajal-1.jpg', 'Lakme Absolute Kajal', 1, TRUE),
(5, '/images/products/studio-fix-foundation-1.jpg', 'MAC Studio Fix Foundation', 1, TRUE),
(6, '/images/products/hyaluronic-serum-1.jpg', 'The Ordinary Hyaluronic Acid', 1, TRUE),
(7, '/images/products/matte-lipstick-1.jpg', 'Nykaa Matte Lipstick', 1, TRUE),
(8, '/images/products/concealer-palette-1.jpg', 'Lakme Concealer Palette', 1, TRUE);

-- Insert Product Attributes
INSERT IGNORE INTO product_attributes (product_id, attribute_name, attribute_value, sort_order) VALUES
(1, 'Shade Range', '40 shades available', 1),
(1, 'Coverage', 'Medium to Full', 2),
(1, 'Skin Type', 'All skin types', 3),
(1, 'Finish', 'Natural matte', 4),
(2, 'Longevity', 'Up to 16 hours', 1),
(2, 'Finish', 'Matte', 2),
(2, 'Transfer Proof', 'Yes', 3),
(3, 'Key Ingredient', 'Vitamin C', 1),
(3, 'Skin Concern', 'Anti-aging', 2),
(3, 'Application', 'Day and Night', 3),
(4, 'Waterproof', 'Yes', 1),
(4, 'Smudge Proof', 'Yes', 2),
(5, 'Coverage', 'Full', 1),
(5, 'Finish', 'Matte', 2),
(6, 'Key Ingredient', 'Hyaluronic Acid', 1),
(6, 'Skin Type', 'Dry to Very Dry', 2);

-- Insert Content Blocks
INSERT IGNORE INTO content_blocks (title, content, page_location, display_order, image_url, link_url, link_text) VALUES
('Welcome to AYN Beauty', 'Discover premium beauty products from top brands. Transform your beauty routine with our curated collection.', 'homepage_banner', 1, '/images/banners/welcome-banner.jpg', '/products', 'Shop Now'),
('New Arrivals', 'Check out our latest beauty collection featuring the newest products from your favorite brands.', 'homepage_banner', 2, '/images/banners/new-arrivals.jpg', '/products?new=true', 'Explore New'),
('Special Offers', 'Up to 30% off on selected items. Limited time offer on premium beauty products.', 'homepage_banner', 3, '/images/banners/special-offers.jpg', '/offers', 'Shop Offers'),
('Beauty Tips', 'Get expert beauty tips and tutorials from professional makeup artists.', 'homepage_section', 4, '/images/banners/beauty-tips.jpg', '/blog', 'Read More'),
('Virtual Try-On', 'Try products virtually with our AI-powered virtual try-on technology.', 'homepage_feature', 5, '/images/banners/virtual-tryon.jpg', '/virtual-tryon', 'Try Now');

-- Insert Sample Admin User
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, is_verified) VALUES
(1, 'admin@aynbeauty.com', '$2b$10$rQ8K7kZ9X.Y5qV1W3mN2.OhPpUfZdGtEcJwBvHnMxAzVfRtYuI9pG', 'Admin', 'User', 'admin', TRUE);

-- Insert Sample Customer
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, is_verified) VALUES
(2, 'customer@example.com', '$2b$10$rQ8K7kZ9X.Y5qV1W3mN2.OhPpUfZdGtEcJwBvHnMxAzVfRtYuI9pG', 'Jane', 'Doe', 'customer', TRUE);

-- Insert Sample Coupons
INSERT IGNORE INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, is_active, starts_at, expires_at) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 500.00, 100, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('SAVE500', 'Flat 500 Off', 'Get flat ₹500 off on orders above ₹2000', 'fixed', 500.00, 2000.00, 50, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY)),
('BEAUTY20', 'Beauty Special', 'Get 20% off on all makeup products', 'percentage', 20.00, 1000.00, 200, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY));