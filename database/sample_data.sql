-- Sample Data Insertion for AynBeauty Database
-- Run this after creating the database schema

USE aynbeauty;

-- Insert sample categories
INSERT INTO categories (name, slug, description, image, parent_id, sort_order) VALUES
('Makeup', 'makeup', 'Complete makeup collection for all your beauty needs', '/images/categories/makeup.jpg', NULL, 1),
('Skincare', 'skincare', 'Premium skincare products for healthy glowing skin', '/images/categories/skincare.jpg', NULL, 2),
('Hair Care', 'hair-care', 'Professional hair care solutions', '/images/categories/hair-care.jpg', NULL, 3),
('Fragrance', 'fragrance', 'Luxurious fragrances for every occasion', '/images/categories/fragrance.jpg', NULL, 4),
('Bath & Body', 'bath-body', 'Pampering bath and body essentials', '/images/categories/bath-body.jpg', NULL, 5),
('Tools & Appliances', 'tools-appliances', 'Professional beauty tools and appliances', '/images/categories/tools.jpg', NULL, 6),

-- Makeup subcategories
('Face', 'face', 'Foundation, concealer, powder and more', '/images/categories/face.jpg', 1, 1),
('Eyes', 'eyes', 'Eyeshadow, mascara, eyeliner and more', '/images/categories/eyes.jpg', 1, 2),
('Lips', 'lips', 'Lipstick, lip gloss, lip liner and more', '/images/categories/lips.jpg', 1, 3),
('Cheeks', 'cheeks', 'Blush, bronzer, highlighter', '/images/categories/cheeks.jpg', 1, 4),

-- Skincare subcategories
('Cleansers', 'cleansers', 'Face cleansers and makeup removers', '/images/categories/cleansers.jpg', 2, 1),
('Moisturizers', 'moisturizers', 'Day and night moisturizers', '/images/categories/moisturizers.jpg', 2, 2),
('Serums', 'serums', 'Targeted skincare serums', '/images/categories/serums.jpg', 2, 3),
('Sunscreen', 'sunscreen', 'Sun protection products', '/images/categories/sunscreen.jpg', 2, 4);

-- Insert sample brands
INSERT INTO brands (name, slug, description, logo, banner_image, is_featured) VALUES
('L\'Oreal Paris', 'loreal-paris', 'Because you\'re worth it', '/images/brands/loreal-logo.jpg', '/images/brands/loreal-banner.jpg', TRUE),
('Maybelline New York', 'maybelline-new-york', 'Make it happen', '/images/brands/maybelline-logo.jpg', '/images/brands/maybelline-banner.jpg', TRUE),
('Lakme', 'lakme', 'Express the real you', '/images/brands/lakme-logo.jpg', '/images/brands/lakme-banner.jpg', TRUE),
('FENTY BEAUTY', 'fenty-beauty', 'Beauty for all', '/images/brands/fenty-logo.jpg', '/images/brands/fenty-banner.jpg', TRUE),
('Huda Beauty', 'huda-beauty', 'Makeup by Huda Kattan', '/images/brands/huda-logo.jpg', '/images/brands/huda-banner.jpg', TRUE),
('MAC', 'mac', 'All ages, all races, all genders', '/images/brands/mac-logo.jpg', '/images/brands/mac-banner.jpg', TRUE),
('COSRX', 'cosrx', 'Cosmetics + RX', '/images/brands/cosrx-logo.jpg', '/images/brands/cosrx-banner.jpg', TRUE),
('Minimalist', 'minimalist', 'Skincare made simple', '/images/brands/minimalist-logo.jpg', '/images/brands/minimalist-banner.jpg', TRUE),
('Plum', 'plum', 'Goodness powered by science', '/images/brands/plum-logo.jpg', '/images/brands/plum-banner.jpg', TRUE),
('The Face Shop', 'the-face-shop', 'Natural beauty from Korea', '/images/brands/faceshop-logo.jpg', '/images/brands/faceshop-banner.jpg', TRUE);

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, brand_id, category_id, stock_quantity, is_featured, is_bestseller, is_new, status) VALUES
-- Makeup Products
('Infallible 24H Fresh Wear Foundation', 'infallible-24h-fresh-wear-foundation', 'Long-lasting foundation with full coverage and fresh feel', 'Full coverage foundation that lasts 24 hours', 'LP-FND-001', 849.00, 999.00, 1, 7, 50, TRUE, TRUE, FALSE, 'active'),
('Superstay Matte Ink Liquid Lipstick', 'superstay-matte-ink-liquid-lipstick', 'Up to 16-hour wear liquid lipstick', 'Long-lasting matte liquid lipstick', 'MNY-LIP-001', 599.00, 699.00, 2, 9, 75, TRUE, TRUE, FALSE, 'active'),
('9 to 5 Primer + Matte Powder Compact', '9-to-5-primer-matte-powder-compact', 'All-day matte finish compact powder', 'Primer and powder in one compact', 'LK-PWD-001', 450.00, 550.00, 3, 7, 40, FALSE, TRUE, FALSE, 'active'),
('Gloss Bomb Universal Lip Luminizer', 'gloss-bomb-universal-lip-luminizer', 'Universal lip gloss for all skin tones', 'Explosive shine lip gloss', 'FB-LIP-001', 2400.00, NULL, 4, 9, 30, TRUE, FALSE, TRUE, 'active'),
('Liquid Matte Lipstick', 'liquid-matte-lipstick', 'Transfer-proof matte liquid lipstick', 'Matte finish liquid lipstick', 'HB-LIP-001', 1800.00, 2000.00, 5, 9, 45, FALSE, TRUE, FALSE, 'active'),

-- Skincare Products
('Advanced Snail 96 Mucin Power Essence', 'advanced-snail-96-mucin-power-essence', 'Hydrating essence with 96% snail secretion filtrate', 'Intensive hydrating essence', 'CX-ESS-001', 1350.00, 1500.00, 7, 13, 60, TRUE, TRUE, FALSE, 'active'),
('10% Niacinamide Face Serum', '10-niacinamide-face-serum', 'Oil control and pore minimizing serum', 'Reduces excess oil and minimizes pores', 'MIN-SER-001', 599.00, 699.00, 8, 13, 80, TRUE, TRUE, FALSE, 'active'),
('10% Niacinamide Brightening Face Serum', '10-niacinamide-brightening-face-serum', 'Brightening serum with rice water', 'Fades blemishes and brightens skin', 'PLM-SER-001', 649.00, 749.00, 9, 13, 70, FALSE, TRUE, FALSE, 'active'),
('Rice Water Bright Cleansing Foam', 'rice-water-bright-cleansing-foam', 'Gentle brightening cleanser', 'Brightening foam cleanser with rice water', 'TFS-CLN-001', 350.00, 400.00, 10, 11, 90, FALSE, FALSE, FALSE, 'active'),
('Relief Sun Rice + Probiotics SPF50+', 'relief-sun-rice-probiotics-spf50', 'Chemical sunscreen with rice and probiotics', 'Daily sun protection with skincare benefits', 'BOJ-SUN-001', 1200.00, 1400.00, 10, 14, 55, TRUE, FALSE, TRUE, 'active');

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, '/images/products/loreal-foundation-1.jpg', 'L\'Oreal Infallible Foundation', 0, TRUE),
(1, '/images/products/loreal-foundation-2.jpg', 'L\'Oreal Foundation Application', 1, FALSE),
(2, '/images/products/maybelline-lipstick-1.jpg', 'Maybelline Superstay Lipstick', 0, TRUE),
(2, '/images/products/maybelline-lipstick-2.jpg', 'Maybelline Lipstick Shades', 1, FALSE),
(3, '/images/products/lakme-compact-1.jpg', 'Lakme Compact Powder', 0, TRUE),
(4, '/images/products/fenty-gloss-1.jpg', 'Fenty Beauty Gloss Bomb', 0, TRUE),
(5, '/images/products/huda-lipstick-1.jpg', 'Huda Beauty Liquid Lipstick', 0, TRUE),
(6, '/images/products/cosrx-essence-1.jpg', 'COSRX Snail Essence', 0, TRUE),
(7, '/images/products/minimalist-serum-1.jpg', 'Minimalist Niacinamide Serum', 0, TRUE),
(8, '/images/products/plum-serum-1.jpg', 'Plum Niacinamide Serum', 0, TRUE),
(9, '/images/products/faceshop-cleanser-1.jpg', 'The Face Shop Cleanser', 0, TRUE),
(10, '/images/products/sunscreen-1.jpg', 'Relief Sun SPF 50+', 0, TRUE);

-- Insert product variants (shades, sizes)
INSERT INTO product_variants (product_id, name, value, stock_quantity, sku) VALUES
-- Foundation shades
(1, 'Shade', 'Ivory', 15, 'LP-FND-001-IV'),
(1, 'Shade', 'Beige', 20, 'LP-FND-001-BG'),
(1, 'Shade', 'Golden', 15, 'LP-FND-001-GD'),

-- Lipstick shades
(2, 'Shade', 'Pioneer', 25, 'MNY-LIP-001-PN'),
(2, 'Shade', 'Dreamer', 25, 'MNY-LIP-001-DR'),
(2, 'Shade', 'Lover', 25, 'MNY-LIP-001-LV'),

-- Compact shades
(3, 'Shade', 'Ivory Fair', 20, 'LK-PWD-001-IF'),
(3, 'Shade', 'Beige Honey', 20, 'LK-PWD-001-BH'),

-- Gloss shades
(4, 'Shade', 'Fenty Glow', 15, 'FB-LIP-001-FG'),
(4, 'Shade', 'Fu$$y', 15, 'FB-LIP-001-FS');

-- Insert product attributes
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(1, 'Coverage', 'Full'),
(1, 'Finish', 'Natural'),
(1, 'Skin Type', 'All skin types'),
(1, 'SPF', 'No'),
(2, 'Finish', 'Matte'),
(2, 'Longevity', '16 hours'),
(2, 'Transfer Proof', 'Yes'),
(6, 'Key Ingredient', '96% Snail Secretion Filtrate'),
(6, 'Skin Type', 'All skin types'),
(6, 'Benefits', 'Hydrating, Repairing'),
(7, 'Active Ingredient', '10% Niacinamide'),
(7, 'Skin Concern', 'Oily skin, Large pores'),
(10, 'SPF', '50+'),
(10, 'PA Rating', '++++'),
(10, 'Type', 'Chemical sunscreen');

-- Insert site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'AynBeauty', 'text', 'Website name'),
('site_tagline', 'For every day, for every mood, for every you', 'text', 'Website tagline'),
('currency', 'INR', 'text', 'Default currency'),
('currency_symbol', '₹', 'text', 'Currency symbol'),
('free_shipping_threshold', '299', 'number', 'Minimum order for free shipping'),
('tax_rate', '18', 'number', 'GST rate percentage'),
('contact_email', 'support@aynbeauty.com', 'text', 'Contact email'),
('contact_phone', '+91-1234567890', 'text', 'Contact phone number'),
('social_instagram', 'https://instagram.com/aynbeauty', 'text', 'Instagram URL'),
('social_facebook', 'https://facebook.com/aynbeauty', 'text', 'Facebook URL'),
('social_twitter', 'https://twitter.com/aynbeauty', 'text', 'Twitter URL');

-- Insert homepage sections
INSERT INTO homepage_sections (section_type, title, subtitle, content, image, link_url, sort_order) VALUES
('hero', 'Discover Your Perfect Beauty Match', 'Explore premium beauty products from top brands', 'Find everything from makeup to skincare at AynBeauty', '/images/hero/main-banner.jpg', '/products', 1),
('featured_products', 'On Our Radar', 'Trending products everyone\'s talking about', NULL, NULL, '/products?featured=true', 2),
('categories', 'Shop by Category', 'Find what you\'re looking for', NULL, NULL, '/categories', 3),
('brands', 'Popular Brands', 'Shop from your favorite beauty brands', NULL, NULL, '/brands', 4),
('banner', 'New Arrivals', 'Check out the latest products', 'Be the first to try the newest beauty innovations', '/images/banners/new-arrivals.jpg', '/products?new=true', 5);

-- Create admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, email_verified) VALUES
('admin@aynbeauty.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', TRUE);

-- Create sample customer (password: customer123)
INSERT INTO users (email, password, first_name, last_name, phone, role, email_verified) VALUES
('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Doe', '+91-9876543210', 'customer', TRUE);