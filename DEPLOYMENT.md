# 🚀 Deployment Guide

## Setup GitHub Secrets

Untuk CD berjalan dengan baik, Anda perlu menambahkan secrets di GitHub repository:

### 1. Buka GitHub Repository Settings

- Pergi ke repository Anda di GitHub
- Klik **Settings** → **Secrets and variables** → **Actions**
- Klik **New repository secret**

### 2. Tambahkan Secrets Berikut

#### `SSH_HOST`

```
10.202.0.27
```

atau gunakan hostname:

```
zaid-pg
```

#### `SSH_USERNAME`

```
dev
```

#### `SSH_PORT`

```
22
```

#### `SSH_KEY`

Generate SSH key baru di VPS atau gunakan yang ada:

**Opsi A: Generate SSH Key Baru (Recommended)**

Di komputer lokal Anda:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

Copy private key:

```bash
cat ~/.ssh/github_actions_deploy
```

Copy isi file ini ke GitHub Secret `SSH_KEY`

Kemudian copy public key ke VPS:

```bash
cat ~/.ssh/github_actions_deploy.pub
```

Login ke VPS dan tambahkan public key:

```bash
ssh dev@10.202.0.27
echo "ssh-ed25519 AAAA... github-actions-deploy" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Opsi B: Gunakan Existing Key**

Jika Anda sudah punya SSH key yang bisa akses VPS, copy private key-nya:

```bash
cat ~/.ssh/id_ed25519
```

## Setup di VPS

### 1. Clone Repository (Jika Belum)

```bash
ssh dev@10.202.0.27
cd ~
git clone https://github.com/USERNAME/REPO-NAME.git auth-api
cd auth-api
```

### 2. Setup Environment Variables

```bash
cd ~/auth-api
nano .env
```

Paste konfigurasi production Anda (jangan commit file .env ke git!):

```env
# POSTGRES
PGHOST=localhost
PGUSER=postgres
PGDATABASE=authapi
PGPASSWORD=secret
PGPORT=5432
DATABASE_URL=postgresql://postgres.vpbjdxjygyudjlgudsem:Kucinglucu84@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# HTTP SERVER
HOST=0.0.0.0
PORT=5000
NODE_ENV=production

# JWT TOKEN
ACCESS_TOKEN_KEY=your-access-token-key
REFRESH_TOKEN_KEY=your-refresh-token-key
```

### 3. Install Dependencies

```bash
npm ci --omit=dev
```

### 4. Install PM2 Globally (Jika Belum)

```bash
npm install -g pm2
```

### 5. Jalankan Database Migration

```bash
npm run migrate:prod up
```

### 6. Start Aplikasi dengan PM2

```bash
pm2 start src/app.js --name auth-api
pm2 save
pm2 startup
```

### 7. Setup Nginx (Optional - untuk reverse proxy)

```bash
sudo nano /etc/nginx/sites-available/auth-api
```

Contoh konfigurasi:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/auth-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cara Kerja CD

Setiap kali Anda push ke branch `master` atau `main`:

1. ✅ GitHub Actions akan trigger
2. 🔌 Connect ke VPS via SSH
3. 📥 Pull code terbaru dari repository
4. 📦 Install dependencies production
5. 🗄️ Jalankan migration database ke production (Supabase)
6. 🔄 Restart aplikasi dengan PM2
7. ✅ Deployment selesai!

## Monitoring

### Cek status aplikasi di VPS:

```bash
ssh dev@10.202.0.27
pm2 status
pm2 logs auth-api
```

### Cek logs:

```bash
pm2 logs auth-api --lines 100
```

### Manual restart:

```bash
pm2 restart auth-api
```

## Troubleshooting

### Jika migration gagal:

```bash
ssh dev@10.202.0.27
cd ~/auth-api
npm run migrate:prod status
npm run migrate:prod up
```

### Jika PM2 tidak ada:

```bash
npm install -g pm2
```

### Jika port sudah digunakan:

```bash
sudo lsof -i :5000
# Kill process jika perlu
pm2 delete auth-api
pm2 start src/app.js --name auth-api
```

## Keamanan

⚠️ **PENTING:**

- Jangan commit file `.env` ke repository
- Simpan SSH private key hanya di GitHub Secrets
- Gunakan SSH key yang berbeda untuk deployment (jangan pakai personal key)
- Pastikan `.env` ada di `.gitignore`
- Update password database secara berkala

## Testing Deployment

Setelah setup, test dengan:

```bash
git add .
git commit -m "test: trigger CD pipeline"
git push origin master
```

Cek di GitHub Actions tab untuk melihat progress deployment.
