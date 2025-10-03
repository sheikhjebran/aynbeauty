-- Migration: insert_sample_campaigns
-- Created: 2025-10-01T04:21:03.000Z
-- Description: Insert sample campaigns for testing

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Insert sample campaigns
INSERT IGNORE INTO campaigns (id, title, description, image_url, banner_url, type, status, target_audience, discount_type, discount_value, coupon_code, priority, start_date, end_date) VALUES
(1, 'Summer Beauty Sale', 'Up to 50% off on all makeup products', '/images/campaigns/summer-sale.jpg', '/images/banners/summer-sale-banner.jpg', 'sale', 'active', 'all', 'percentage', 50.00, 'SUMMER50', 1, '2025-09-01 00:00:00', '2025-12-31 23:59:59'),
(2, 'New Arrivals Showcase', 'Discover the latest beauty trends', '/images/campaigns/new-arrivals.jpg', '/images/banners/new-arrivals-banner.jpg', 'banner', 'active', 'all', NULL, NULL, NULL, 2, '2025-10-01 00:00:00', '2025-11-30 23:59:59'),
(3, 'Free Shipping Weekend', 'Free shipping on orders above ₹999', '/images/campaigns/free-shipping.jpg', '/images/banners/free-shipping-banner.jpg', 'offer', 'active', 'all', 'free_shipping', 0.00, 'FREESHIP', 3, '2025-10-01 00:00:00', '2025-10-07 23:59:59'),
(4, 'VIP Member Exclusive', 'Exclusive offers for VIP members', '/images/campaigns/vip-exclusive.jpg', '/images/banners/vip-banner.jpg', 'promotion', 'active', 'vip', 'percentage', 25.00, 'VIP25', 1, '2025-10-01 00:00:00', '2025-12-31 23:59:59'),
(5, 'Diwali Special', 'Festive beauty collection', '/images/campaigns/diwali-special.jpg', '/images/banners/diwali-banner.jpg', 'sale', 'active', 'all', 'percentage', 30.00, 'DIWALI30', 2, '2025-10-15 00:00:00', '2025-11-15 23:59:59');
