-- Sample data for coupons
-- Generated: 2025-10-05T16:03:54.448Z

INSERT INTO `coupons` (`id`, `code`, `name`, `description`, `type`, `value`, `minimum_amount`, `maximum_discount`, `usage_limit`, `used_count`, `is_active`, `starts_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', '10.00', '500.00', NULL, 100, 0, 1, '2025-09-30 22:45:55', '2025-10-30 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(2, 'SAVE500', 'Flat 500 Off', 'Get flat ₹500 off on orders above ₹2000', 'fixed', '500.00', '2000.00', NULL, 50, 0, 1, '2025-09-30 22:45:55', '2025-10-15 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44'),
(3, 'BEAUTY20', 'Beauty Special', 'Get 20% off on all makeup products', 'percentage', '20.00', '1000.00', NULL, 200, 0, 1, '2025-09-30 22:45:55', '2025-11-14 22:45:55', '2025-10-05 14:06:44', '2025-10-05 14:06:44');

