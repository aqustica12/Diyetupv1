#!/bin/bash

echo "🚀 DiyetUp VPS Kurulum Başlatılıyor..."

# Node.js ve npm kurulum
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulum
sudo npm install pm2 -g

# PostgreSQL kurulum
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# PostgreSQL ayarları
sudo -u postgres psql -c "CREATE DATABASE diyetup;"
sudo -u postgres psql -c "CREATE USER diyetup_user WITH PASSWORD 'diyetup123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE diyetup TO diyetup_user;"

# Nginx kurulum
sudo apt-get install -y nginx

# SSL sertifikası için Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Proje klonlama
cd /var/www
sudo git clone https://github.com/username/diyetup.git
cd diyetup

# Backend kurulum
cd backend
sudo npm install
sudo cp .env.example .env

# Environment variables ayarlama
echo "PAYTR_MERCHANT_ID=597939" | sudo tee -a .env
echo "PAYTR_MERCHANT_KEY=kExMGGXDqwzsD76S" | sudo tee -a .env
echo "PAYTR_MERCHANT_SALT=sJ43JtNwxLh5E5tC" | sudo tee -a .env
echo "DATABASE_URL=postgresql://diyetup_user:diyetup123@localhost:5432/diyetup" | sudo tee -a .env
echo "JWT_SECRET=diyetup-super-secret-key-2024" | sudo tee -a .env
echo "PORT=5000" | sudo tee -a .env
echo "NODE_ENV=production" | sudo tee -a .env

# Backend başlatma
sudo pm2 start server.js --name "diyetup-backend"

# Frontend kurulum
cd ../app
sudo npm install
sudo npm run build

# Frontend başlatma
sudo pm2 start npm --name "diyetup-frontend" -- start

# PM2 startup ayarlama
sudo pm2 startup
sudo pm2 save

# Nginx ayarlama
sudo cp ../nginx/diyetup.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/diyetup.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL sertifikası
sudo certbot --nginx -d diyetup.com

# Firewall ayarlama
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ DiyetUp kurulumu tamamlandı!"
echo "🌐 Site: https://diyetup.com"
echo "📊 PM2 Status: pm2 status"
echo "🔧 Nginx Status: systemctl status nginx" 