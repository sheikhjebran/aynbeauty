#!/bin/bash

# AynBeauty Production Deployment Script for BigRock Server
# Run this script on your BigRock server to deploy the application

set -e  # Exit on any error

echo "🚀 Starting AynBeauty Production Deployment"
echo "============================================"

# Configuration
APP_NAME="aynbeauty"
APP_DIR="/var/www/html/aynbeauty"
BACKUP_DIR="/home/backups"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    print_warning "Running as root. Consider using a non-root user for deployment."
fi

# Step 1: Create backup directory
print_status "Creating backup directory..."
mkdir -p $BACKUP_DIR
print_success "Backup directory ready"

# Step 2: Backup existing application (if it exists)
if [ -d "$APP_DIR" ]; then
    print_status "Backing up existing application..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_DIR/aynbeauty_backup_$TIMESTAMP.tar.gz" -C "$APP_DIR" . 2>/dev/null || true
    print_success "Backup created at $BACKUP_DIR/aynbeauty_backup_$TIMESTAMP.tar.gz"
fi

# Step 3: Create application directory
print_status "Setting up application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Step 4: Check Node.js version
print_status "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_CURRENT=$(node -v | sed 's/v//')
    print_success "Node.js $NODE_CURRENT is installed"
else
    print_error "Node.js is not installed. Please install Node.js $NODE_VERSION or higher"
    exit 1
fi

# Step 5: Check if this is an update or fresh install
if [ -f "package.json" ]; then
    print_status "Updating existing installation..."
    
    # Stop PM2 process if running
    if command -v pm2 &> /dev/null; then
        pm2 stop $APP_NAME 2>/dev/null || true
        print_success "Stopped existing PM2 process"
    fi
    
    # Pull latest changes (if this is a git repository)
    if [ -d ".git" ]; then
        print_status "Pulling latest changes from repository..."
        git pull origin main || git pull origin master
        print_success "Repository updated"
    else
        print_warning "Not a git repository. Please manually upload your built application files."
        print_warning "Upload the entire built project to: $APP_DIR"
        print_warning "Make sure to include: .next/, package.json, package-lock.json, public/"
        echo ""
        echo "Press Enter when you have uploaded the files..."
        read
    fi
else
    print_status "Fresh installation detected..."
    print_warning "Please upload your built application files to: $APP_DIR"
    print_warning "Required files: .next/, package.json, package-lock.json, public/, src/"
    echo ""
    echo "Press Enter when you have uploaded the files..."
    read
fi

# Step 6: Install/Update dependencies
if [ -f "package.json" ]; then
    print_status "Installing dependencies..."
    npm ci --production
    print_success "Dependencies installed"
else
    print_error "package.json not found. Please ensure your application files are uploaded."
    exit 1
fi

# Step 7: Set up environment file
print_status "Setting up environment configuration..."
if [ ! -f ".env.production" ]; then
    print_warning "Creating .env.production file..."
    

# Step 8: Run database migration
print_status "Setting up database..."
if [ -f "deploy-production-db.sql" ]; then
    print_status "Found database migration script. Running migration..."
    
    # Extract database credentials from .env.production
    DB_USER=$(grep "^DB_USER=" .env.production | cut -d '=' -f2 | tr -d '"')
    DB_PASSWORD=$(grep "^DB_PASSWORD=" .env.production | cut -d '=' -f2 | tr -d '"')
    DB_NAME=$(grep "^DB_NAME=" .env.production | cut -d '=' -f2 | tr -d '"')
    
    if [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ] && [ -n "$DB_NAME" ]; then
        print_status "Running database migration..."
        mysql -u "$DB_USER" -p"$DB_PASSWORD" < deploy-production-db.sql
        print_success "Database migration completed"
    else
        print_warning "Database credentials not found in .env.production"
        print_warning "Please run the database migration manually:"
        print_warning "mysql -u username -p < deploy-production-db.sql"
    fi
else
    print_warning "Database migration script not found"
    print_warning "Please run database setup manually with your SQL files"
fi

# Step 9: Build the application (if source files are present)
if [ -d "src" ] && [ ! -d ".next" ]; then
    print_status "Building application for production..."
    npm run build
    print_success "Application built successfully"
fi

# Step 10: Set up PM2 configuration
print_status "Setting up PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'aynbeauty',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/html/aynbeauty',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/aynbeauty-error.log',
    out_file: '/var/log/pm2/aynbeauty-out.log',
    log_file: '/var/log/pm2/aynbeauty.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
}
EOF

# Create PM2 log directory
mkdir -p /var/log/pm2

print_success "PM2 configuration created"

# Step 11: Set proper permissions
print_status "Setting file permissions..."
chown -R www-data:www-data $APP_DIR 2>/dev/null || chown -R $(whoami):$(whoami) $APP_DIR
chmod -R 755 $APP_DIR
print_success "Permissions set"

# Step 12: Start with PM2
print_status "Starting application with PM2..."
if command -v pm2 &> /dev/null; then
    # Delete existing process if exists
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    print_success "Application started with PM2"
    
    # Show status
    echo ""
    print_status "Application Status:"
    pm2 status
    
else
    print_error "PM2 is not installed. Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
    
    # Start the application
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    print_success "Application started with PM2"
fi

# Step 13: Display final information
echo ""
echo "🎉 Deployment completed successfully!"
echo "====================================="
echo ""
print_success "Application: AynBeauty"
print_success "Status: Running on PM2"
print_success "Port: 3000"
print_success "Directory: $APP_DIR"
echo ""
print_status "Next steps:"
echo "1. Configure your web server (Apache/Nginx) to proxy to port 3000"
echo "2. Set up SSL certificate for HTTPS"
echo "3. Configure your domain DNS to point to this server"
echo "4. Test the application: http://your-server-ip:3000"
echo ""
print_status "Useful commands:"
echo "• Check app status: pm2 status"
echo "• View logs: pm2 logs aynbeauty"
echo "• Restart app: pm2 restart aynbeauty"
echo "• Stop app: pm2 stop aynbeauty"
echo ""
print_warning "Remember to:"
echo "• Update .env.production with correct database credentials"
echo "• Set up your domain SSL certificate"
echo "• Configure your web server reverse proxy"
echo ""
echo "🚀 AynBeauty is now deployed and running!"