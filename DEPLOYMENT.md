# 🚀 MusiStash Production Deployment Guide

This guide will help you deploy MusiStash to production on `musistash.com` with both frontend and backend.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Domain**: Ensure you own `musistash.com`
3. **API Keys**: Have all required API keys ready

## 🎯 **Option 1: Vercel (Recommended - Fastest)**

### **Step 1: Deploy Backend API**

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repo
   - Set **Root Directory** to `backend`
3. **Environment Variables**: Add these in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   LASTFM_API_KEY=your_lastfm_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```
4. **Deploy**: Vercel will give you a URL like `https://musistash-backend.vercel.app`

### **Step 2: Deploy Frontend**

1. **Create New Project** in Vercel
2. **Import Project**: Same GitHub repo
3. **Set Root Directory** to `/` (main folder)
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```
5. **Deploy**: Get URL like `https://musistash-frontend.vercel.app`

### **Step 3: Configure Custom Domain**

1. **In Vercel Dashboard** → Project Settings → Domains
2. **Add Domain**: `musistash.com` and `www.musistash.com`
3. **DNS Settings**: Point your domain's DNS to Vercel:
   ```
   A record: @ → 76.76.19.61
   CNAME: www → cname.vercel-dns.com
   ```

---

## 🎯 **Option 2: Railway (Good Alternative)**

### **Backend Deployment:**

1. **Create Railway Account**: [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Select backend folder**
4. **Add Environment Variables**
5. **Deploy**

### **Frontend Deployment:**

1. **Use Netlify or Vercel** for frontend
2. **Point API URL to Railway backend**

---

## 🎯 **Option 3: Traditional VPS (Most Control)**

### **Requirements:**

- DigitalOcean/AWS/Linode server
- Nginx reverse proxy
- PM2 process manager
- SSL certificate

### **Backend Setup:**

```bash
# On your server
git clone your-repo
cd musistash-platform/backend
pip install -r requirements.txt
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name musistash-api
```

### **Frontend Setup:**

```bash
cd musistash-platform
npm install
npm run build
# Copy dist/ folder to nginx web root
```

### **Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name musistash.com www.musistash.com;

    # Frontend
    location / {
        root /var/www/musistash/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 **Environment Variables Setup**

### **Backend (.env):**

```bash
OPENAI_API_KEY=sk-proj-xxxxx
SPOTIFY_CLIENT_ID=xxxxx
SPOTIFY_CLIENT_SECRET=xxxxx
LASTFM_API_KEY=xxxxx
NEWS_API_KEY=xxxxx
```

### **Frontend (.env):**

```bash
VITE_API_URL=https://your-backend-domain.com
```

---

## 🌐 **DNS Configuration**

Point your domain to your deployment:

**For Vercel:**

```
A record: @ → 76.76.19.61
CNAME: www → cname.vercel-dns.com
```

**For Custom Server:**

```
A record: @ → your.server.ip.address
A record: www → your.server.ip.address
```

---

## ✅ **Quick Deploy Commands**

### **1. Vercel CLI (Fastest):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd ..
vercel --prod
```

### **2. GitHub Actions (Automated):**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🔒 **Security Checklist**

- [ ] Environment variables set in production
- [ ] CORS configured for your domain
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Rate limiting configured (optional)

---

## 🎉 **Final Result**

After deployment, you'll have:

- **Frontend**: `https://musistash.com`
- **API**: `https://api.musistash.com` or `https://musistash-api.vercel.app`
- **Features**: All AI analysis, artist comparison, and news functionality live!

---

## 🆘 **Troubleshooting**

**CORS Issues:**

- Ensure your domain is in the CORS allow_origins list
- Check environment variables are set correctly

**API Not Working:**

- Verify backend environment variables
- Check API endpoint URLs in frontend

**Domain Not Working:**

- Verify DNS propagation (can take 24-48 hours)
- Check domain configuration in hosting platform

**Need Help?**

- Check deployment logs in your hosting platform
- Verify all environment variables are set
- Test API endpoints directly
