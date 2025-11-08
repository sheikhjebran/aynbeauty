# AynBeauty - E-commerce Beauty Platform

A modern, full-featured e-commerce platform built with Next.js 14, specializing in beauty and skincare products. Features include product browsing, advanced filtering, shopping cart, user authentication, admin panel, and comprehensive product management.

## 🔍 Deployment Features Verification

### ✅ Current Production Configuration

| Feature | Status | Details |
|---------|--------|---------|
| Upload Limit | ✅ 100MB | Configured in Nginx & app |
| Image Backup | ✅ Automatic | Timestamped backups before deploy |
| Image Restore | ✅ Automatic | Restored after build completion |
| PM2 Management | ✅ Configured | Auto-restart, memory limit 500MB |
| Health Checks | ✅ Active | Every 30 seconds, 5 retries |
| Graceful Shutdown | ✅ Enabled | 30-second timeout |
| Error Handling | ✅ Enhanced | Early exit, better diagnostics |
| CI/CD Pipeline | ✅ GitHub Actions | Automated on push to main |
| Zero-Downtime | ✅ Capable | Graceful restart |
| Database Migrations | ✅ Supported | Automatic if migration file exists |

### Deployment Flow

```
1. Push code to main branch
   ↓
2. GitHub Actions triggered automatically
   ↓
3. Code checkout & build on GitHub runners
   ↓
4. SSH to server: 66.116.199.206
   ↓
5. Backup product images (timestamped)
   ↓
6. Graceful PM2 stop (30s timeout)
   ↓
7. Pull latest code & dependencies
   ↓
8. Build Next.js application
   ↓
9. Restore product images from backup
   ↓
10. Run database migrations (if any)
   ↓
11. Set proper file permissions
   ↓
12. Start/restart PM2 application
   ↓
13. Health check verification (5 retries)
   ↓
14. Deployment complete! ✅
```

**Total Deployment Time**: 5-6 minutes with zero downtime

## 🔍 Deployment Features Verification

- **Modern UI/UX**: Responsive design with Tailwind CSS
- **Product Management**: Complete CRUD operations for products
- **Advanced Filtering**: Search, sort, and filter by price, rating, brand, category
- **Shopping Cart**: Full cart functionality with session management
- **Guest Checkout**: Anonymous user checkout with WhatsApp integration
- **User Authentication**: Secure login/register system with JWT
- **Admin Panel**: Product inventory management and order tracking
- **Large File Uploads**: Support for product images up to 100MB
- **Payment Integration**: Ready for payment gateway integration
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Production Deployment**: Automated CI/CD with GitHub Actions, PM2 management, image backup/restore

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL
- **Authentication**: JWT tokens
- **Images**: Next.js Image optimization
- **Icons**: Heroicons

## ✨ Latest Updates (November 2025)

### Recent Improvements
- **Upload Size Increased**: Product image uploads now support files up to 100MB (previously 1MB)
- **Nginx Configuration**: Enhanced with optimized buffer sizes and timeouts for large file handling
- **Production Deployment**: Automated deployment pipeline with GitHub Actions
- **PM2 Process Manager**: Production-ready PM2 ecosystem configuration with:
  - Auto-restart on crashes (500MB memory limit)
  - Health checks every 30 seconds
  - 30-second graceful shutdown
  - Comprehensive logging
- **Image Backup System**: Automatic backup and restore of product images during deployment
- **Guest Checkout**: Anonymous user checkout infrastructure (code ready for UI integration)
- **Zero-Downtime Deployment**: Graceful shutdown and restart capability

### Deploy Configuration
The project includes production-ready deployment configuration:
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline
- `ecosystem.config.js` - PM2 process manager configuration
- Automated image backup/restore on every deployment
- Health check verification with 5 retries
- Database migration support

## 📦 Local Development Setup

### Prerequisites

- Node.js 18+ installed
- MySQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sheikhjebran/aynbeauty.git
   cd aynbeauty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=aynbeauty_db
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**
   Run the database schema creation script:
   ```bash
   node create-database-schema.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 🚀 Production Deployment with GitHub Actions & PM2

### Automated Deployment Pipeline

The project uses GitHub Actions for automated deployment. Every push to the `main` branch triggers:

1. **Code Checkout** - Latest code from repository
2. **Dependencies Installation** - npm ci for production
3. **Build** - Next.js application build
4. **Image Backup** - Automatic backup of product images with timestamp
5. **Graceful Stop** - PM2 graceful shutdown (30s timeout)
6. **Code Update** - Pull latest changes from main
7. **Environment Setup** - Configure production environment
8. **Database Migration** - Run any pending migrations
9. **Image Restore** - Restore product images from backup
10. **PM2 Restart** - Start/restart application with PM2
11. **Health Check** - Verify application is healthy (5 retries)

### Server Requirements

```
- Node.js 18+
- MySQL Database
- PM2 installed globally
- Nginx reverse proxy
- GitHub account with repository secrets
- SSH access to server
```

### GitHub Actions Configuration

Set the following secrets in your GitHub repository:

```
HOST              - Your server IP address
USERNAME          - SSH username (usually 'root')
PASSWORD          - SSH password
DB_USER           - Database username
DB_PASSWORD       - Database password
DB_NAME           - Database name
```

### PM2 Configuration (ecosystem.config.js)

```javascript
module.exports = {
  apps: [
    {
      name: "aynbeauty",
      script: "./node_modules/.bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // ... rest of PM2 config
    },
  ],
};
```

### Nginx Configuration

The server uses Nginx as a reverse proxy with support for large file uploads:

```nginx
server {
    server_name yourdomain.com;
    
    # Allow file uploads up to 100MB
    client_max_body_size 100m;
    client_body_timeout 120s;
    proxy_read_timeout 120s;
    proxy_connect_timeout 120s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Manual Deployment Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs aynbeauty

# Restart application
pm2 restart aynbeauty

# Stop application
pm2 stop aynbeauty

# Check health
curl http://localhost:3000/api/health

# View backups
ls -lh /var/backups/aynbeauty/
```

## 🚀 Production Deployment on BigRock Hosting

### Step 1: Server Requirements

Ensure your BigRock hosting plan includes:
- **Node.js Support** (Version 18+ recommended)
- **MySQL Database** access
- **SSH Access** (for deployment)
- **SSL Certificate** (for HTTPS)
- **Domain Name** configured

### Step 2: Database Setup on BigRock

#### 2.1 Create MySQL Database

1. **Login to BigRock cPanel**
   - Access your BigRock hosting control panel
   - Navigate to "MySQL Databases"

2. **Create Database**
   ```
   Database Name: [username]_aynbeauty
   ```

3. **Create Database User**
   ```
   Username: [username]_aynuser
   Password: [secure_password]
   ```

4. **Grant Privileges**
   - Grant ALL PRIVILEGES to the user for the database

#### 2.2 Database Schema Migration

1. **Access MySQL via phpMyAdmin or SSH**

2. **Execute Database Schema Creation**
   Run the following SQL commands in order:

   ```sql
   -- Create Users Table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     phone VARCHAR(20),
     date_of_birth DATE,
     gender ENUM('male', 'female', 'other'),
     role ENUM('customer', 'admin') DEFAULT 'customer',
     email_verified BOOLEAN DEFAULT FALSE,
     profile_image VARCHAR(500),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Create Categories Table
   CREATE TABLE categories (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     slug VARCHAR(100) UNIQUE NOT NULL,
     description TEXT,
     image VARCHAR(500),
     parent_id INT,
     sort_order INT DEFAULT 0,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
   );

   -- Create Brands Table
   CREATE TABLE brands (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     slug VARCHAR(100) UNIQUE NOT NULL,
     description TEXT,
     logo VARCHAR(500),
     banner_image VARCHAR(500),
     website_url VARCHAR(255),
     is_featured BOOLEAN DEFAULT FALSE,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Create Products Table
   CREATE TABLE products (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     slug VARCHAR(255) UNIQUE NOT NULL,
     description TEXT,
     short_description VARCHAR(500),
     sku VARCHAR(100) UNIQUE NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     compare_price DECIMAL(10,2),
     cost_price DECIMAL(10,2),
     discounted_price DECIMAL(10,2),
     brand_id INT,
     category_id INT,
     stock_quantity INT DEFAULT 0,
     low_stock_threshold INT DEFAULT 5,
     weight DECIMAL(8,2),
     dimensions VARCHAR(100),
     is_featured BOOLEAN DEFAULT FALSE,
     is_bestseller BOOLEAN DEFAULT FALSE,
     is_new BOOLEAN DEFAULT FALSE,
     is_trending BOOLEAN DEFAULT FALSE,
     is_must_have BOOLEAN DEFAULT FALSE,
     is_new_arrival BOOLEAN DEFAULT FALSE,
     status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
     seo_title VARCHAR(255),
     seo_description TEXT,
     image_url VARCHAR(500),
     primary_image VARCHAR(500),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
     FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
   );

   -- Create Product Images Table
   CREATE TABLE product_images (
     id INT AUTO_INCREMENT PRIMARY KEY,
     product_id INT NOT NULL,
     image_url VARCHAR(500) NOT NULL,
     alt_text VARCHAR(255),
     is_primary BOOLEAN DEFAULT FALSE,
     sort_order INT DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
   );

   -- Create Product Reviews Table
   CREATE TABLE product_reviews (
     id INT AUTO_INCREMENT PRIMARY KEY,
     product_id INT NOT NULL,
     user_id INT NOT NULL,
     order_id INT,
     rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
     title VARCHAR(255),
     comment TEXT,
     is_verified BOOLEAN DEFAULT FALSE,
     is_approved BOOLEAN DEFAULT FALSE,
     helpful_count INT DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );

   -- Create Cart Items Table
   CREATE TABLE cart_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     session_id VARCHAR(255),
     product_id INT NOT NULL,
     quantity INT NOT NULL DEFAULT 1,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
   );

   -- Create Orders Table
   CREATE TABLE orders (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     order_number VARCHAR(50) UNIQUE NOT NULL,
     status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
     total_amount DECIMAL(10,2) NOT NULL,
     subtotal DECIMAL(10,2) NOT NULL,
     tax_amount DECIMAL(10,2) DEFAULT 0,
     shipping_amount DECIMAL(10,2) DEFAULT 0,
     discount_amount DECIMAL(10,2) DEFAULT 0,
     payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
     payment_method VARCHAR(50),
     shipping_address JSON,
     billing_address JSON,
     notes TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
   );

   -- Create Order Items Table
   CREATE TABLE order_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     order_id INT NOT NULL,
     product_id INT NOT NULL,
     quantity INT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     total DECIMAL(10,2) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
   );

   -- Create Indexes for Performance
   CREATE INDEX idx_products_category ON products(category_id);
   CREATE INDEX idx_products_brand ON products(brand_id);
   CREATE INDEX idx_products_status ON products(status);
   CREATE INDEX idx_products_featured ON products(is_featured);
   CREATE INDEX idx_cart_user ON cart_items(user_id);
   CREATE INDEX idx_cart_session ON cart_items(session_id);
   CREATE INDEX idx_orders_user ON orders(user_id);
   CREATE INDEX idx_orders_status ON orders(status);
   ```

3. **Insert Sample Data (Optional)**
   ```sql
   -- Insert Sample Categories
   INSERT INTO categories (name, slug, description, is_active) VALUES
   ('Skincare', 'skincare', 'Premium skincare products for all skin types', TRUE),
   ('Makeup', 'makeup', 'Professional makeup and cosmetics', TRUE),
   ('Fragrance', 'fragrance', 'Luxury fragrances and perfumes', TRUE),
   ('Hair Care', 'hair-care', 'Hair care and styling products', TRUE);

   -- Insert Sample Brands
   INSERT INTO brands (name, slug, description, is_featured, is_active) VALUES
   ('Ayn Beauty', 'ayn-beauty', 'Premium beauty brand', TRUE, TRUE),
   ('Luxury Cosmetics', 'luxury-cosmetics', 'High-end cosmetic products', TRUE, TRUE);

   -- Create Admin User (Password: admin123)
   INSERT INTO users (email, password, first_name, last_name, role, email_verified) VALUES
   ('admin@aynbeauty.com', '$2b$10$rH8Qg5Z1nJ9Y3wX2vK4tO.1qJ5G3H7L9K4N8M6P2R5T8W0Y3X6Z1A4', 'Admin', 'User', 'admin', TRUE);
   ```

### Step 3: Application Deployment

#### 3.1 Prepare Production Files

1. **Update Environment Variables**
   Create `.env.production` file:
   ```env
   # Production Database Configuration
   DB_HOST=your_bigrock_mysql_host
   DB_USER=your_database_username
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   
   # JWT Secret (Generate a strong secret)
   JWT_SECRET=your_production_jwt_secret_key
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your_production_nextauth_secret
   NEXTAUTH_URL=https://yourdomain.com
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

#### 3.2 Upload to BigRock Server

**Option A: Using cPanel File Manager**
1. Login to BigRock cPanel
2. Open File Manager
3. Navigate to `public_html` directory
4. Upload the entire project or use Git deployment

**Option B: Using SSH (Recommended)**
1. **Connect via SSH**
   ```bash
   ssh username@yourdomain.com
   ```

2. **Clone Repository**
   ```bash
   cd public_html
   git clone https://github.com/sheikhjebran/aynbeauty.git .
   ```

3. **Install Dependencies**
   ```bash
   npm install --production
   ```

4. **Set Environment Variables**
   ```bash
   cp .env.production .env.local
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

#### 3.3 Configure Node.js on BigRock

1. **Create .htaccess file** (if needed)
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
   ```

2. **Configure Node.js Application**
   - Go to BigRock cPanel
   - Find "Node.js" section
   - Add new application:
     - Node.js Version: 18+
     - Application Mode: Production
     - Application Root: public_html
     - Application URL: yourdomain.com
     - Startup File: server.js or package.json

3. **Create server.js** (if required)
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const hostname = 'localhost'
   const port = process.env.PORT || 3000

   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true)
         await handle(req, res, parsedUrl)
       } catch (err) {
         console.error('Error occurred handling', req.url, err)
         res.statusCode = 500
         res.end('internal server error')
       }
     }).listen(port, (err) => {
       if (err) throw err
       console.log(`> Ready on http://${hostname}:${port}`)
     })
   })
   ```

### Step 4: Domain and SSL Configuration

1. **Point Domain to Server**
   - Configure DNS settings to point to BigRock server IP
   - Update A records and CNAME if needed

2. **Enable SSL Certificate**
   - Use BigRock's free SSL or upload custom SSL
   - Enable HTTPS redirect

3. **Update Application URLs**
   - Ensure all internal links use HTTPS
   - Update API endpoints if needed

### Step 5: Testing and Monitoring

1. **Test Core Functionality**
   - Homepage loading
   - Product browsing and filtering
   - User registration/login
   - Shopping cart functionality
   - Admin panel access

2. **Performance Optimization**
   ```bash
   # Enable compression
   npm install compression
   
   # Optimize images
   # Configure Next.js image optimization
   ```

3. **Set Up Monitoring**
   - Configure error logging
   - Set up uptime monitoring
   - Monitor database performance

### Step 6: Maintenance Scripts

Create maintenance scripts in `scripts/` directory:

**backup-database.sh**
```bash
#!/bin/bash
mysqldump -u [username] -p[password] [database_name] > backup_$(date +%Y%m%d_%H%M%S).sql
```

**update-deployment.sh**
```bash
#!/bin/bash
git pull origin main
npm install --production
npm run build
pm2 restart aynbeauty
```

## 🔧 Environment Variables Reference

```env
# Database
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=aynbeauty_db

# Authentication
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
PORT=3000
```

## 📊 Database Management

### Backup Database
```bash
mysqldump -u username -p database_name > aynbeauty_backup.sql
```

### Restore Database
```bash
mysql -u username -p database_name < aynbeauty_backup.sql
```

### Common Database Operations
```sql
-- Add new product
INSERT INTO products (name, slug, description, price, category_id, stock_quantity) 
VALUES ('Product Name', 'product-slug', 'Description', 999.99, 1, 100);

-- Update product stock
UPDATE products SET stock_quantity = 50 WHERE id = 1;

-- Get top selling products
SELECT p.name, SUM(oi.quantity) as total_sold 
FROM products p 
JOIN order_items oi ON p.id = oi.product_id 
GROUP BY p.id 
ORDER BY total_sold DESC;
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify credentials in `.env.local`
   - Check MySQL service status
   - Ensure database exists and user has privileges

2. **Build Fails**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   chmod -R 755 public_html/
   chown -R username:username public_html/
   ```

4. **Node.js Memory Issues**
   ```bash
   # Increase memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

## 📞 Support

For deployment issues or questions:
- Check BigRock documentation
- Contact BigRock support for server-specific issues
- GitHub Issues: https://github.com/sheikhjebran/aynbeauty/issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: Replace placeholder values (usernames, passwords, domains) with your actual BigRock hosting details before deployment.

