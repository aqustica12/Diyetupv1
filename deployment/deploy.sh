#!/bin/bash

# DiyetUp.com Deployment Script
# VPS'e otomatik deployment için

set -e

echo "🚀 DiyetUp.com Deployment Başlıyor..."

# Değişkenler
PROJECT_DIR="/var/www/diyetup"
BACKUP_DIR="/var/backups/diyetup"
NGINX_CONFIG="/etc/nginx/sites-available/diyetup"
DB_NAME="diyetup"
DB_USER="diyetup_user"

# Backup oluştur
echo "📦 Backup oluşturuluyor..."
sudo mkdir -p $BACKUP_DIR
sudo pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql

# Git pull
echo "📥 Kod güncelleniyor..."
cd $PROJECT_DIR
git pull origin main

# Dependencies yükle
echo "📦 Dependencies yükleniyor..."
cd frontend
npm install
npm run build

cd ../backend
npm install

# Database migration
echo "🗄️ Database migration..."
npm run migrate

# PM2 restart
echo "🔄 Servisler yeniden başlatılıyor..."
pm2 restart all

# Nginx reload
sudo nginx -t && sudo nginx -s reload

echo "✅ Deployment tamamlandı!"
echo "🌐 Site: https://diyetup.com"