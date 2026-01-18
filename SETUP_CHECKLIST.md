# ✅ NoxShift Setup Checklist

Use this checklist when setting up NoxShift on a new computer.

## Prerequisites Installation

- [ ] **Node.js v18+** installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **npm** installed (comes with Node.js)
  ```bash
  npm --version
  ```

- [ ] **Git** installed
  ```bash
  git --version
  ```

## Repository Setup

- [ ] **Clone repository**
  ```bash
  git clone https://github.com/cmc-creator/NoxShift.git
  cd NoxShift
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  *Wait for completion (may take 2-5 minutes)*

## Configuration

- [ ] **Create .env file**
  ```bash
  cp .env.example .env
  ```
  Or copy manually from `.env.example`

- [ ] **Update JWT_SECRET in .env**
  - Generate secure secret (min 32 characters)
  - Replace default value in `.env`

- [ ] **Update Firebase credentials** (optional)
  - Get from Firebase Console
  - Update all `VITE_FIREBASE_*` values in `.env`

## Database Setup

- [ ] **Generate Prisma Client**
  ```bash
  npx prisma generate
  ```

- [ ] **Initialize database**
  ```bash
  npx prisma db push
  ```

- [ ] **Verify dev.db created**
  - Check for `dev.db` file in project root

## Verify Setup (Recommended)

- [ ] **Run verification script**
  ```bash
  node verify-setup.cjs
  ```
  *Should show: "✅ Perfect! Everything is set up correctly."*
  
- [ ] **If errors found**
  - Follow the fix suggestions provided by the script
  - Re-run the script until all checks pass

## Start Application

- [ ] **Terminal 1: Start backend**
  ```bash
  npm run server
  ```
  *Should show: "✅ NoxShift API server running on port 5000"*

- [ ] **Terminal 2: Start frontend**
  ```bash
  npm run dev
  ```
  *Should show: "Local: http://localhost:5173/"*

## Verification

- [ ] **Open browser**
  - Navigate to http://localhost:5173

- [ ] **Create account**
  - Click "Sign Up"
  - Fill in details
  - Verify redirect to dashboard

- [ ] **Test features**
  - Navigate to Employees page
  - Navigate to Scheduler page
  - Check for API connection

## Optional Enhancements

- [ ] **Open Prisma Studio** (database GUI)
  ```bash
  npx prisma studio
  ```
  *Opens at http://localhost:5555*

- [ ] **Configure Firebase**
  - Set up Firebase project
  - Enable Authentication
  - Enable Firestore
  - Update `.env` with credentials

---

## Quick Reference

### Common Commands
```bash
# Install dependencies
npm install

# Start backend
npm run server

# Start frontend
npm run dev

# Database operations
npx prisma generate
npx prisma db push
npx prisma studio

# Build for production
npm run build
npm run preview
```

### Ports Used
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Prisma Studio:** http://localhost:5555

### Key Files
- `.env` - Environment variables (create this!)
- `dev.db` - SQLite database (auto-created)
- `package.json` - Dependencies
- `prisma/schema.prisma` - Database schema

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Errors
```bash
npx prisma db push --force-reset
npx prisma generate
```

---

## Success Indicators

✅ Backend shows: "NoxShift API server running on port 5000"
✅ Frontend shows: "Local: http://localhost:5173/"
✅ Can access application in browser
✅ Can create and login to account
✅ Database file `dev.db` exists
✅ No error messages in terminal or browser console

---

**Need more help?** See [NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md) for detailed guide.
