# 🚀 NoxShift Deployment Guide

## Current Status
- ✅ Code pushed to GitHub: https://github.com/cmc-creator/NoxShift
- ⏳ Ready for deployment
- ⏳ Needs domain connection

## Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest) ⭐

**Frontend Deployment (2 minutes):**

1. **Sign up for Vercel:**
   - Go to: https://vercel.com
   - Sign up with GitHub account
   - Free tier is perfect to start

2. **Import Your Repository:**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose: `NoxShift`
   - Click "Import"

3. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_FIREBASE_API_KEY=AIzaSyCTS2ux52QuPpb9aAzMZGYL46mJAjHbn2c
   VITE_FIREBASE_AUTH_DOMAIN=noxshift-2617b.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=noxshift-2617b
   VITE_FIREBASE_STORAGE_BUCKET=noxshift-2617b.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=265911446290
   VITE_FIREBASE_APP_ID=1:265911446290:web:7332885b184cd1bc4021cb
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! You'll get a URL like: `noxshift.vercel.app`

6. **Connect Custom Domain:**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `noxshift.com`)
   - Follow DNS instructions (add A record or CNAME)

**Backend Deployment:**

**Option A: Railway (Easy + Database):**

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your NoxShift repo
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/noxshift
   JWT_SECRET=your-super-secret-key-min-32-chars
   PORT=5000
   NODE_ENV=production
   ```
6. Railway auto-deploys and gives you a URL
7. Copy that URL and use it for `VITE_API_URL` in Vercel

**Option B: Render.com:**

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your NoxShift repo
5. Configure:
   - Name: noxshift-api
   - Environment: Node
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm run server`
6. Add environment variables (same as Railway)
7. Create PostgreSQL database in Render
8. Deploy!

### Option 2: Traditional VPS (Advanced)

**Requirements:**
- VPS (DigitalOcean, Linode, AWS EC2)
- Domain name
- Basic Linux knowledge

**Steps:**

1. **Set up VPS:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install nginx
   ```

2. **Clone Repository:**
   ```bash
   cd /var/www
   git clone https://github.com/cmc-creator/NoxShift.git
   cd NoxShift
   npm install
   ```

3. **Set up Database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE noxshift;
   CREATE USER noxshift_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE noxshift TO noxshift_user;
   \q
   ```

4. **Configure Environment:**
   ```bash
   nano .env
   # Add all variables (see .env.example)
   
   # Run migrations
   npx prisma db push
   ```

5. **Build Frontend:**
   ```bash
   npm run build
   ```

6. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Frontend
       location / {
           root /var/www/NoxShift/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Set up Process Manager:**
   ```bash
   # Install PM2
   sudo npm install -g pm2
   
   # Start backend
   pm2 start npm --name "noxshift-api" -- run server
   pm2 save
   pm2 startup
   ```

8. **SSL Certificate (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Domain Connection

### Step 1: Get Your Domain
- **Registrars:** Namecheap, GoDaddy, Cloudflare
- **Recommended:** Cloudflare (free SSL, CDN)

### Step 2: Configure DNS

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Custom VPS:**
```
Type: A
Name: @
Value: YOUR_VPS_IP

Type: A
Name: www
Value: YOUR_VPS_IP
```

### Step 3: Wait for Propagation
- DNS changes take 5 minutes to 48 hours
- Usually works in 15-30 minutes
- Check: https://dnschecker.org

## Post-Deployment Checklist

### Frontend:
- ✅ Landing page loads
- ✅ Login/Signup works
- ✅ Music plays
- ✅ VIP code works (NOX424)
- ✅ Navigation functions
- ✅ All pages accessible

### Backend:
- ✅ Health check: https://yourapi.com/api/health
- ✅ Signup creates user
- ✅ Login returns JWT
- ✅ Database connected
- ✅ Employees CRUD works

### Security:
- ✅ HTTPS enabled (SSL certificate)
- ✅ JWT_SECRET is random and secure (min 32 chars)
- ✅ Database credentials secure
- ✅ CORS configured for your domain
- ✅ Environment variables not exposed

### Performance:
- ✅ Frontend build optimized
- ✅ Gzip compression enabled
- ✅ CDN configured (if using Cloudflare)
- ✅ Database indexed
- ✅ API rate limiting (optional)

## Connecting Your Domain

### Example: noxshift.com

**Option A: Vercel + Railway**
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Point domain to Vercel
4. Update VITE_API_URL to Railway URL

**Option B: Single VPS**
1. Deploy everything to one server
2. Point domain to server IP
3. Nginx routes frontend and API

**Option C: Subdomain Setup**
1. Frontend: noxshift.com (Vercel)
2. Backend: api.noxshift.com (Railway)
3. Cleaner separation

## Cost Estimates

### Free Tier (Testing):
- Vercel: Free (hobby)
- Railway: $5/month credit
- Render: Free tier available
- **Total: $0-5/month**

### Production (Small):
- Vercel Pro: $20/month
- Railway: $20/month (2GB RAM)
- Domain: $12/year
- **Total: ~$42/month**

### Production (Medium):
- Vercel Pro: $20/month
- Railway/Render: $50/month (4GB RAM)
- PostgreSQL: $15/month
- Domain: $12/year
- **Total: ~$86/month**

### Production (Large):
- DigitalOcean Droplet: $72/month (8GB)
- Managed PostgreSQL: $60/month
- Cloudflare Pro: $20/month
- Domain: $12/year
- **Total: ~$153/month**

## Quick Start (Fastest Deploy)

### 5-Minute Deploy to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd NoxShift
vercel

# Follow prompts
# Deploy backend separately to Railway/Render
```

## Testing Your Deployment

1. **Open your domain**: https://yourdomain.com
2. **Test signup**: Create account with VIP code NOX424
3. **Test login**: Login with created account
4. **Test features**: Click through all pages
5. **Check console**: No errors in browser console
6. **Check network**: API calls working (Network tab)

## Troubleshooting

**"Failed to fetch" errors:**
- Check VITE_API_URL is correct
- Verify CORS settings in backend
- Ensure backend is running

**"Cannot connect to database":**
- Check DATABASE_URL
- Verify PostgreSQL is running
- Check network rules/firewall

**"404 on refresh":**
- Configure routing in Vercel (vercel.json)
- Or add rewrites in Nginx

**"Music not playing":**
- Check browser console
- Verify autoplay policy
- User may need to interact first

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment

---

**Your app is ready to deploy!** Start with Vercel for frontend (free + easy) and Railway for backend ($5/month). Total setup time: ~15 minutes.

**Need help?** Everything is configured and ready - just follow the steps above!
