# 🖥️ New Computer Setup Guide - NoxShift

This guide will walk you through setting up NoxShift on a new computer from scratch.

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

### Option A: Automated Setup Script

```batch
# Run this from the project directory
SETUP-LOCAL.bat
```

This script will:
- Copy the project to a local directory (C:\Temp\NoxShift)
- Install dependencies
- Start the development server

### Option B: Quick Install

```batch
# Just install dependencies
install-dependencies.bat

# Then start the dev server
start-dev.bat
```

**Note:** These scripts are designed for specific Windows environments with portable Node.js installations. If they don't work for your setup, follow the manual steps above instead.

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
