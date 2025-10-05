-- Fresh Migration 5: Sample Data
-- This migration inserts sample data that matches your local database

-- Insert sample brands
INSERT IGNORE INTO brands (id, name, slug, description, logo_url, website_url, is_active, sort_order) VALUES
(1, 'Maybelline', 'maybelline', 'Global makeup brand with innovative products', '/images/brands/maybelline.jpg', NULL, 1, 0),
(2, 'L\'Oreal', 'loreal', 'Leading beauty brand with premium products', '/images/brands/loreal.jpg', NULL, 1, 0),
(3, 'Lakme', 'lakme', 'India\'s premier beauty brand', '/images/brands/lakme.jpg', NULL, 1, 0),
(4, 'MAC', 'mac', 'Professional makeup artistry brand', '/images/brands/mac.jpg', NULL, 1, 0),
(5, 'Nykaa', 'nykaa', 'India\'s own beauty brand', '/images/brands/nykaa.jpg', NULL, 1, 0),
(6, 'Urban Decay', 'urban-decay', 'Edgy and innovative beauty brand', '/images/brands/urban-decay.jpg', NULL, 1, 0);

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, slug, description, image_url, parent_id, is_active, sort_order) VALUES
(8, 'Skincare', 'skincare', 'Complete skincare solutions for all skin types', '/images/categories/skincare.jpg', NULL, 1, 0),
(9, 'Lips', 'lips', 'Lip makeup and care products', '/images/categories/lips.jpg', NULL, 1, 0),
(10, 'Bath and Body', 'bath-and-body', 'Luxurious bath and body care products', '/images/categories/bath-body.jpg', NULL, 1, 0),
(11, 'Fragrances', 'fragrances', 'Premium fragrances for every occasion', '/images/categories/fragrances.jpg', NULL, 1, 0),
(12, 'Eyes', 'eyes', 'Eye makeup and care products', '/images/categories/eyes.jpg', NULL, 1, 0),
(13, 'Face', 'face', 'Foundation, concealer and face makeup', '/images/categories/face.jpg', NULL, 1, 0),
(14, 'Makeup', 'makeup', 'Complete makeup collection', '/images/categories/makeup.jpg', NULL, 1, 0);

-- Insert sample coupons
INSERT IGNORE INTO coupons (id, code, name, description, type, value, minimum_amount, maximum_discount, usage_limit, used_count, is_active, starts_at, expires_at) VALUES
(1, 'WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 500.00, NULL, 100, 0, 1, '2025-10-01 04:15:55', '2025-10-31 04:15:55'),
(2, 'SAVE500', 'Flat 500 Off', 'Get flat ₹500 off on orders above ₹2000', 'fixed', 500.00, 2000.00, NULL, 50, 0, 1, '2025-10-01 04:15:55', '2025-10-16 04:15:55'),
(3, 'BEAUTY20', 'Beauty Special', 'Get 20% off on all makeup products', 'percentage', 20.00, 1000.00, NULL, 200, 0, 1, '2025-10-01 04:15:55', '2025-11-15 04:15:55');

-- Insert sample campaigns
INSERT IGNORE INTO campaigns (id, title, description, image_url, banner_url, type, status, target_audience, discount_type, discount_value, minimum_amount, maximum_discount, coupon_code, priority, click_count, view_count, conversion_count, start_date, end_date, created_by) VALUES
(1, 'Summer Beauty Sale', 'Up to 50% off on all makeup products', '/images/campaigns/summer-sale.jpg', '/images/banners/summer-sale-banner.jpg', 'sale', 'active', 'all', 'percentage', 50.00, NULL, NULL, 'SUMMER50', 1, 0, 0, 0, '2025-09-01 00:00:00', '2025-12-31 23:59:59', NULL),
(2, 'New Arrivals Showcase', 'Discover the latest beauty trends', '/images/campaigns/new-arrivals.jpg', '/images/banners/new-arrivals-banner.jpg', 'banner', 'active', 'all', NULL, NULL, NULL, NULL, NULL, 2, 0, 0, 0, '2025-10-01 00:00:00', '2025-11-30 23:59:59', NULL),
(3, 'Free Shipping Weekend', 'Free shipping on orders above ₹999', '/images/campaigns/free-shipping.jpg', '/images/banners/free-shipping-banner.jpg', 'offer', 'active', 'all', 'free_shipping', 0.00, NULL, NULL, 'FREESHIP', 3, 0, 0, 0, '2025-10-01 00:00:00', '2025-10-07 23:59:59', NULL),
(4, 'VIP Member Exclusive', 'Exclusive offers for VIP members', '/images/campaigns/vip-exclusive.jpg', '/images/banners/vip-banner.jpg', 'promotion', 'active', 'vip', 'percentage', 25.00, NULL, NULL, 'VIP25', 1, 0, 0, 0, '2025-10-01 00:00:00', '2025-12-31 23:59:59', NULL),
(5, 'Diwali Special', 'Festive beauty collection', '/images/campaigns/diwali-special.jpg', '/images/banners/diwali-banner.jpg', 'sale', 'active', 'all', 'percentage', 30.00, NULL, NULL, 'DIWALI30', 2, 0, 0, 0, '2025-10-15 00:00:00', '2025-11-15 23:59:59', NULL);

-- Insert sample content blocks
INSERT IGNORE INTO content_blocks (id, title, content, page_location, display_order, is_active, start_date, end_date, link_url, link_text, image_url, button_color) VALUES
(1, 'Welcome to AYN Beauty', 'Discover premium beauty products from top brands. Transform your beauty routine with our curated collection.', 'homepage_banner', 1, 1, NULL, NULL, '/products', 'Shop Now', '/images/banners/welcome-banner.jpg', '#ec4899'),
(2, 'New Arrivals', 'Check out our latest beauty collection featuring the newest products from your favorite brands.', 'homepage_banner', 2, 1, NULL, NULL, '/products?new=true', 'Explore New', '/images/banners/new-arrivals.jpg', '#ec4899'),
(3, 'Special Offers', 'Up to 30% off on selected items. Limited time offer on premium beauty products.', 'homepage_banner', 3, 1, NULL, NULL, '/offers', 'Shop Offers', '/images/banners/special-offers.jpg', '#ec4899'),
(4, 'Beauty Tips', 'Get expert beauty tips and tutorials from professional makeup artists.', 'homepage_section', 4, 1, NULL, NULL, '/blog', 'Read More', '/images/banners/beauty-tips.jpg', '#ec4899'),
(5, 'Virtual Try-On', 'Try products virtually with our AI-powered virtual try-on technology.', 'homepage_feature', 5, 1, NULL, NULL, '/virtual-tryon', 'Try Now', '/images/banners/virtual-tryon.jpg', '#ec4899');

-- Insert admin user (will update with proper bcrypt hash)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, mobile, date_of_birth, gender, avatar_url, is_active, is_verified, email_verified_at, role, last_login_at, email_verification_token, email_verification_expires, last_login, email_verified, phone) VALUES
(3, 'admin@aynbeauty.com', '$2a$10$CoGmmIX4zP6P2OuTA8CsRO.GSvmR9A4VA1uSwAtZJad4r3kke9QX.', 'Admin', 'User', NULL, NULL, NULL, NULL, 1, 1, NULL, 'admin', NULL, NULL, NULL, '2025-10-03 21:44:33', 1, NULL);