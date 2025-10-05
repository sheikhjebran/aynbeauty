#!/bin/bash

# AynBeauty Production Deployment Script
# Run this script on your BigRock server to deploy the application

echo "🚀 Starting AynBeauty Production Deployment..."

# Configuration
APP_DIR="/var/www/aynbeauty"
GIT_REPO="https://github.com/sheikhjebran/aynbeauty.git"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Step 1: System Updates and Dependencies"
# Update system packages
yum update -y

# Install required packages
yum install -y curl wget git

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verify installations
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js version: $node_version"
print_status "NPM version: $npm_version"

print_status "Step 2: Application Directory Setup"
# Create application directory
mkdir -p $APP_DIR
cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    print_status "Updating existing repository..."
    git pull origin main
else
    print_status "Cloning repository..."
    git clone $GIT_REPO .
fi

print_status "Step 3: Install Dependencies"
# Install Node.js dependencies
npm install --production

print_status "Step 4: Environment Configuration"
# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    print_warning "Creating .env.prod template..."
    cat > .env.prod << 'EOF'
# Production Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=aynbeauty_prod

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_production_jwt_key_change_this

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_change_this
NEXTAUTH_URL=https://yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
EOF
    print_warning "Please edit .env.prod with your actual configuration!"
    print_warning "File location: $APP_DIR/.env.prod"
else
    print_status ".env.prod file already exists"
fi

# Copy environment file
cp .env.prod .env.local

print_status "Step 5: Build Application"
# Build the Next.js application
npm run build

if [ $? -eq 0 ]; then
    print_status "Application built successfully!"
else
    print_error "Build failed! Check the errors above."
    exit 1
fi

print_status "Step 6: Set Permissions"
# Set proper ownership and permissions
chown -R apache:apache $APP_DIR
chmod -R 755 $APP_DIR
chmod 600 $APP_DIR/.env.local

print_status "Step 7: Process Management Setup"
# Install PM2 globally for process management
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'aynbeauty',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/aynbeauty',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/aynbeauty/error.log',
    out_file: '/var/log/aynbeauty/out.log',
    log_file: '/var/log/aynbeauty/combined.log'
  }]
}
EOF

# Create log directory
mkdir -p /var/log/aynbeauty
chown apache:apache /var/log/aynbeauty

print_status "Step 8: Configure Apache/Nginx (if needed)"
# Create Apache virtual host configuration
cat > /etc/httpd/conf.d/aynbeauty.conf << 'EOF'
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    ErrorLog /var/log/httpd/aynbeauty_error.log
    CustomLog /var/log/httpd/aynbeauty_access.log combined
</VirtualHost>
EOF

print_warning "Please update /etc/httpd/conf.d/aynbeauty.conf with your actual domain name"

print_status "Step 9: SSL Certificate Setup"
# Install Certbot for Let's Encrypt SSL
yum install -y certbot python3-certbot-apache

print_warning "Run this command to get SSL certificate:"
print_warning "certbot --apache -d yourdomain.com -d www.yourdomain.com"

print_status "Step 10: Start Services"
# Enable and start Apache
systemctl enable httpd
systemctl start httpd

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_status "Step 11: Firewall Configuration"
# Configure firewall
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

print_status "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit $APP_DIR/.env.prod with your database credentials"
echo "2. Run the database migration: bash $APP_DIR/migrate-database.sh"
echo "3. Update Apache config with your domain: /etc/httpd/conf.d/aynbeauty.conf"
echo "4. Get SSL certificate: certbot --apache -d yourdomain.com"
echo "5. Restart services: systemctl restart httpd && pm2 restart aynbeauty"
echo ""
echo "🔧 Useful Commands:"
echo "- View logs: pm2 logs aynbeauty"
echo "- Restart app: pm2 restart aynbeauty"
echo "- Check status: pm2 status"
echo "- Update app: cd $APP_DIR && git pull && npm install && npm run build && pm2 restart aynbeauty"
echo ""
echo "🌐 Your application should be available at:"
echo "- http://yourdomain.com (replace with your actual domain)"
echo "- Admin panel: http://yourdomain.com/admin"
echo ""
print_warning "Remember to change default admin password: admin@aynbeauty.com / admin123"