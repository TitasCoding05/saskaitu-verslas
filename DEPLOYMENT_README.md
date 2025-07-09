# Deployment Guide for Saskaituverslas on Ubuntu VPS

## Prerequisites
- Ubuntu Server (22.04 LTS or newer)
- Root or sudo access to the server
- Basic understanding of Linux command line

## Deployment Steps

### 1. Prepare the Server
1. Connect to your VPS via SSH:
```bash
ssh root@45.9.191.70
```

2. Run the deployment script:
```bash
chmod +x deploy_to_vps.sh
./deploy_to_vps.sh
```

### 2. Manual Configuration Steps

#### Database Setup
- Verify PostgreSQL database creation
- Manually set strong passwords
- Configure database access rights

#### Environment Configuration
Replace placeholders in `.env` file:
- `NEXTAUTH_SECRET`: Generate a secure random string
- `NEXTAUTH_URL`: Set to your actual domain
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Obtain from Google Developer Console
- `OPENAI_API_KEY`: Use your OpenAI API key

#### SSL/TLS Configuration
- Recommended: Use Certbot to enable HTTPS
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 3. Security Recommendations
- Disable root SSH login
- Configure firewall (UFW)
- Regularly update system and dependencies
- Use strong, unique passwords
- Implement fail2ban for additional security

### 4. Monitoring and Maintenance
- Use PM2 for process management
- Monitor logs: `pm2 logs saskaituverslas`
- Update application: 
  1. Pull latest code
  2. Run `npm install`
  3. Run `npx prisma generate`
  4. Rebuild: `npm run build`
  5. Restart: `pm2 restart saskaituverslas`

### Troubleshooting
- Check Nginx logs: `/var/log/nginx/error.log`
- Check application logs: `pm2 logs saskaituverslas`
- Verify environment variables
- Ensure all dependencies are installed

## Important Notes
- This script assumes a fresh Ubuntu server
- Customize according to your specific requirements
- Always test in a staging environment first