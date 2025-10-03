-- Advanced Features Database Schema
-- Phase 4: AI Recommendations, Virtual Try-On, Analytics, Marketing Automation, Performance Monitoring

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_type ENUM('web_vitals', 'api_response_time', 'database_query', 'cache_access', 'resource_load', 'error') NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) DEFAULT 'ms',
    additional_data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_type_time (metric_type, timestamp),
    INDEX idx_metric_name_time (metric_name, timestamp)
);

-- Optimization Recommendations Table
CREATE TABLE IF NOT EXISTS optimization_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('database', 'caching', 'images', 'code', 'infrastructure') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact ENUM('low', 'medium', 'high') NOT NULL,
    effort ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'dismissed') DEFAULT 'pending',
    estimated_improvement VARCHAR(100),
    implementation_steps JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_status_impact (status, impact)
);

-- AI Recommendation Engine Tables
CREATE TABLE IF NOT EXISTS user_behavior_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255),
    event_type ENUM('view', 'click', 'purchase', 'cart_add', 'wishlist_add', 'search', 'filter', 'recommendation_click') NOT NULL,
    product_id INT,
    category_id INT,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    device_type ENUM('desktop', 'mobile', 'tablet'),
    user_agent TEXT,
    ip_address VARCHAR(45),
    event_data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_session_timestamp (session_id, timestamp),
    INDEX idx_event_type_timestamp (event_type, timestamp)
);

CREATE TABLE IF NOT EXISTS recommendation_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_type ENUM('collaborative_filtering', 'content_based', 'hybrid', 'deep_learning') NOT NULL,
    version VARCHAR(50) NOT NULL,
    status ENUM('training', 'active', 'deprecated', 'failed') DEFAULT 'training',
    accuracy_score DECIMAL(5,4),
    training_data_size INT,
    model_parameters JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_type (status, model_type)
);

CREATE TABLE IF NOT EXISTS user_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    recommendation_type ENUM('similar_products', 'collaborative', 'trending', 'personalized', 'skin_type_match', 'occasion_based', 'seasonal') NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    model_id INT,
    context_data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP NULL,
    purchased BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES recommendation_models(id) ON DELETE SET NULL,
    INDEX idx_user_type (user_id, recommendation_type),
    INDEX idx_confidence (confidence_score DESC),
    INDEX idx_generated_at (generated_at)
);

-- Virtual Try-On System Tables
CREATE TABLE IF NOT EXISTS virtual_tryon_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_id INT,
    face_analysis_data JSON,
    skin_tone VARCHAR(50),
    face_shape ENUM('oval', 'round', 'square', 'heart', 'diamond', 'oblong'),
    eye_color VARCHAR(50),
    skin_type ENUM('oily', 'dry', 'combination', 'sensitive', 'normal'),
    device_type ENUM('desktop', 'mobile', 'tablet'),
    camera_quality ENUM('low', 'medium', 'high'),
    lighting_conditions ENUM('poor', 'fair', 'good', 'excellent'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_session_id (session_id)
);

CREATE TABLE IF NOT EXISTS virtual_tryon_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    product_category ENUM('lipstick', 'eyeshadow', 'foundation', 'blush', 'eyeliner', 'mascara', 'bronzer', 'highlighter'),
    try_on_data JSON,
    compatibility_score DECIMAL(5,4),
    user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5),
    shared BOOLEAN DEFAULT FALSE,
    shared_at TIMESTAMP NULL,
    session_duration INT, -- seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_session_product (session_id, product_id),
    INDEX idx_compatibility (compatibility_score DESC),
    INDEX idx_shared (shared, shared_at)
);

CREATE TABLE IF NOT EXISTS ar_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    model_type ENUM('3d_mesh', 'texture_map', 'color_palette', 'blend_mode') NOT NULL,
    model_data JSON NOT NULL,
    file_url VARCHAR(500),
    file_size INT,
    quality ENUM('low', 'medium', 'high', 'ultra') DEFAULT 'medium',
    supported_devices JSON,
    version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_type (product_id, model_type),
    INDEX idx_quality (quality)
);

-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_category VARCHAR(100) NOT NULL,
    event_action VARCHAR(100) NOT NULL,
    event_label VARCHAR(255),
    user_id INT,
    session_id VARCHAR(255),
    product_id INT,
    order_id INT,
    event_value DECIMAL(10,2),
    custom_dimensions JSON,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    device_info JSON,
    geo_location JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_category_action (event_category, event_action),
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_session_timestamp (session_id, timestamp),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE IF NOT EXISTS cohort_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cohort_month DATE NOT NULL,
    user_count INT NOT NULL,
    period_number INT NOT NULL,
    returning_users INT NOT NULL,
    retention_rate DECIMAL(5,4) NOT NULL,
    revenue DECIMAL(10,2) DEFAULT 0,
    orders_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cohort_period (cohort_month, period_number),
    UNIQUE KEY unique_cohort_period (cohort_month, period_number)
);

CREATE TABLE IF NOT EXISTS funnel_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funnel_name VARCHAR(100) NOT NULL,
    step_number INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    users_count INT NOT NULL,
    conversion_rate DECIMAL(5,4),
    date DATE NOT NULL,
    segment_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_funnel_date (funnel_name, date),
    INDEX idx_step_date (step_number, date)
);

-- Marketing Automation Tables
CREATE TABLE IF NOT EXISTS customer_segments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segment_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    criteria JSON NOT NULL,
    segment_type ENUM('demographic', 'behavioral', 'purchase_history', 'engagement', 'lifecycle', 'custom') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    auto_update BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type_active (segment_type, is_active)
);

CREATE TABLE IF NOT EXISTS customer_segment_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segment_id INT NOT NULL,
    user_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (segment_id) REFERENCES customer_segments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_segment_user (segment_id, user_id),
    INDEX idx_segment_active (segment_id, is_active),
    INDEX idx_user_active (user_id, is_active)
);

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type ENUM('email', 'sms', 'push', 'in_app', 'social', 'retargeting') NOT NULL,
    status ENUM('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
    trigger_type ENUM('manual', 'scheduled', 'behavioral', 'event_based') NOT NULL,
    trigger_conditions JSON,
    target_segments JSON,
    content_data JSON NOT NULL,
    personalization_rules JSON,
    send_time_optimization BOOLEAN DEFAULT FALSE,
    ab_test_enabled BOOLEAN DEFAULT FALSE,
    ab_test_config JSON,
    budget_limit DECIMAL(10,2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status_type (status, campaign_type),
    INDEX idx_trigger_type (trigger_type),
    INDEX idx_dates (start_date, end_date)
);

CREATE TABLE IF NOT EXISTS campaign_sends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    send_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status ENUM('pending', 'sent', 'delivered', 'bounced', 'failed') DEFAULT 'pending',
    opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMP NULL,
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP NULL,
    converted BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMP NULL,
    conversion_value DECIMAL(10,2),
    unsubscribed BOOLEAN DEFAULT FALSE,
    unsubscribed_at TIMESTAMP NULL,
    personalized_content JSON,
    delivery_metadata JSON,
    FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_user (campaign_id, user_id),
    INDEX idx_campaign_status (campaign_id, delivery_status),
    INDEX idx_user_campaign (user_id, campaign_id),
    INDEX idx_send_time (send_time)
);

CREATE TABLE IF NOT EXISTS automation_triggers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trigger_name VARCHAR(255) NOT NULL,
    trigger_type ENUM('welcome_series', 'abandoned_cart', 'browse_abandonment', 'post_purchase', 'birthday', 'loyalty_milestone', 'reactivation', 'custom') NOT NULL,
    conditions JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    trigger_delay INT DEFAULT 0, -- minutes
    frequency_limit JSON, -- rate limiting rules
    campaign_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    INDEX idx_type_active (trigger_type, is_active),
    INDEX idx_campaign (campaign_id)
);

CREATE TABLE IF NOT EXISTS automation_executions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trigger_id INT NOT NULL,
    user_id INT NOT NULL,
    execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'executed', 'failed', 'skipped') DEFAULT 'pending',
    failure_reason TEXT,
    context_data JSON,
    next_execution TIMESTAMP NULL,
    FOREIGN KEY (trigger_id) REFERENCES automation_triggers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trigger_status (trigger_id, status),
    INDEX idx_user_execution (user_id, execution_time),
    INDEX idx_next_execution (next_execution)
);

-- Extended User Profile for AI/ML Features
CREATE TABLE IF NOT EXISTS user_ai_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    skin_tone_analysis JSON,
    style_preferences JSON,
    color_preferences JSON,
    brand_affinity JSON,
    price_sensitivity ENUM('low', 'medium', 'high'),
    seasonal_preferences JSON,
    occasion_preferences JSON,
    ingredient_preferences JSON,
    ai_consent BOOLEAN DEFAULT FALSE,
    last_analysis_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Product AI Metadata
CREATE TABLE IF NOT EXISTS product_ai_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    color_analysis JSON,
    skin_compatibility JSON,
    style_tags JSON,
    occasion_suitability JSON,
    season_relevance JSON,
    ingredient_analysis JSON,
    trend_score DECIMAL(5,4) DEFAULT 0,
    ai_description TEXT,
    last_analysis_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Real-time Notifications
CREATE TABLE IF NOT EXISTS real_time_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    notification_type ENUM('recommendation', 'stock_alert', 'price_drop', 'new_arrival', 'review_request', 'loyalty_update', 'virtual_tryon_ready') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    is_clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_type_priority (notification_type, priority),
    INDEX idx_created_at (created_at),
    INDEX idx_expires_at (expires_at)
);

-- A/B Testing Framework
CREATE TABLE IF NOT EXISTS ab_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    test_type ENUM('feature', 'ui', 'algorithm', 'content', 'price') NOT NULL,
    status ENUM('draft', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
    traffic_allocation DECIMAL(5,4) DEFAULT 1.0000,
    variants JSON NOT NULL,
    success_metrics JSON NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status_dates (status, start_date, end_date),
    INDEX idx_test_type (test_type)
);

CREATE TABLE IF NOT EXISTS ab_test_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    user_id INT NOT NULL,
    variant_id VARCHAR(100) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMP NULL,
    conversion_value DECIMAL(10,2),
    FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_test_user (test_id, user_id),
    INDEX idx_test_variant (test_id, variant_id),
    INDEX idx_converted (converted, converted_at)
);

-- ML Model Performance Tracking
CREATE TABLE IF NOT EXISTS ml_model_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,6) NOT NULL,
    evaluation_date DATE NOT NULL,
    dataset_size INT,
    evaluation_metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_model_date (model_name, evaluation_date),
    INDEX idx_metric_date (metric_name, evaluation_date),
    UNIQUE KEY unique_model_metric_date (model_name, model_version, metric_name, evaluation_date)
);

-- Insert initial optimization recommendations
INSERT INTO optimization_recommendations (category, title, description, impact, effort, estimated_improvement, implementation_steps) VALUES
('database', 'Add Database Indexes', 'Optimize slow queries by adding strategic indexes on frequently queried columns', 'high', 'low', '15-25% faster queries', JSON_ARRAY('Analyze slow query log', 'Identify missing indexes', 'Create composite indexes', 'Monitor performance impact')),
('caching', 'Implement Redis Caching', 'Add Redis layer for frequently accessed data to reduce database load', 'high', 'medium', '30-40% faster response times', JSON_ARRAY('Set up Redis server', 'Implement cache wrapper', 'Add cache invalidation logic', 'Monitor hit rates')),
('images', 'Image Optimization', 'Convert images to modern formats (WebP, AVIF) and implement lazy loading', 'medium', 'low', '20-30% faster page loads', JSON_ARRAY('Audit current images', 'Set up image processing pipeline', 'Implement lazy loading', 'Configure CDN')),
('code', 'Bundle Size Optimization', 'Reduce JavaScript bundle size through code splitting and tree shaking', 'medium', 'medium', '10-15% faster initial load', JSON_ARRAY('Analyze bundle composition', 'Implement code splitting', 'Remove unused dependencies', 'Enable compression')),
('infrastructure', 'CDN Implementation', 'Set up global CDN for static assets and API caching', 'high', 'high', '40-50% faster global performance', JSON_ARRAY('Choose CDN provider', 'Configure asset delivery', 'Set up edge caching', 'Implement cache headers'));

-- Insert initial recommendation models
INSERT INTO recommendation_models (model_name, model_type, version, status, accuracy_score, model_parameters) VALUES
('collaborative_v1', 'collaborative_filtering', '1.0', 'active', 0.8421, JSON_OBJECT('factors', 50, 'regularization', 0.01, 'iterations', 100)),
('content_based_v1', 'content_based', '1.0', 'active', 0.7892, JSON_OBJECT('similarity_threshold', 0.75, 'feature_weights', JSON_OBJECT('color', 0.3, 'brand', 0.2, 'category', 0.5))),
('hybrid_v1', 'hybrid', '1.0', 'active', 0.8756, JSON_OBJECT('collaborative_weight', 0.6, 'content_weight', 0.4, 'min_confidence', 0.5)),
('deep_learning_v1', 'deep_learning', '1.0', 'training', NULL, JSON_OBJECT('layers', JSON_ARRAY(128, 64, 32), 'dropout', 0.2, 'learning_rate', 0.001));

-- Insert initial customer segments
INSERT INTO customer_segments (segment_name, description, criteria, segment_type) VALUES
('VIP Customers', 'High-value customers with over $500 total purchases', JSON_OBJECT('total_spent', JSON_OBJECT('operator', '>=', 'value', 500)), 'purchase_history'),
('New Customers', 'Customers who joined in the last 30 days', JSON_OBJECT('days_since_registration', JSON_OBJECT('operator', '<=', 'value', 30)), 'lifecycle'),
('Beauty Enthusiasts', 'Customers with high engagement and frequent purchases', JSON_OBJECT('order_frequency', JSON_OBJECT('operator', '>=', 'value', 5), 'page_views', JSON_OBJECT('operator', '>=', 'value', 50)), 'behavioral'),
('Cart Abandoners', 'Customers who added items to cart but didn\'t purchase in last 7 days', JSON_OBJECT('cart_abandonment', JSON_OBJECT('days', 7, 'has_items', true)), 'behavioral'),
('Skincare Lovers', 'Customers who primarily purchase skincare products', JSON_OBJECT('category_preference', JSON_OBJECT('category', 'skincare', 'percentage', 70)), 'demographic');

-- Insert initial automation triggers
INSERT INTO automation_triggers (trigger_name, trigger_type, conditions, is_active, trigger_delay) VALUES
('Welcome Series', 'welcome_series', JSON_OBJECT('event', 'user_registration'), TRUE, 60),
('Abandoned Cart Recovery', 'abandoned_cart', JSON_OBJECT('cart_idle_time', 180, 'min_cart_value', 25), TRUE, 60),
('Browse Abandonment', 'browse_abandonment', JSON_OBJECT('session_duration', 300, 'pages_viewed', 3, 'no_purchase', true), TRUE, 1440),
('Post Purchase Follow-up', 'post_purchase', JSON_OBJECT('days_after_purchase', 7), TRUE, 10080),
('Birthday Campaign', 'birthday', JSON_OBJECT('days_before_birthday', 7), TRUE, 0),
('Reactivation Campaign', 'reactivation', JSON_OBJECT('days_since_last_order', 90), TRUE, 0);

-- Insert sample A/B tests
INSERT INTO ab_tests (test_name, description, test_type, status, variants, success_metrics) VALUES
('Recommendation Algorithm Test', 'Test new collaborative filtering vs current algorithm', 'algorithm', 'active', 
 JSON_OBJECT('control', JSON_OBJECT('name', 'Current Algorithm', 'traffic', 0.5), 'variant', JSON_OBJECT('name', 'New CF Algorithm', 'traffic', 0.5)),
 JSON_ARRAY('click_through_rate', 'conversion_rate', 'revenue_per_user')),
('Product Page Layout', 'Test new product page design with enhanced virtual try-on placement', 'ui', 'active',
 JSON_OBJECT('control', JSON_OBJECT('name', 'Current Layout', 'traffic', 0.6), 'variant', JSON_OBJECT('name', 'Enhanced VTO Layout', 'traffic', 0.4)),
 JSON_ARRAY('virtual_tryon_usage', 'add_to_cart_rate', 'purchase_rate'));

-- Create indexes for performance
CREATE INDEX idx_user_behavior_user_time ON user_behavior_tracking(user_id, timestamp);
CREATE INDEX idx_user_behavior_event_time ON user_behavior_tracking(event_type, timestamp);
CREATE INDEX idx_recommendations_user_type ON user_recommendations(user_id, recommendation_type);
CREATE INDEX idx_virtual_sessions_user_time ON virtual_tryon_sessions(user_id, created_at);
CREATE INDEX idx_campaign_sends_campaign_time ON campaign_sends(campaign_id, send_time);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_performance_metrics_type_time ON performance_metrics(metric_type, timestamp);