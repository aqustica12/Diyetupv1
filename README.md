# DiyetUp - Diyetisyen Yönetim Platformu

Modern, güvenli ve kullanıcı dostu diyetisyen yönetim platformu.

## 🚀 Özellikler

- ✅ Kullanıcı yönetimi ve authentication
- ✅ Admin paneli
- ✅ Danışan yönetimi
- ✅ Randevu sistemi
- ✅ Diyet planları
- ✅ Mesajlaşma sistemi
- ✅ Raporlama
- ✅ Responsive tasarım

## 🛠 Teknolojiler

**Frontend:**
- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs

## 📦 VPS Kurulumu

### 1. Sunucu Hazırlığı
```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js 18 kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL kurulumu
sudo apt install postgresql postgresql-contrib -y

# PM2 kurulumu
sudo npm install -g pm2

# Nginx kurulumu
sudo apt install nginx -y
```

### 2. PostgreSQL Kurulumu
```bash
# PostgreSQL başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Database ve kullanıcı oluştur
sudo -u postgres psql
```

PostgreSQL'de:
```sql
CREATE DATABASE diyetup;
CREATE USER diyetup_user WITH PASSWORD 'güçlü_şifre_buraya';
GRANT ALL PRIVILEGES ON DATABASE diyetup TO diyetup_user;
ALTER USER diyetup_user CREATEDB;
\q
```

### 3. Proje Kurulumu
```bash
# Proje klasörü oluştur
sudo mkdir -p /var/www/diyetup
sudo chown $USER:$USER /var/www/diyetup

# Projeyi kopyala
cd /var/www/diyetup
# Dosyaları buraya kopyala

# Frontend dependencies
npm install
npm run build

# Backend dependencies
cd backend
npm install
```

### 4. Environment Variables
```bash
# Backend .env dosyası oluştur
cd /var/www/diyetup/backend
cp .env.example .env
nano .env
```

`.env` dosyasını düzenle:
```env
DATABASE_URL=postgresql://diyetup_user:güçlü_şifre_buraya@localhost:5432/diyetup
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diyetup
DB_USER=diyetup_user
DB_PASSWORD=güçlü_şifre_buraya

JWT_SECRET=çok_güçlü_jwt_secret_en_az_32_karakter
NODE_ENV=production
PORT=5000

ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 5. Database Migration
```bash
cd /var/www/diyetup/backend
npm run migrate
```

### 6. PM2 ile Başlat
```bash
# Backend API
cd /var/www/diyetup/backend
pm2 start server.js --name "diyetup-api"

# Frontend
cd /var/www/diyetup
pm2 start npm --name "diyetup-frontend" -- start

# PM2 kaydet
pm2 save
pm2 startup
```

### 7. Nginx Konfigürasyonu
```bash
sudo nano /etc/nginx/sites-available/diyetup
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Nginx'i aktifleştir
sudo ln -s /etc/nginx/sites-available/diyetup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL Sertifikası (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔐 Admin Paneli

**Demo Giriş Bilgileri:**
- E-posta: `admin@diyetup.com`
- Şifre: `DiyetUp2024!`

**Admin Panel URL:** `/admin`

## 🧪 Test

```bash
# API health check
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgileri

### Admin
- `GET /api/admin/stats` - Sistem istatistikleri
- `GET /api/admin/users` - Kullanıcı listesi
- `PUT /api/admin/users/:id/status` - Kullanıcı durumu güncelle

### Clients
- `GET /api/clients` - Danışan listesi
- `POST /api/clients` - Yeni danışan
- `PUT /api/clients/:id` - Danışan güncelle
- `DELETE /api/clients/:id` - Danışan sil

## 🔧 Maintenance

```bash
# Logları görüntüle
pm2 logs

# Servisleri yeniden başlat
pm2 restart all

# Database backup
pg_dump diyetup > backup_$(date +%Y%m%d).sql
```

## 📞 İletişim

- Website: [diyetup.com](https://diyetup.com)
- Email: bilgi@diyetup.com
- Support: bilgi@diyetup.com

---

Made with ❤️ by DiyetUp Team