# 🗄️ Database Migration Guide

## Overview
This guide shows how to use the proper migration system with your existing migration files in `database/migrations/`.

## 🚀 Available Migrations

Your project has the following migrations:
```
database/migrations/
├── 20241001000001_create_core_tables.sql
├── 20241001000002_create_ecommerce_tables.sql  
├── 20241001000003_insert_sample_data.sql
├── 20251001094852_create_campaigns_tables.sql
├── 20251001095103_insert_sample_campaigns.sql
├── 20251004000619_update_users_for_auth.sql
├── 20251004001314_add_email_verified_column.sql
└── 20251004002105_add_phone_column.sql
```

Each `.sql` file has a corresponding `.rollback.sql` file for rollbacks.

## 📋 Migration Commands

### Run All Pending Migrations
```bash
npm run migrate:up
```

### Check Migration Status  
```bash
npm run migrate:check
```

### Rollback Last Migration
```bash
npm run migrate:down
```

## 🔧 How It Works

### Migration Tracking
- Creates a `migrations` table to track executed migrations
- Only runs migrations that haven't been executed yet
- Migrations are run in chronological order (by filename timestamp)

### Migration Process
1. **Connects** to your database using `.env.local` credentials
2. **Creates** migrations tracking table if it doesn't exist
3. **Checks** which migrations have already been executed
4. **Runs** only the pending migrations in order
5. **Records** each successful migration in the tracking table

### Rollback Process
- Uses the corresponding `.rollback.sql` file
- Removes the migration record from tracking table
- Only rolls back the last executed migration

## 🚀 Server Deployment Steps

### 1. Prepare Environment
```bash
# Copy environment file
cp .env.production .env.local

# Make sure DB_NAME is correct (should be 'aynbeauty', not a connection string)
nano .env.local
```

### 2. Create Database (if needed)
```bash
# As root user
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS aynbeauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'localhost'; FLUSH PRIVILEGES;"
```

### 3. Run Migrations
```bash
# Check current status
npm run migrate:check

# Run all pending migrations
npm run migrate:up
```

## 📊 Expected Output

### Migration Status Check:
```
📊 Migration Status
==================

Executed migrations:
   (none)

Pending migrations:
   ⏳ 20241001000001_create_core_tables.sql
   ⏳ 20241001000002_create_ecommerce_tables.sql
   ⏳ 20241001000003_insert_sample_data.sql
   ⏳ 20251001094852_create_campaigns_tables.sql
   ⏳ 20251001095103_insert_sample_campaigns.sql
   ⏳ 20251004000619_update_users_for_auth.sql
   ⏳ 20251004001314_add_email_verified_column.sql
   ⏳ 20251004002105_add_phone_column.sql

Total: 8 migrations, 0 executed, 8 pending
```

### Running Migrations:
```
🚀 Starting Database Migrations
===============================

🔌 Connecting to MySQL database...
   Host: 127.0.0.1:3306
   Database: aynbeauty
   User: ayn
✅ Connected to MySQL successfully
📋 Setting up migrations tracking table...
✅ Migrations table ready

📊 Migration Status:
   Total migrations: 8
   Executed: 0
   Pending: 8

🚀 Executing pending migrations...

📄 Executing migration: 20241001000001_create_core_tables.sql
✅ 20241001000001_create_core_tables.sql: 15 statements executed, 0 warnings
📄 Executing migration: 20241001000002_create_ecommerce_tables.sql
✅ 20241001000002_create_ecommerce_tables.sql: 12 statements executed, 0 warnings
...

🎉 Migrations completed successfully!
===================================
⏱️  Duration: 2.34 seconds
📊 Executed: 8 migrations
📝 Statements: 89 executed
🗄️  Database: aynbeauty

✅ Your database is now up to date!
```

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check credentials in .env.local
cat .env.local | grep DB_

# Test connection manually
mysql -u ayn -p -h 127.0.0.1 aynbeauty -e "SHOW TABLES;"
```

### Permission Errors
```bash
# Grant proper permissions as root
mysql -u root -p -e "GRANT ALL PRIVILEGES ON aynbeauty.* TO 'ayn'@'localhost'; FLUSH PRIVILEGES;"
```

### Migration Errors
```bash
# Check migration status to see what failed
npm run migrate:check

# Rollback last migration if needed
npm run migrate:down

# Fix the issue and try again
npm run migrate:up
```

## ✅ Advantages of This System

### vs. Single SQL File:
- ✅ **Incremental updates** - only runs new migrations
- ✅ **Rollback support** - can undo changes
- ✅ **Version tracking** - knows what's been applied
- ✅ **Team collaboration** - multiple developers can add migrations
- ✅ **Production safety** - won't re-run existing migrations

### vs. Manual SQL:
- ✅ **Automated** - no manual file tracking
- ✅ **Consistent** - same process every time
- ✅ **Safe** - built-in error handling
- ✅ **Auditable** - tracks what was run when

## 🎯 Production Deployment

```bash
# 1. Upload your project files to server
# 2. Set up environment
cp .env.production .env.local

# 3. Create database (if needed)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS aynbeauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Run migrations
npm run migrate:up

# 5. Start your application
npm run build
npm start
```

**Your database will be set up exactly as intended with proper migration tracking! 🚀**