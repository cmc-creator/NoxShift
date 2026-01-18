# 📋 Quick Setup Flow - NoxShift

Visual guide for setting up NoxShift on a new computer.

```
┌─────────────────────────────────────────────────────────────┐
│                    SETUP FLOW DIAGRAM                        │
└─────────────────────────────────────────────────────────────┘

START HERE
    ↓
┌─────────────────────────────────────────┐
│  1. Install Prerequisites               │
│  ✓ Node.js v18+ (nodejs.org)          │
│  ✓ Git (git-scm.com)                   │
│  ✓ Code Editor (optional)              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  2. Clone Repository                    │
│  $ git clone github.com/cmc-creator/    │
│    NoxShift.git                         │
│  $ cd NoxShift                          │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  3. Install Dependencies                │
│  $ npm install                          │
│  (Wait 2-5 minutes)                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  4. Configure Environment               │
│  $ cp .env.example .env                 │
│  • Edit .env file                       │
│  • Set JWT_SECRET (secure string)      │
│  • Optional: Add Firebase config        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  5. Setup Database                      │
│  $ npx prisma generate                  │
│  $ npx prisma db push                   │
│  (Creates dev.db file)                  │
└─────────────────────────────────────────┘
    ↓
    ├──────────────────────────┬────────────────────────────┐
    ↓                          ↓                            ↓
┌─────────────┐         ┌─────────────┐         ┌─────────────────┐
│ Terminal 1  │         │ Terminal 2  │         │ Browser         │
│             │         │             │         │                 │
│ $ npm run   │         │ $ npm run   │         │ Open:           │
│   server    │         │   dev       │         │ localhost:5173  │
│             │         │             │         │                 │
│ Backend     │ ←──────→│ Frontend    │ ←──────→│ Application     │
│ :5000       │   API   │ :5173       │  HTTP   │                 │
└─────────────┘         └─────────────┘         └─────────────────┘
    ↓                          ↓                            ↓
    │                          │                            │
    └──────────────────────────┴────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  6. Create Account  │
                    │  • Sign Up          │
                    │  • Enter details    │
                    │  • Login            │
                    └─────────────────────┘
                              ↓
                        ┌──────────┐
                        │ SUCCESS! │
                        │    ✓     │
                        └──────────┘
```

---

## Detailed Component Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    APPLICATION ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  User Browser    │  http://localhost:5173
└────────┬─────────┘
         │ HTTP Requests
         ↓
┌──────────────────┐
│  Vite Dev Server │  Frontend (React + TypeScript)
│  Port: 5173      │  • React Components
│                  │  • Tailwind CSS
│  $ npm run dev   │  • React Router
└────────┬─────────┘
         │ API Calls (VITE_API_URL)
         ↓
┌──────────────────┐
│  Express Server  │  Backend (Node.js)
│  Port: 5000      │  • REST API
│                  │  • JWT Auth
│  $ npm run       │  • Business Logic
│    server        │
└────────┬─────────┘
         │ Prisma Client
         ↓
┌──────────────────┐
│  SQLite Database │  Data Storage
│  dev.db          │  • Users
│                  │  • Employees
│                  │  • Schedules
│                  │  • Time Off
└──────────────────┘
```

---

## File Structure After Setup

```
NoxShift/
│
├── 📦 node_modules/         (after npm install)
│   └── ... (1000+ packages)
│
├── 🗄️ dev.db                (after prisma db push)
│
├── 📁 src/                   React Application
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── 📁 server/                Express API
│   └── index.js
│
├── 📁 prisma/               Database Schema
│   └── schema.prisma
│
├── 📄 .env                   (YOU CREATE THIS!)
│   ├── DATABASE_URL
│   ├── JWT_SECRET
│   ├── PORT
│   └── VITE_API_URL
│
├── 📄 .env.example          Template
├── 📄 package.json          Dependencies
├── 📄 vite.config.ts        Vite Config
├── 📄 tsconfig.json         TypeScript Config
└── 📚 Documentation/
    ├── README.md
    ├── NEW_COMPUTER_SETUP.md  ← Main Guide
    ├── SETUP_CHECKLIST.md     ← Quick Checklist
    └── PLATFORM_SETUP.md      ← OS-Specific
```

---

## Time Estimates

| Task                          | Duration    |
|-------------------------------|-------------|
| Install Node.js               | 5-10 min    |
| Install Git                   | 5 min       |
| Clone Repository              | 1-2 min     |
| npm install                   | 2-5 min     |
| Create .env file              | 2 min       |
| Setup database (Prisma)       | 1-2 min     |
| Start servers                 | 1 min       |
| Create first account          | 1 min       |
| **TOTAL**                     | **15-30 min**|

---

## Dependency Tree (Simplified)

```
NoxShift
│
├─── Frontend Stack
│    ├── React 18
│    ├── TypeScript
│    ├── Vite (Build Tool)
│    ├── Tailwind CSS
│    ├── React Router
│    ├── Lucide Icons
│    └── Date-fns
│
├─── Backend Stack
│    ├── Node.js
│    ├── Express
│    ├── Prisma ORM
│    ├── JWT (Auth)
│    ├── bcryptjs (Passwords)
│    └── CORS
│
└─── Database
     └── SQLite (dev) / PostgreSQL (prod)
```

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│               DAILY DEVELOPMENT WORKFLOW                 │
└─────────────────────────────────────────────────────────┘

     Start Work
         ↓
   ┌─────────────┐
   │  git pull   │  Get latest changes
   └─────────────┘
         ↓
   ┌─────────────┐
   │npm install  │  Update dependencies (if needed)
   └─────────────┘
         ↓
   ┌──────────────────────────┐
   │  Start Both Servers      │
   │  • Terminal 1: Backend   │
   │  • Terminal 2: Frontend  │
   └──────────────────────────┘
         ↓
   ┌─────────────┐
   │  Code...    │  Make changes
   └─────────────┘
         ↓
   ┌─────────────┐
   │  Test       │  Verify in browser
   └─────────────┘
         ↓
   ┌─────────────┐
   │  git commit │  Save changes
   └─────────────┘
         ↓
   ┌─────────────┐
   │  git push   │  Share changes
   └─────────────┘
         ↓
      End Work
```

---

## Troubleshooting Decision Tree

```
         Problem?
             ↓
    ┌────────┴─────────┐
    │                  │
Port in use?      Module error?
    │                  │
    ↓                  ↓
Kill process    Delete node_modules
    │           npm install
    ↓                  │
Restart server         │
    │                  │
    └─────────┬────────┘
              ↓
         Still broken?
              ↓
    ┌─────────┴──────────┐
    │                    │
Database error?    Connection error?
    │                    │
    ↓                    ↓
npx prisma        Check .env file
  db push --      Verify API_URL
  force-reset     Restart servers
    │                    │
    └─────────┬──────────┘
              ↓
        Check logs
              ↓
     (Terminal output &
      Browser Console)
```

---

## Success Checklist

After setup, verify these indicators:

```
✅ Terminal 1 shows:
   "✅ NoxShift API server running on port 5000"

✅ Terminal 2 shows:
   "➜  Local:   http://localhost:5173/"

✅ Browser shows:
   NoxShift login page (no errors)

✅ File system has:
   • node_modules/ folder
   • dev.db file
   • .env file

✅ Can perform:
   • Create account
   • Login
   • Navigate pages
   • See employee list
```

---

## Quick Commands Summary

```bash
# First Time Setup
git clone https://github.com/cmc-creator/NoxShift.git
cd NoxShift
npm install
cp .env.example .env
# Edit .env
npx prisma generate
npx prisma db push

# Daily Use
npm run server     # Terminal 1
npm run dev        # Terminal 2

# Database
npx prisma studio  # View database GUI

# Troubleshooting
rm -rf node_modules && npm install  # Reinstall
npx prisma db push --force-reset    # Reset DB
```

---

## Support Resources

| Resource                  | Link/Command          |
|---------------------------|-----------------------|
| Detailed Setup            | NEW_COMPUTER_SETUP.md |
| Platform Specific         | PLATFORM_SETUP.md     |
| Quick Checklist           | SETUP_CHECKLIST.md    |
| Main Documentation        | README.md             |
| Quick Start               | QUICKSTART.md         |
| Database GUI              | `npx prisma studio`   |

---

**Ready to start?** → [NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md)
