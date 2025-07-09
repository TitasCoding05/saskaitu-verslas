#!/bin/bash
set -e

# Deployment script for Ubuntu VPS

# Update and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git postgresql postgresql-contrib nginx

# Install Node.js and npm (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install global npm packages
sudo npm install -g pm2 prisma

# Create project directory
mkdir -p /var/www/saskaituverslas
cd /var/www/saskaituverslas

# Clone project (replace with your git repository if using one)
git clone https://github.com/yourusername/saskaituverslas.git .

# Install dependencies
npm install

# Setup PostgreSQL database
sudo -u postgres psql <<EOF
CREATE DATABASE saskaituverslas;
CREATE USER saskaituverslas WITH PASSWORD 'strong_database_password';
GRANT ALL PRIVILEGES ON DATABASE saskaituverslas TO saskaituverslas;
EOF

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Setup environment file
cat > .env <<EOL
DATABASE_URL="postgresql://saskaituverslas:strong_database_password@localhost:5432/saskaituverslas?schema=public"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
EOL

# Setup Nginx as reverse proxy
sudo tee /etc/nginx/sites-available/saskaituverslas <<EOF
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/saskaituverslas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start application with PM2
pm2 start npm --name "saskaituverslas" -- start
pm2 startup
pm2 save

echo "Deployment completed successfully!"