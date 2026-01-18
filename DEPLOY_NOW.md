# 🚀 Quick Deployment Guide

## Let's Get You Deployed!

I'll walk you through the easiest way to deploy NoxShift step-by-step.

---

## Part 1: Deploy Frontend (5 minutes)

### Using Vercel (Recommended - Free Tier)

**Step 1: Sign Up**
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

**Step 2: Import Project**
1. Click "Add New..." → "Project"
2. Find "NoxShift" in the list
3. Click "Import"

**Step 3: Configure**
```
Framework Preset: Vite (auto-detected)
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Step 4: Add Environment Variables**
Click "Environment Variables" and add each one:

```
VITE_FIREBASE_API_KEY
Value: AIzaSyCTS2ux52QuPpb9aAzMZGYL46mJAjHbn2c

VITE_FIREBASE_AUTH_DOMAIN
Value: noxshift-2617b.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
Value: noxshift-2617b

VITE_FIREBASE_STORAGE_BUCKET
Value: noxshift-2617b.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 265911446290

VITE_FIREBASE_APP_ID
Value: 1:265911446290:web:7332885b184cd1bc4021cb
```

**We'll add VITE_API_URL after deploying the backend!**

**Step 5: Deploy**
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `noxshift-abc123.vercel.app`
4. **Save this URL!**

✅ **Frontend deployed!**

---

## Part 2: Deploy Backend (10 minutes)

### Using Railway (Easy + Free $5 Credit)

**Step 1: Sign Up**
1. Go to: https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

**Step 2: Create New Project**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose "NoxShift"
4. Click "Deploy Now"

**Step 3: Add PostgreSQL Database**
1. In your project, click "New"
2. Select "Database"
3. Choose "Add PostgreSQL"
4. Railway creates database automatically
5. Copy the connection string (it's auto-generated)

**Step 4: Configure Environment Variables**
1. Click on your "noxshift" service
2. Go to "Variables" tab
3. Click "Add Variable" for each:

```
DATABASE_URL
(Railway will auto-populate this if you connected PostgreSQL)

JWT_SECRET
Value: your-super-secret-random-key-minimum-32-characters-long-change-this

NODE_ENV
Value: production

PORT
Value: 5000
```

**Step 5: Set Start Command**
1. Go to "Settings" tab
2. Find "Start Command"
3. Set to: `npm run server`
4. Under "Build Command" set: `npm install && npx prisma generate && npx prisma db push`

**Step 6: Deploy**
1. Railway auto-deploys on push
2. Wait 3-5 minutes for first build
3. You'll get a URL like: `noxshift-production-abc.up.railway.app`
4. **Save this URL!**

**Step 7: Test Backend**
Visit: `https://your-backend-url.railway.app/api/health`

Should see:
```json
{
  "status": "ok",
  "message": "NoxShift API is running",
  "timestamp": "2026-01-18T..."
}
```

✅ **Backend deployed!**

---

## Part 3: Connect Frontend to Backend (2 minutes)

**Step 1: Update Frontend Environment Variables**
1. Go back to Vercel
2. Go to your project → Settings → Environment Variables
3. Add new variable:

```
VITE_API_URL
Value: https://your-backend-url.railway.app/api
```

**Step 2: Redeploy Frontend**
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 2 minutes

✅ **Frontend and Backend connected!**

---

## Part 4: Test Everything (5 minutes)

**Step 1: Visit Your Site**
Go to: `https://noxshift-abc123.vercel.app`

**Step 2: Test VIP Code**
1. Click "🔑 VIP Access"
2. Enter: `NOX424`
3. Should redirect to login (no glitch now!)

**Step 3: Create Account**
1. Click "Sign Up"
2. Fill in:
   - Name: Your Name
   - Company: Your Company
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"
4. Should redirect to Command Center

**Step 4: Test Features**
1. Click "Employees" - should load
2. Click "Scheduler" - should work
3. Check browser console (F12) - should see no errors

✅ **Everything working!**

---

## Part 5: Connect Your Domain (Optional)

### If you have a domain (e.g., noxshift.com):

**Step 1: Add Domain in Vercel**
1. Go to Project Settings → Domains
2. Enter your domain: `noxshift.com`
3. Click "Add"

**Step 2: Update DNS Records**
Go to your domain registrar (Namecheap, GoDaddy, etc.):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Step 3: Wait for DNS**
- Takes 15 minutes to 48 hours
- Usually works in 30 minutes
- Vercel will show "Valid Configuration" when ready

✅ **Domain connected!**

---

## Costs

### Free Tier (Perfect for Testing):
- **Vercel:** Free (1 personal project)
- **Railway:** $5 credit (lasts about 1 month)
- **Total:** $0 for first month

### After Free Credit Expires:
- **Vercel:** Still free for hobby projects
- **Railway:** ~$5-10/month (depends on usage)
- **Total:** ~$5-10/month

### To Upgrade Later:
- **Vercel Pro:** $20/month (custom domains, more bandwidth)
- **Railway:** Scale up as needed (more RAM, storage)

---

## Troubleshooting

**"Failed to build" on Vercel:**
- Check build logs
- Verify all environment variables are set
- Make sure `npm run build` works locally

**"Cannot connect to database" on Railway:**
- Verify DATABASE_URL is set
- Check PostgreSQL service is running (green icon)
- Run migrations: `npx prisma db push`

**"API request failed" on frontend:**
- Check VITE_API_URL is correct
- Must end with `/api`
- No trailing slash
- Example: `https://myapp.railway.app/api`

**"VIP code not working":**
- Check localStorage in browser console (F12)
- Clear localStorage and try again
- Make sure you're on the landing page first

---

## Next Steps After Deployment

1. **Enable Firebase Email Auth** (if needed)
   - Go to: https://console.firebase.google.com
   - Authentication → Sign-in method
   - Enable "Email/Password"

2. **Get VAPID Key for Push Notifications**
   - Firebase Console → Project Settings
   - Cloud Messaging → Web Push certificates
   - Generate key pair
   - Add to Vercel env: `VITE_FIREBASE_VAPID_KEY`

3. **Set Up Custom Domain** (optional)
   - Buy domain on Namecheap/GoDaddy
   - Point to Vercel
   - SSL automatically configured

4. **Monitor Your App**
   - Vercel: Analytics tab
   - Railway: Observability tab
   - Set up email alerts

---

## Quick Commands Summary

**Deploy frontend:**
```bash
# One-time install
npm install -g vercel

# Deploy (from project root)
vercel

# Production deploy
vercel --prod
```

**Check backend logs:**
- Railway dashboard → Select service → Deployments → View logs

**Update environment variable:**
- Vercel: Settings → Environment Variables
- Railway: Variables tab
- **Important:** Redeploy after changing env vars!

---

## Support

**Vercel:**
- Docs: https://vercel.com/docs
- Support: help@vercel.com

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Your App:**
- GitHub: https://github.com/cmc-creator/NoxShift
- Issues: Create issue on GitHub

---

## You're Ready! 🎉

Your app is now:
- ✅ Live on the internet
- ✅ Using real database
- ✅ Automatic deployments (on git push)
- ✅ SSL/HTTPS enabled
- ✅ Backed up and version controlled

**Share your link!** 
Give friends/team the Vercel URL to test it out!

Need help with any step? Let me know which part you're stuck on!
