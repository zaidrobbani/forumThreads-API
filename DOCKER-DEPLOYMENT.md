# 🐳 Docker Deployment Guide

## File yang Sudah Dibuat

- ✅ `Dockerfile` - Image configuration
- ✅ `docker-compose.yml` - Service orchestration
- ✅ `.dockerignore` - Exclude files from build
- ✅ `.github/workflows/cd.yml` - Auto deployment
- ✅ Health check endpoint di `/health`

## Setup VPS (Dilakukan SEKALI saja)

### 1. Install Docker & Docker Compose

```bash
ssh dev@10.202.0.27

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambahkan user ke docker group
sudo usermod -aG docker dev

# Install Docker Compose plugin
sudo apt-get update
sudo apt-get install docker-compose-plugin -y

# Logout dan login kembali agar group aktif
exit
ssh dev@10.202.0.27
```

### 2. Setup Passwordless Sudo untuk Docker

```bash
# Edit sudoers file
sudo visudo

# Tambahkan baris ini di bagian bawah:
dev ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/local/bin/docker-compose
```

Simpan dan keluar (Ctrl+X, Y, Enter)

### 3. Test Instalasi

```bash
docker --version
docker compose version
sudo docker compose version
```

### 4. Setup File .env di VPS

```bash
cd ~/auth-api
nano .env
```

Paste konfigurasi production:

```env
# POSTGRES (tidak digunakan jika pakai Supabase)
PGHOST=localhost
PGUSER=postgres
PGDATABASE=authapi
PGPASSWORD=secret
PGPORT=5432

# DATABASE URL PRODUCTION (Supabase)
DATABASE_URL=postgresql://postgres.vpbjdxjygyudjlgudsem:Kucinglucu84@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# HTTP SERVER
HOST=0.0.0.0
PORT=5000
NODE_ENV=production

# JWT TOKEN
ACCESS_TOKEN_KEY=your-actual-access-token-key-here
REFRESH_TOKEN_KEY=your-actual-refresh-token-key-here
```

## Local Development dengan Docker

### Build & Run

```bash
# Build image
docker compose build

# Run container
docker compose up -d

# Lihat logs
docker compose logs -f

# Stop container
docker compose down
```

### Useful Commands

```bash
# Lihat status container
docker compose ps

# Restart container
docker compose restart

# Rebuild tanpa cache
docker compose build --no-cache

# Masuk ke container
docker compose exec app sh

# Lihat logs real-time
docker compose logs -f app

# Stop dan hapus container
docker compose down -v
```

## Production Deployment

### Automatic via GitHub Actions

Setiap push ke branch `main`:

1. Git pull latest code
2. Run migration ke Supabase
3. Docker compose down (stop old container)
4. Docker compose up -d --build (build & start new)
5. Health check

### Manual Deployment di VPS

```bash
ssh dev@10.202.0.27
cd ~/auth-api

# Pull latest code
git pull origin main

# Run migration
npm run migrate:prod up

# Rebuild dan restart
sudo docker compose down
sudo docker compose up -d --build

# Check status
sudo docker compose ps
sudo docker compose logs -f
```

## Monitoring & Troubleshooting

### Check Container Status

```bash
sudo docker compose ps
```

### View Logs

```bash
# Real-time logs
sudo docker compose logs -f

# Last 100 lines
sudo docker compose logs --tail=100

# Only app service
sudo docker compose logs -f app
```

### Health Check

```bash
# Via curl
curl http://localhost:5000/health

# Via browser
http://your-vps-ip:5000/health
```

### Container Shell Access

```bash
sudo docker compose exec app sh
```

### Restart Container

```bash
sudo docker compose restart
```

### Complete Cleanup

```bash
# Stop dan hapus semua
sudo docker compose down -v

# Hapus unused images
sudo docker system prune -af
```

## Nginx Reverse Proxy (Optional)

Jika ingin akses via domain/port 80:

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
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

## Docker vs PM2

### Keuntungan Docker:

- ✅ **Isolated Environment** - Dependencies tidak bentrok
- ✅ **Reproducible** - Sama di dev, staging, production
- ✅ **Easy Scaling** - Bisa run multiple containers
- ✅ **Rollback** - Mudah kembali ke version sebelumnya
- ✅ **Container Orchestration** - Siap untuk Kubernetes
- ✅ **Built-in Health Check** - Auto restart jika unhealthy

### Keuntungan PM2:

- ✅ **Lightweight** - Tidak perlu Docker daemon
- ✅ **Process Clustering** - Multi-core support bawaan
- ✅ **Advanced Monitoring** - PM2 Plus dashboard
- ✅ **Simple** - Familiar untuk Node.js developers

### Kapan Pakai Docker?

- Multiple services (app + database + redis)
- Microservices architecture
- Kubernetes deployment
- Team dengan beda environment (Windows/Mac/Linux)
- Production dengan containerization

### Kapan Pakai PM2?

- Simple Node.js app
- Single server deployment
- Resource constrained server
- Quick setup tanpa kompleksitas

## Performance Tips

### 1. Multi-stage Build (Optimize image size)

Edit `Dockerfile`:

```dockerfile
# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["node", "src/app.js"]
```

### 2. Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  app:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

### 3. Logging Driver

```yaml
services:
  app:
    # ... existing config
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Security Checklist

- [ ] `.env` tidak ter-commit ke git
- [ ] Gunakan non-root user di Dockerfile
- [ ] Update base image secara berkala
- [ ] Scan image untuk vulnerabilities: `docker scan auth-api`
- [ ] Minimal exposed ports
- [ ] Use secrets management (Docker secrets/Vault)
- [ ] Enable firewall di VPS
- [ ] HTTPS via Nginx + Let's Encrypt

## Troubleshooting Common Issues

### Container keeps restarting

```bash
# Check logs
sudo docker compose logs -f

# Check if port already used
sudo lsof -i :5000

# Check .env file exists
ls -la ~/auth-api/.env
```

### Migration fails

```bash
# Run migration manually
cd ~/auth-api
npm run migrate:prod up

# Or inside container
sudo docker compose exec app npm run migrate:prod up
```

### Can't connect to database

```bash
# Check DATABASE_URL format
# Test connection
sudo docker compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Image build fails

```bash
# Clear build cache
sudo docker compose build --no-cache

# Check Dockerfile syntax
docker build -t test .
```

## Next Steps

1. ✅ Push code ke GitHub
2. ✅ Setup Docker di VPS
3. ✅ Configure GitHub Secrets
4. ✅ Test deployment
5. [ ] Setup monitoring (Prometheus + Grafana)
6. [ ] Setup alerts (Slack/Email)
7. [ ] Backup strategy
8. [ ] SSL/HTTPS setup
