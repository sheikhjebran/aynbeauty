-- Phase 3: Tira-Inspired Features Database Schema
-- Additional tables for loyalty program, personalization, content management, and reviews

-- ============================================
-- LOYALTY PROGRAM TABLES
-- ============================================

-- Loyalty tiers definition
CREATE TABLE loyalty_tiers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    min_points INT NOT NULL DEFAULT 0,
    benefits TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 0.00,
    early_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User loyalty accounts
CREATE TABLE loyalty_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tier_id INT NOT NULL DEFAULT 1,
    current_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tier_id) REFERENCES loyalty_tiers(id),
    UNIQUE KEY unique_user_loyalty (user_id)
);

-- Loyalty point transactions
CREATE TABLE loyalty_point_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    points INT NOT NULL,
    transaction_type ENUM('earned', 'redeemed', 'expired') NOT NULL,
    description VARCHAR(255),
    order_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_transactions (user_id, created_at)
);

-- Loyalty rewards catalog
CREATE TABLE loyalty_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_points INT NOT NULL,
    reward_type ENUM('discount', 'free_product', 'free_shipping', 'gift') NOT NULL,
    reward_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE NULL,
    end_date DATE NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- PERSONALIZATION TABLES
-- ============================================

-- User behavior tracking
CREATE TABLE user_behavior (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NULL,
    action_type ENUM('view', 'click', 'add_to_cart', 'add_to_wishlist', 'share', 'purchase', 'review') NOT NULL,
    page_url VARCHAR(500),
    session_id VARCHAR(255),
    duration_seconds INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_user_behavior (user_id, created_at),
    INDEX idx_product_behavior (product_id, action_type)
);

-- User preferences
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NULL,
    brand_id INT NULL,
    price_range_min DECIMAL(10,2) NULL,
    price_range_max DECIMAL(10,2) NULL,
    preferred_colors JSON NULL,
    skin_type ENUM('oily', 'dry', 'combination', 'sensitive', 'normal') NULL,
    hair_type ENUM('straight', 'wavy', 'curly', 'coily') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_preferences (user_id)
);

-- Product interaction scores
CREATE TABLE product_interactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    interaction_score INT DEFAULT 0,
    last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_interaction_score (interaction_score DESC)
);

-- Search history
CREATE TABLE search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    filters JSON NULL,
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_searches (user_id, created_at),
    INDEX idx_search_queries (search_query)
);

-- ============================================
-- CONTENT MANAGEMENT TABLES
-- ============================================

-- Dynamic content blocks
CREATE TABLE content_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type ENUM('banner', 'text', 'image', 'video', 'product_grid', 'html') NOT NULL,
    page_location VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500) NULL,
    link_url VARCHAR(500) NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    target_audience ENUM('all', 'new_users', 'returning_users', 'vip_members') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_location (page_location, display_order),
    INDEX idx_active_content (is_active, start_date, end_date)
);

-- Marketing campaigns
CREATE TABLE campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type ENUM('sale', 'new_product', 'seasonal', 'loyalty', 'referral') NOT NULL,
    status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    target_audience ENUM('all', 'new_users', 'returning_users', 'vip_members') DEFAULT 'all',
    discount_percentage DECIMAL(5,2) NULL,
    banner_image VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_campaign_status (status, start_date, end_date)
);

-- Blog posts
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    author VARCHAR(255) NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    tags VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    published_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_status (status, published_at),
    INDEX idx_blog_slug (slug)
);

-- ============================================
-- REVIEW SYSTEM TABLES
-- ============================================

-- Product reviews
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    INDEX idx_product_reviews (product_id, is_approved, created_at),
    INDEX idx_user_reviews (user_id, created_at)
);

-- Review helpful votes
CREATE TABLE review_helpful (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    review_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_review_helpful (user_id, review_id)
);

-- Review images
CREATE TABLE review_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
    INDEX idx_review_images (review_id, display_order)
);

-- ============================================
-- ADDITIONAL FEATURES
-- ============================================

-- User notifications
CREATE TABLE user_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('order_update', 'promotion', 'loyalty_reward', 'product_restock', 'review_reminder') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id, is_read, created_at)
);

-- Product view counts (for trending analysis)
ALTER TABLE products ADD COLUMN view_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN purchase_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN last_viewed_at TIMESTAMP NULL;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default loyalty tiers
INSERT INTO loyalty_tiers (name, min_points, benefits, discount_percentage, free_shipping_threshold, early_access) VALUES
('Bronze', 0, 'Basic rewards, birthday bonus', 5.00, 999.00, FALSE),
('Silver', 1000, 'Enhanced rewards, exclusive offers', 10.00, 799.00, FALSE),
('Gold', 5000, 'Premium rewards, priority support', 15.00, 599.00, TRUE),
('Platinum', 15000, 'VIP treatment, exclusive events', 20.00, 0.00, TRUE);

-- Insert default loyalty rewards
INSERT INTO loyalty_rewards (name, description, required_points, reward_type, reward_value, is_active) VALUES
('₹100 Off Coupon', 'Get ₹100 off on your next purchase', 500, 'discount', 100.00, TRUE),
('₹250 Off Coupon', 'Get ₹250 off on your next purchase', 1000, 'discount', 250.00, TRUE),
('Free Shipping', 'Free shipping on your next order', 200, 'free_shipping', 0.00, TRUE),
('₹500 Off Coupon', 'Get ₹500 off on your next purchase', 2000, 'discount', 500.00, TRUE),
('VIP Sample Box', 'Exclusive sample box with latest products', 1500, 'gift', 0.00, TRUE);

-- Insert sample content blocks
INSERT INTO content_blocks (title, content, content_type, page_location, display_order, image_url, link_url) VALUES
('Welcome to AYN Beauty', 'Discover your perfect beauty routine with our curated collection', 'banner', 'homepage_banner', 1, '/images/hero-banner.jpg', '/products'),
('New Arrivals', 'Check out the latest products from top beauty brands', 'banner', 'homepage_featured', 1, '/images/new-arrivals.jpg', '/products?sort=newest'),
('Summer Sale', 'Up to 50% off on selected beauty products', 'banner', 'homepage_banner', 2, '/images/summer-sale.jpg', '/sale');

-- Insert sample campaigns
INSERT INTO campaigns (name, description, campaign_type, status, start_date, end_date, discount_percentage, banner_image) VALUES
('Summer Beauty Sale', 'Biggest sale of the season with up to 50% off', 'sale', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 50.00, '/images/summer-sale-banner.jpg'),
('New Member Welcome', 'Special 20% discount for new customers', 'loyalty', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 20.00, '/images/welcome-banner.jpg');

-- Create indexes for better performance
CREATE INDEX idx_loyalty_points ON loyalty_point_transactions(user_id, created_at DESC);
CREATE INDEX idx_user_behavior_recent ON user_behavior(user_id, created_at DESC);
CREATE INDEX idx_product_rating ON products(rating DESC, rating_count DESC);
CREATE INDEX idx_reviews_rating ON product_reviews(product_id, rating, created_at DESC);

-- ============================================
-- TRIGGERS FOR AUTOMATION
-- ============================================

-- Trigger to update product view count
DELIMITER //
CREATE TRIGGER update_product_view_count
AFTER INSERT ON user_behavior
FOR EACH ROW
BEGIN
    IF NEW.action_type = 'view' AND NEW.product_id IS NOT NULL THEN
        UPDATE products 
        SET view_count = view_count + 1, 
            last_viewed_at = NOW() 
        WHERE id = NEW.product_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update product purchase count
DELIMITER //
CREATE TRIGGER update_product_purchase_count
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET purchase_count = purchase_count + NEW.quantity 
    WHERE id = NEW.product_id;
END//
DELIMITER ;

-- Trigger to auto-upgrade loyalty tiers
DELIMITER //
CREATE TRIGGER check_loyalty_tier_upgrade
AFTER UPDATE ON loyalty_accounts
FOR EACH ROW
BEGIN
    DECLARE new_tier_id INT;
    
    SELECT id INTO new_tier_id
    FROM loyalty_tiers
    WHERE NEW.total_points >= min_points
    ORDER BY min_points DESC
    LIMIT 1;
    
    IF new_tier_id != NEW.tier_id THEN
        UPDATE loyalty_accounts
        SET tier_id = new_tier_id
        WHERE id = NEW.id;
    END IF;
END//
DELIMITER ;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for user loyalty summary
CREATE VIEW user_loyalty_summary AS
SELECT 
    la.user_id,
    u.first_name,
    u.last_name,
    u.email,
    lt.name as tier_name,
    la.current_points,
    la.total_points,
    lt.discount_percentage,
    lt.free_shipping_threshold,
    lt.early_access
FROM loyalty_accounts la
JOIN users u ON la.user_id = u.id
JOIN loyalty_tiers lt ON la.tier_id = lt.id;

-- View for product popularity
CREATE VIEW product_popularity AS
SELECT 
    p.id,
    p.name,
    p.brand,
    p.view_count,
    p.purchase_count,
    p.rating,
    p.rating_count,
    COUNT(DISTINCT pr.id) as review_count,
    AVG(pr.rating) as avg_review_rating
FROM products p
LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
GROUP BY p.id, p.name, p.brand, p.view_count, p.purchase_count, p.rating, p.rating_count;