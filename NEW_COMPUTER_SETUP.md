# 🖥️ New Computer Setup Guide - NoxShift

This guide will walk you through setting up NoxShift on a new computer from scratch.

> **📌 Note:** This is the primary comprehensive guide for new computer setup. Other guides in the repository:
> - **[QUICKSTART.md](QUICKSTART.md)** - For users who already have the repo cloned and want to quickly start the servers
> - **[START_HERE.md](START_HERE.md)** - Backend-focused quick start assuming setup is already done
> - **[PLATFORM_SETUP.md](PLATFORM_SETUP.md)** - OS-specific details complementing this guide
> - **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Quick checklist format of these steps

---

## 🚨 Having Issues? Quick Diagnosis

If something's not working, try these first:

1. **Dependencies not installed?** → Run `npm install`
2. **Missing .env file?** → Run `cp .env.example .env`
3. **Database errors?** → Run `npx prisma generate` then `npx prisma db push`
4. **"Command not found" errors?** → Install Node.js and Git (see Prerequisites below)
5. **Port already in use?** → Kill the process or change PORT in `.env`

**Still stuck?** Run `node verify-setup.cjs` to automatically check your setup.

**See detailed solutions:** Jump to [Common Issues & Solutions](#common-issues--solutions) section.

---

## Prerequisites

Before you begin, make sure you have the following installed:

### 1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```
   - Expected output: `v18.x.x` or higher

### 2. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation:
     ```bash
     git --version
     ```

### 3. **Code Editor** (Recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - Or any editor of your choice

---

## Step 1: Clone the Repository

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
# Clone the repository
git clone https://github.com/cmc-creator/NoxShift.git

# Navigate into the project directory
cd NoxShift
```

---

## Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- Frontend dependencies (React, Vite, Tailwind CSS)
- Backend dependencies (Express, Prisma, JWT authentication)
- All development tools

**Expected Output:** Should complete without errors and create a `node_modules` folder.

---

## Step 3: Set Up Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
# Copy the example file
cp .env.example .env
```

Or create it manually with this content:

```env
# Database (SQLite for local development)
DATABASE_URL="file:./dev.db"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication (IMPORTANT: Change this!)
JWT_SECRET="change-this-to-a-secure-random-string-at-least-32-characters-long"

# Firebase Configuration (Get these from Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key

# API URL
VITE_API_URL=http://localhost:5000/api
```

### Important: Update JWT Secret

For security, generate a secure JWT secret:

```bash
# Option 1: Use Node.js (works on all platforms)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use online generator (if Node.js doesn't work)
# Go to: https://www.grc.com/passwords.htm
```

Copy the generated string and replace `JWT_SECRET` value in your `.env` file.

---

## Step 4: Initialize the Database

Set up the SQLite database and generate Prisma client:

```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma db push
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Database pushed successfully
```

This creates a `dev.db` file in your project root with all necessary tables.

### Optional: View Database

To view and manage your database with a GUI:

```bash
npx prisma studio
```

Opens at http://localhost:5555 - useful for inspecting data!

---

## Step 4.5: Verify Setup (Recommended)

Before starting the servers, run this verification script to check if everything is configured correctly:

```bash
node verify-setup.cjs
```

**Expected Output:**
```
✅ Perfect! Everything is set up correctly.

🚀 Next steps:
   1. Terminal 1: npm run server
   2. Terminal 2: npm run dev
   3. Open http://localhost:5173
```

If you see any errors, the script will tell you what's missing and how to fix it.

**Common Issues Caught by Verification:**
- Missing `.env` file
- Dependencies not installed (`npm install` needed)
- Prisma client not generated
- Database not initialized

---

## Step 5: Start the Application

You need to run **two servers** simultaneously:

### Terminal 1: Backend Server

```bash
npm run server
```

**Expected Output:**
```
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend Development Server

Open a **new terminal** in the same directory and run:

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Alternative: Windows Quick Setup (Automated)

If you're on Windows, the repository includes helper scripts to automate the setup:

### Option A: Automated Setup Script (Windows Network Environment)

```batch
# Run this from the project directory
SETUP-LOCAL.bat
```

**⚠️ Important:** This script is designed for specific Windows network environments with portable Node.js installations. It will:
- Copy the project to a local directory (C:\Temp\NoxShift)
- Install dependencies
- Start the development server

**Note:** If you've already cloned the repository to your desired location, skip this and use the manual steps above instead. This script is primarily for development environments with network-mounted drives.

### Option B: Quick Install (Windows Portable Node.js)

```batch
# Just install dependencies
install-dependencies.bat

# Then start the dev server
start-dev.bat
```

**Note:** These helper scripts are configured for portable Node.js installations on network drives. For standard Node.js installations, use `npm install` and `npm run dev` instead (as described in the manual steps above).

---

## Step 6: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the NoxShift login page
4. Click **"Sign Up"** to create your first account

### Create Your First Account

1. Fill in the signup form:
   - **Name:** Your Name
   - **Company Name:** Your Company (optional)
   - **Email:** admin@example.com
   - **Password:** (choose a secure password)

2. Click **"Sign Up"**
3. You'll be redirected to the Command Center dashboard
4. ✅ Success! Your NoxShift instance is running!

---

## Verification Checklist

Make sure everything is working:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can create an account (signup works)
- [ ] Can log in with created account
- [ ] Can navigate to different pages (Employees, Scheduler, Time-Off)
- [ ] Database file `dev.db` exists in project root

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Generate Prisma Client (after schema changes)
npx prisma generate

# Update database schema
npx prisma db push

# View database in browser
npx prisma studio

# Start backend server
npm run server

# Start frontend dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Project Structure Overview

```
NoxShift/
├── src/                      # Frontend React application
│   ├── components/           # UI components
│   ├── pages/               # Page components
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── server/                   # Backend Express server
│   └── index.js             # API routes & logic
├── prisma/                   # Database schema
│   └── schema.prisma        # Database models
├── public/                   # Static assets
├── .env                      # Environment variables (create this!)
├── .env.example             # Environment template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

---

## Common Issues & Solutions

### Issue 1: "npm: command not found"

**Problem:** Node.js or npm is not installed or not in PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. After installation, **restart your terminal**
3. Verify: `node --version` and `npm --version`
4. If still not working on Windows, add Node.js to PATH manually:
   - Search "Environment Variables" in Windows
   - Edit PATH and add `C:\Program Files\nodejs`

### Issue 2: "git: command not found"

**Problem:** Git is not installed or not in PATH.

**Solution:**
1. Install Git from https://git-scm.com/downloads
2. During installation, choose "Git from the command line and 3rd-party software"
3. **Restart your terminal**
4. Verify: `git --version`

### Issue 3: npm install fails with EACCES errors

**Problem:** Permission errors during npm install.

**Solution (macOS/Linux):**
```bash
# Change npm's default directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Solution (Windows):**
Run PowerShell or Command Prompt as Administrator, then run `npm install`.

### Issue 4: Prisma generate fails

**Problem:** `Error: @prisma/client did not initialize yet`

**Solution:**
```bash
# Delete and reinstall Prisma
npm uninstall @prisma/client prisma
npm install @prisma/client prisma
npx prisma generate
```

### Issue 5: Server starts but shows "Cannot find module"

**Problem:** Missing or corrupted dependencies.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Issue 6: "Error: JWT_SECRET is not defined"

**Problem:** The `.env` file doesn't exist or is missing JWT_SECRET.

**Solution:**
```bash
# Make sure .env file exists
ls -la .env

# If it doesn't exist, copy from example
cp .env.example .env

# Edit .env and add JWT_SECRET
# Generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env:
# JWT_SECRET="<generated-secret-here>"
```

### Issue 7: Frontend shows blank page or errors

**Problem:** API URL not configured or backend not running.

**Solution:**
1. Make sure backend is running in Terminal 1: `npm run server`
2. Check backend health: Open http://localhost:5000/api/health
3. Verify `.env` has: `VITE_API_URL=http://localhost:5000/api`
4. Restart frontend: Stop (`Ctrl+C`) and run `npm run dev` again

### Issue 8: Database errors (SQLite locked, can't write)

**Problem:** Database file is locked or permissions issue.

**Solution:**
```bash
# Delete and recreate database
rm dev.db
npx prisma db push
```

### Issue 9: Port 3000/5000/5173 already in use

**Problem:** Another application is using the port.

**Solution:**

**Windows:**
```bash
# Find what's using the port
netstat -ano | findstr :5000
# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process on port
lsof -ti:5000 | xargs kill -9
```

**Alternative:** Change the port in `.env`:
```env
PORT=5001
```

### Issue 10: "Module not found: Can't resolve 'firebase'"

**Problem:** Firebase dependencies not installed (Firebase is optional).

**Solution:**
```bash
# Firebase is optional - the app works without it
# If you need Firebase features, install:
npm install firebase
```

---

## Troubleshooting

### Problem: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `.env`:
```env
PORT=5001
```

### Problem: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
```bash
# Regenerate database
npx prisma db push --force-reset
npx prisma generate
```

### Problem: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Problem: Frontend Can't Connect to Backend

**Error:** Network errors in browser console

**Solution:**
1. Check backend is running: http://localhost:5000/api/health
2. Verify `VITE_API_URL` in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart both servers

### Problem: JWT_SECRET Error

**Error:** `JWT_SECRET is not defined`

**Solution:**
Make sure `.env` file exists with a `JWT_SECRET` value:
```env
JWT_SECRET="your-secure-secret-at-least-32-characters-long"
```

---

## Next Steps After Setup

### 1. Configure Firebase (Optional but Recommended)

For push notifications and real-time features:

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Anonymous sign-in)
4. Enable Firestore Database
5. Get your configuration from Project Settings
6. Update `.env` with your Firebase credentials

### 2. Add Employees

1. Navigate to "Employees" in the sidebar
2. Click "Add Employee"
3. Fill in employee details
4. Start building your team roster

### 3. Create Your First Schedule

1. Go to "Scheduler"
2. Click on any day to add a shift
3. Assign employees to shifts
4. Publish the schedule

### 4. Explore Features

- **Shift Matrix View:** Visual grid for scheduling
- **Department Management:** Organize by departments
- **Time Off Requests:** Manage employee time off
- **Analytics:** View hours and costs
- **Export:** Download schedules as CSV

---

## Production Deployment

When ready to deploy to production, see these guides:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [DEPLOY_NOW.md](DEPLOY_NOW.md) - Quick deployment steps
- [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) - Production checklist

---

## Getting Help

- **Documentation:** Check the various `.md` files in the repository
- **Start Here:** [START_HERE.md](START_HERE.md) for quick overview
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md) for rapid setup
- **Issues:** Report bugs on GitHub Issues

---

## Success! 🎉

You now have NoxShift running on your new computer!

**Your setup includes:**
- ✅ Full-stack application (React + Express)
- ✅ Database with Prisma ORM
- ✅ JWT authentication
- ✅ Employee management
- ✅ Shift scheduling
- ✅ Time-off tracking
- ✅ Modern UI with Tailwind CSS

**Happy Scheduling!** 📅✨
