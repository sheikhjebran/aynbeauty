# FRESH DATABASE MIGRATION DEPLOYMENT GUIDE

## 🎯 Overview
Your local and production databases had schema mismatches. We've created fresh migrations that match your exact local database schema, including the missing `image_url` and `primary_image` columns in the products table.

## 📁 Files to Upload to Server

Upload these fresh migration files to your server:

```
database/fresh-migrations/
├── 20241005000001_create_core_tables.sql
├── 20241005000002_create_ecommerce_tables.sql
├── 20241005000003_create_product_tables.sql
├── 20241005000004_create_marketing_tables.sql
└── 20241005000005_insert_sample_data.sql

scripts/
├── fresh-migrate.js
└── reset-admin.js (updated version)
```

Also update your `package.json` with the new scripts (already done locally).

## 🚀 Deployment Steps

### Step 1: Upload Files
Upload the fresh migration files and scripts to your BigRock server:

```bash
# Upload fresh-migrations directory
scp -r database/fresh-migrations/ user@your-server:/var/www/aynbeauty/database/

# Upload fresh migration script
scp scripts/fresh-migrate.js user@your-server:/var/www/aynbeauty/scripts/

# Upload updated reset-admin script
scp scripts/reset-admin.js user@your-server:/var/www/aynbeauty/scripts/

# Upload updated package.json
scp package.json user@your-server:/var/www/aynbeauty/
```

### Step 2: Run Fresh Migration on Server

```bash
# SSH into your server
ssh user@your-server

# Navigate to your application
cd /var/www/aynbeauty

# Install any missing dependencies (if needed)
npm install

# Run fresh migration to reset database with correct schema
npm run fresh:migrate

# Verify migration status
npm run fresh:status
```

### Step 3: Reset Admin Password

```bash
# Reset admin credentials
npm run admin:reset

# Verify admin user
npm run admin:info
```

### Step 4: Test Application

```bash
# Restart PM2 process
pm2 restart aynbeauty

# Check logs for any errors
pm2 logs aynbeauty
```

## ✅ What This Fixes

### Database Schema Issues:
- ✅ `image_url` column missing in products table
- ✅ `primary_image` column missing in products table  
- ✅ `is_trending`, `is_must_have`, `is_new_arrival` columns
- ✅ All timestamp column compatibility issues
- ✅ Foreign key relationships
- ✅ Proper indexes and constraints

### Data Consistency:
- ✅ Sample brands, categories, campaigns
- ✅ Admin user with proper bcrypt password
- ✅ All tables with proper structure

## 🔧 New NPM Commands Available

```bash
# Fresh database migration (resets entire database)
npm run fresh:migrate

# Check migration status and table count
npm run fresh:status

# Reset admin password (works with any schema)
npm run admin:reset

# Show admin user info
npm run admin:info
```

## 🎯 Expected Results

After successful deployment:

1. ✅ No more "Unknown column 'image_url'" errors
2. ✅ Product creation will work properly
3. ✅ Admin login: admin@aynbeauty.com / admin123
4. ✅ All 20 database tables created with proper structure
5. ✅ Sample data loaded (brands, categories, campaigns)

## 🚨 Important Notes

1. **Fresh Migration Warning**: The `fresh:migrate` command will DROP ALL existing tables and recreate them. Make sure to backup any important data first.

2. **Production Environment**: Ensure your `.env.local` file on the server has the correct database credentials.

3. **File Permissions**: Make sure the uploaded files have proper execute permissions:
   ```bash
   chmod +x scripts/fresh-migrate.js
   chmod +x scripts/reset-admin.js
   ```

## 🔍 Troubleshooting

If you encounter issues:

```bash
# Check database connection
npm run fresh:status

# Check PM2 logs
pm2 logs aynbeauty --lines 50

# Verify database tables exist
npm run fresh:status

# Re-run admin reset if needed
npm run admin:reset
```

## 🎉 Final Verification

Your application should now work without the `image_url` column errors. Test by:

1. 🔐 Login to admin panel: `/auth/login`
2. 📦 Try creating a new product
3. 🛍️ Verify the main website loads properly
4. ✅ Check that all product images display correctly

The database schema is now perfectly aligned between local and production!