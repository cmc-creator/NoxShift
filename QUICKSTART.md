# 🚀 Quick Start: Get NoxShift Running Locally

## Step 1: Install Dependencies (if not done)
```bash
npm install
```

## Step 2: Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Database (use SQLite for local development)
DATABASE_URL="file:./dev.db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long-change-this"

# Server
PORT=5000
NODE_ENV=development

# Firebase (you already have these!)
VITE_FIREBASE_API_KEY=AIzaSyCTS2ux52QuPpb9aAzMZGYL46mJAjHbn2c
VITE_FIREBASE_AUTH_DOMAIN=noxshift-2617b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=noxshift-2617b
VITE_FIREBASE_STORAGE_BUCKET=noxshift-2617b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=265911446290
VITE_FIREBASE_APP_ID=1:265911446290:web:7332885b184cd1bc4021cb
VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE

# API URL
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

## Step 4: Start the Backend Server
```bash
npm run server
```

You should see:
```
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
```

## Step 5: Start the Frontend (in a new terminal)
```bash
npm run dev
```

You should see:
```
  VITE v5.4.21  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Test It!
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create your account
4. Start scheduling! 🎉

---

## What Just Happened?

### Backend API is Now Running:
✅ **Authentication**
- POST /api/auth/signup - Create account
- POST /api/auth/login - Sign in
- GET /api/auth/me - Get current user

✅ **Employees**
- GET /api/employees - List all employees
- POST /api/employees - Add employee
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Remove employee

✅ **Schedules**
- GET /api/schedules - Get shifts
- POST /api/schedules - Create shift
- PUT /api/schedules/:id - Update shift
- DELETE /api/schedules/:id - Delete shift

✅ **Time Off**
- GET /api/timeoff - List requests
- POST /api/timeoff - Submit request
- PUT /api/timeoff/:id - Approve/deny

### Database is Live:
✅ SQLite database created (dev.db)
✅ All tables created from Prisma schema
✅ Ready to store real data

---

## Next Steps for Production:

### 1. Switch to PostgreSQL
For production, use a real database:

**Option A: Supabase (Recommended - Free tier)**
1. Go to https://supabase.com
2. Create new project
3. Copy connection string
4. Update .env:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

**Option B: Railway (Easy deployment)**
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Update .env

### 2. Deploy Backend
**Railway (Easiest):**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

**Render:**
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. Build: `npm install`
5. Start: `npm run server`

### 3. Deploy Frontend
**Vercel (Easiest):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### 4. Update Frontend API URLs
Once backend is deployed, update `.env`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Use different port
PORT=5001 npm run server
```

### Database errors?
```bash
# Reset database
npx prisma db push --force-reset

# Check Prisma Client is generated
npx prisma generate
```

### Frontend can't connect to backend?
1. Check backend is running (http://localhost:5000/api/health)
2. Check CORS is enabled (already configured)
3. Verify VITE_API_URL in .env

### "JWT_SECRET not defined"?
Add to `.env`:
```env
JWT_SECRET="any-long-random-string-here-at-least-32-characters"
```

---

## Quick Commands Cheat Sheet

```bash
# Start everything (backend + frontend)
npm run server & npm run dev

# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio

# Check backend health
curl http://localhost:5000/api/health

# Run in production mode
NODE_ENV=production npm run server
```

---

## You're Ready! 🎉

Your NoxShift instance is now running with:
- ✅ Real backend API
- ✅ Database persistence
- ✅ Authentication working
- ✅ All CRUD operations functional
- ✅ Ready for production deployment

Next up: Add Stripe payments or deploy to production!
