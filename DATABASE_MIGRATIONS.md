# Database Migrations Guide

This document explains how to use the database migration system for AYN Beauty.

## Overview

The migration system allows you to:
- Version control your database schema changes
- Apply and rollback database changes
- Track migration status
- Set up fresh database instances

## Migration Commands

### 1. Check Migration Status
```bash
npm run migrate:status
```
Shows which migrations have been applied and which are pending.

### 2. Run Migrations
```bash
npm run migrate
```
Applies all pending migrations in order.

### 3. Rollback Last Migration
```bash
npm run migrate:rollback
```
Rolls back the most recently applied migration.

### 4. Fresh Database Setup
```bash
npm run migrate:fresh
```
Drops all tables and runs all migrations from scratch. **Use with caution!**

### 5. Create New Migration
```bash
npm run make:migration create_new_table
```
Creates a new migration file with the specified name.

## Migration Files

Migrations are stored in `database/migrations/` directory with the following naming convention:
- Migration file: `YYYYMMDDHHMMSS_migration_name.sql`
- Rollback file: `YYYYMMDDHHMMSS_migration_name.rollback.sql`

## Getting Started

### First Time Setup

1. **Configure Environment Variables**
   Make sure your `.env.local` file has the database configuration:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=aynbeauty
   ```

2. **Create Database**
   Create the database in MySQL:
   ```sql
   CREATE DATABASE aynbeauty;
   ```

3. **Run Initial Migrations**
   ```bash
   npm run migrate
   ```

4. **Check Status**
   ```bash
   npm run migrate:status
   ```

### Example: Creating a New Migration

1. **Generate Migration File**
   ```bash
   npm run make:migration add_user_preferences
   ```

2. **Edit Migration File**
   Edit `database/migrations/[timestamp]_add_user_preferences.sql`:
   ```sql
   -- Migration: Add user preferences table
   -- Created: [timestamp]
   -- Description: Add table to store user preferences
   
   CREATE TABLE user_preferences (
       id INT PRIMARY KEY AUTO_INCREMENT,
       user_id INT NOT NULL,
       preference_key VARCHAR(100) NOT NULL,
       preference_value TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
       UNIQUE KEY unique_user_preference (user_id, preference_key)
   );
   ```

3. **Edit Rollback File**
   Edit `database/migrations/[timestamp]_add_user_preferences.rollback.sql`:
   ```sql
   -- Rollback: Remove user preferences table
   -- Created: [timestamp]
   -- Description: Drop user preferences table
   
   DROP TABLE IF EXISTS user_preferences;
   ```

4. **Apply Migration**
   ```bash
   npm run migrate
   ```

## Migration Best Practices

### 1. Always Test Rollbacks
- Test both migration and rollback scripts
- Ensure rollbacks completely undo the migration changes

### 2. Use Transactions
- Wrap complex migrations in transactions when possible
- Ensure atomicity of migration operations

### 3. Backup Before Major Changes
- Always backup your database before running migrations in production
- Test migrations on a copy of production data first

### 4. Descriptive Names
- Use descriptive migration names that explain the change
- Include the purpose in the migration description

### 5. Foreign Key Constraints
- Be careful with foreign key constraints in rollbacks
- Drop constraints before dropping referenced tables

## Current Migrations

### 20241001000001_create_core_tables
- Creates core tables: categories, brands, products, users, content_blocks
- Includes proper indexes and foreign key relationships

### 20241001000002_create_ecommerce_tables
- Creates e-commerce tables: orders, order_items, payments, reviews, wishlists, coupons
- Includes complex relationships for order management

### 20241001000003_insert_sample_data
- Inserts sample data for testing and development
- Includes categories, brands, products, users, and coupons

### 20251001094852_create_campaigns_tables
- Creates campaigns and marketing automation tables
- Includes promotional campaigns, marketing campaigns, recipients, analytics, and A/B testing

### 20251001095103_insert_sample_campaigns
- Inserts sample campaign data for testing
- Includes active promotional campaigns with discounts and date ranges

## Troubleshooting

### Migration Fails
1. Check database connection settings in `.env.local`
2. Verify database exists and user has proper permissions
3. Check migration file syntax
4. Review error messages for specific issues

### Rollback Issues
1. Ensure rollback script properly handles dependencies
2. Check for foreign key constraint violations
3. Verify rollback script syntax

### Migration Status Issues
1. Ensure `migrations` table exists (created automatically)
2. Check database connection
3. Verify migration file naming convention

## Database Schema Overview

The database includes the following main components:

### Core Tables
- **categories**: Product categories with hierarchical structure
- **brands**: Brand information
- **products**: Main product catalog with pricing and inventory
- **users**: User accounts with role-based access
- **content_blocks**: Dynamic content for CMS features

### E-commerce Tables
- **orders**: Order management with status tracking
- **order_items**: Individual items within orders
- **payments**: Payment transaction records
- **reviews**: Product reviews and ratings
- **wishlists**: User wishlist functionality
- **coupons**: Discount coupon system

### Support Tables

- **product_images**: Multiple images per product
- **product_attributes**: Flexible product attributes
- **migrations**: Migration tracking (system table)

### Campaign Tables

- **campaigns**: Promotional banners and offers with tracking
- **marketing_campaigns**: Email/SMS marketing campaigns
- **campaign_recipients**: Email campaign recipient tracking
- **campaign_analytics**: Detailed campaign performance metrics
- **campaign_ab_tests**: A/B testing for campaign optimization

For detailed schema information, refer to the migration files in `database/migrations/`.