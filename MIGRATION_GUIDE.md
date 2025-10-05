# AYN Beauty Database Migration System

## Overview

This is a comprehensive database migration system designed specifically for the AYN Beauty e-commerce platform. The system provides full database schema management with validation, rollback capabilities, and cross-platform compatibility.

## 🗄️ Database Schema

The AYN Beauty database consists of **21 tables** with **277 columns**, **92 indexes**, and **24 foreign key relationships**:

### Core Tables (Migration 001)
- **users** - User accounts and authentication
- **brands** - Product brands
- **categories** - Product categories with hierarchy
- **migrations** - Migration tracking

### Product Tables (Migration 002)
- **products** - Main product information
- **product_images** - Product image gallery
- **product_attributes** - Product specifications
- **content_blocks** - CMS content blocks

### Customer Tables (Migration 003)
- **addresses** - Customer addresses
- **user_addresses** - User-address relationships
- **wishlists** - Customer wishlists
- **wishlist_items** - Wishlist items

### Commerce Tables (Migration 004)
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Order line items
- **payments** - Payment transactions

### Marketing Tables (Migration 005)
- **campaigns** - Marketing campaigns
- **marketing_campaigns** - Advanced campaign features
- **coupons** - Discount coupons
- **order_coupons** - Applied coupon tracking

### Review Tables (Migration 006)
- **product_reviews** - Customer product reviews

## 🚀 Available Commands

### Database Analysis
```bash
# Analyze current database structure
npm run db:analyze

# Generate fresh migrations from current database
npm run db:generate-migrations
```

### Schema Validation
```bash
# Validate current schema against migrations
npm run db:validate

# Repair schema issues automatically
npm run db:repair
```

### Migration Management
```bash
# Apply all pending migrations
npm run migrate:up

# Rollback last migration batch
npm run migrate:down

# Drop all tables and re-run all migrations (DESTRUCTIVE)
npm run migrate:fresh

# Rollback all migrations and re-run them
npm run migrate:reset
```

## 📁 File Structure

```
migrations/
├── 20251005_001_core_tables.sql              # Core tables creation
├── 20251005_001_core_tables_rollback.sql     # Core tables rollback
├── 20251005_002_product_tables.sql           # Product tables creation
├── 20251005_002_product_tables_rollback.sql  # Product tables rollback
├── 20251005_003_customer_tables.sql          # Customer tables creation
├── 20251005_003_customer_tables_rollback.sql # Customer tables rollback
├── 20251005_004_commerce_tables.sql          # Commerce tables creation
├── 20251005_004_commerce_tables_rollback.sql # Commerce tables rollback
├── 20251005_005_marketing_tables.sql         # Marketing tables creation
├── 20251005_005_marketing_tables_rollback.sql# Marketing tables rollback
├── 20251005_006_review_tables.sql            # Review tables creation
└── 20251005_006_review_tables_rollback.sql   # Review tables rollback

scripts/
├── analyze-database.js           # Database structure analysis
├── generate-fresh-migrations.js  # Migration generation
├── migrate.js                    # Migration runner
└── validate-schema.js            # Schema validation
```

## 🔄 Migration Process

### 1. Schema Analysis
The system first analyzes your current database to understand:
- All table structures
- Column definitions and types
- Indexes and constraints
- Foreign key relationships
- Data types and defaults

### 2. Migration Generation
Based on the analysis, the system generates:
- **Forward migrations** - Create tables and structures
- **Rollback migrations** - Remove tables and structures
- **Dependency-aware grouping** - Tables are grouped by dependency order

### 3. Schema Validation
Before applying migrations, the system:
- Compares current schema with expected schema
- Identifies missing/extra tables and columns
- Validates column types and constraints
- Provides detailed validation reports

### 4. Smart Migration Execution
The migration runner:
- Tracks executed migrations in `migrations` table
- Handles foreign key constraints properly
- Provides rollback capabilities
- Validates schema after execution

## 🛡️ Safety Features

### Cross-Check Validation
```bash
# The system automatically cross-checks schema consistency
npm run db:validate
```

When migrations are applied, the system:
1. **Compares** current schema with expected schema
2. **Identifies** discrepancies
3. **Skips** tables that already match the migration
4. **Recreates** tables that don't match (after dropping)
5. **Validates** final schema against expectations

### Rollback Protection
- All migrations have corresponding rollback files
- Foreign key constraints are properly handled
- Migration batching allows selective rollbacks
- Schema validation prevents inconsistent states

### Data Safety
- **Fresh migrations preserve existing data** where possible
- **Rollbacks are thoroughly tested** before execution
- **Schema validation prevents destructive operations** on valid schemas

## 🔧 Advanced Usage

### Custom Migration Creation
To create a new migration:

1. Make changes to your database
2. Run analysis and regeneration:
```bash
npm run db:analyze
npm run db:generate-migrations
```

### Schema Repair
If your schema becomes inconsistent:
```bash
# Identify issues
npm run db:validate

# Auto-repair (when possible)
npm run db:repair

# Manual fix with fresh migration
npm run migrate:fresh
```

### Production Deployment
For production environments:

1. **Backup your database** first
2. Run validation:
```bash
npm run db:validate
```
3. Apply migrations:
```bash
npm run migrate:up
```
4. Verify schema:
```bash
npm run db:validate
```

## 📊 Reports and Logging

### Database Analysis Report
Generated at: `scripts/database_analysis.json`
- Complete table structures
- Column definitions
- Index information
- Foreign key relationships
- Row counts

### Schema Validation Report
Generated at: `schema_validation_report.json`
- Validation status
- Issue details
- Recommendations
- Summary statistics

## 🚨 Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check `.env.local` database configuration
   - Ensure MySQL server is running
   - Verify database credentials

2. **Schema Mismatch**
   ```bash
   npm run db:validate
   npm run db:repair
   ```

3. **Migration Failures**
   - Check foreign key constraints
   - Verify table dependencies
   - Use rollback if needed:
   ```bash
   npm run migrate:down
   ```

4. **Fresh Installation**
   ```bash
   npm run migrate:fresh
   ```

### Best Practices

1. **Always backup before migrations**
2. **Test migrations in development first**
3. **Use validation before production deployment**
4. **Keep migration files in version control**
5. **Document custom schema changes**

## 🔧 Configuration

Database connection configured in `.env.local`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aynbeauty
DB_PORT=3306
```

## 📈 System Statistics

- **Total Tables**: 21
- **Total Columns**: 277
- **Total Indexes**: 92
- **Foreign Key Relationships**: 24
- **Migration Files**: 12 (6 forward + 6 rollback)
- **Supported Engines**: MySQL/MariaDB

---

This migration system ensures reliable, consistent, and safe database management for the AYN Beauty e-commerce platform. For additional support or custom migration needs, refer to the generated analysis reports and validation tools.