# GitHub Actions Deployment Setup

## Required Secrets

To use the GitHub Actions deployment workflow, you need to set up the following secrets in your GitHub repository:

### Setting up Secrets

1. Go to your GitHub repository: `https://github.com/sheikhjebran/aynbeauty`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** for each of the following:

### Required Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `HOST` | Server IP address | `66.116.199.206` |
| `USERNAME` | SSH username | `admin` |
| `PASSWORD` | SSH password | `your_ssh_password` |
| `DB_USER` | Database username | `aynbeauty_user` |
| `DB_PASSWORD` | Database password | `your_db_password` |
| `DB_NAME` | Database name | `aynbeauty_db` |

### How to Add Secrets

1. **HOST**
   - Name: `HOST`
   - Secret: `66.116.199.206`

2. **USERNAME**
   - Name: `USERNAME`
   - Secret: `admin` (or your SSH username)

3. **PASSWORD**
   - Name: `PASSWORD`
   - Secret: Your SSH password

4. **DB_USER**
   - Name: `DB_USER`
   - Secret: Your MySQL username

5. **DB_PASSWORD**
   - Name: `DB_PASSWORD`
   - Secret: Your MySQL password

6. **DB_NAME**
   - Name: `DB_NAME`
   - Secret: `aynbeauty_db` (or your database name)

## Manual Deployment Alternative

If you prefer manual deployment, use the updated `deploy-auto.sh` script:

```bash
# SSH to your server
ssh admin@66.116.199.206

# Navigate to project directory
cd /var/www/aynbeauty

# Run the deployment script
chmod +x deploy-auto.sh
./deploy-auto.sh
```

## Deployment Features

✅ **Automatic environment setup** (copies `.env.prod` to `.env.local`)  
✅ **Dependency installation** with npm ci  
✅ **Production build** with optimizations  
✅ **Database migration** (if files exist)  
✅ **Permission management** for uploads directory  
✅ **Health checks** to verify deployment  
✅ **Graceful restart** with PM2  

## Triggering Deployment

### Automatic (GitHub Actions)

- Push to `main` branch triggers automatic deployment
- Manual trigger via GitHub Actions tab

### Manual

- Run `./deploy-auto.sh` on the server
- Or follow individual steps in `DEPLOYMENT_GUIDE.md`

## Monitoring

After deployment, check:

- Application status: `pm2 status`
- Application logs: `pm2 logs aynbeauty`
- Health check: `http://66.116.199.206:3000/api/health`
- Image test: `http://66.116.199.206:3000/api/test/images`