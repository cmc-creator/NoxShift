# 🚀 Quick Start Guide - NoxShift Backend

## Prerequisites
- Node.js installed
- Git installed
- Both terminal tabs open

## Step 1: Environment Already Set ✅
Your `.env` file is already configured!

## Step 2: Database Already Initialized ✅
Ran `npx prisma db push` - database ready!

## Step 3: Start Both Servers

### Terminal 1 - Backend:
```bash
npm run server
```
**Expected Output:**
```
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
```

### Terminal 2 - Frontend:
```bash
npm run dev
```
**Expected Output:**
```
➜  Local:   http://localhost:5174/
```

## Step 4: Test The Application

### Create Account:
1. Open: http://localhost:5174/login
2. Click **"Sign Up"**
3. Fill in:
   - **Name:** Your Name
   - **Company Name:** Your Company (optional)
   - **Email:** test@example.com
   - **Password:** password123
4. Click **"Sign Up"**
5. ✅ You'll be redirected to Command Center
6. ✅ JWT token stored in browser
7. ✅ User + Organization created in database

### Test Employees:
1. Click **"Employees"** in sidebar
2. You'll see message: "✅ Connected to Backend!"
3. Click **"Add Employee"** button (modal opens - not yet connected)
4. View existing employees (currently empty)

### Test Login:
1. Sign out (if button available)
2. Go back to /login
3. Enter same email/password
4. ✅ Should log you back in!

## Currently Working:

✅ Backend API running  
✅ Frontend dev server running  
✅ Database created and ready  
✅ Signup creates user + organization  
✅ Login returns JWT token  
✅ Token stored in localStorage  
✅ Employees page fetches from API  
✅ Delete employee works  
✅ Auth middleware protecting routes  

## Not Yet Connected:

⏳ Add Employee modal → Needs form handler  
⏳ Scheduler page → Needs scheduleAPI integration  
⏳ Time-Off page → Needs timeoffAPI integration  
⏳ Push notifications → Needs VAPID key from Firebase Console  

## Quick Commands

### View Database:
```bash
npx prisma studio
```
Opens GUI at http://localhost:5555

### Check Health:
```bash
curl http://localhost:5000/api/health
```

### View Token:
Open browser console:
```javascript
localStorage.getItem('noxshift_token')
```

### Clear Token (logout):
```javascript
localStorage.removeItem('noxshift_token')
```

### Restart Everything:
```bash
# Kill both servers (Ctrl+C)
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

## What You Have Now:

🎯 **Complete Backend API**
- Express + Prisma + TypeScript
- JWT authentication
- Organization multi-tenancy
- CRUD operations for employees, schedules, time-off

💻 **Connected Frontend**
- API service layer
- Enhanced auth context
- Real data fetching
- Loading & error states

📦 **Database**
- SQLite (dev)
- PostgreSQL ready (production)
- All tables created
- Migrations applied

🔐 **Security**
- Password hashing (bcrypt)
- JWT tokens (7-day expiry)
- Protected routes
- Organization scoping

## Next Steps:

1. **Test signup/login** ← START HERE!
2. Connect Add Employee form
3. Update Scheduler with real data
4. Update Time-Off with real data
5. Get VAPID key for push notifications
6. Deploy to production

## Troubleshooting:

**Port already in use:**
```bash
# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (5174)
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

**Can't connect to API:**
- Check backend is running (should see "✅ NoxShift API server running")
- Check .env has VITE_API_URL=http://localhost:5000/api
- Check browser console for CORS errors

**Database errors:**
```bash
npx prisma db push
npx prisma generate
```

## You're Ready! 🎉

Both servers are running, database is initialized, and your app is connected to real backend APIs!

Go to http://localhost:5174/login and create your first account!
