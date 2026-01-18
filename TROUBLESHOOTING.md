# 🔧 NoxShift Setup Troubleshooting Guide

Quick reference for fixing common setup issues.

## 🚀 Quick Start

**First Time Setup?** Run this command to check what's wrong:
```bash
node verify-setup.cjs
```

The script will tell you exactly what needs to be fixed.

---

## Common Error Messages & Solutions

### Error: "npm: command not found" or "node: command not found"

**Problem:** Node.js is not installed or not in your PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/ (version 18 or higher)
2. **Important:** Restart your terminal after installation
3. Verify: `node --version` and `npm --version`
4. If still doesn't work:
   - **Windows:** Add `C:\Program Files\nodejs` to PATH environment variable
   - **macOS/Linux:** Try `source ~/.bashrc` or `source ~/.zshrc`

---

### Error: "git: command not found"

**Problem:** Git is not installed.

**Solution:**
1. Install Git from https://git-scm.com/downloads
2. During Windows installation, choose "Git from the command line and also from 3rd-party software"
3. Restart your terminal
4. Verify: `git --version`

---

### Error: "Cannot find module 'xyz'" or "Module not found"

**Problem:** Dependencies are not installed or corrupted.

**Solution:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Error: "JWT_SECRET is not defined"

**Problem:** Missing `.env` file or JWT_SECRET not set.

**Solution:**
```bash
# 1. Create .env file
cp .env.example .env

# 2. Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Edit .env file and replace JWT_SECRET with the generated value
# JWT_SECRET="<paste-generated-secret-here>"
```

---

### Error: "@prisma/client did not initialize yet" or Prisma errors

**Problem:** Prisma client not generated or out of sync.

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# If still broken, reinstall Prisma
npm uninstall @prisma/client prisma
npm install @prisma/client prisma
npx prisma generate
npx prisma db push
```

---

### Error: "Port 5000 (or 5173) is already in use"

**Problem:** Another application is using the port.

**Solution:**

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace 1234 with actual PID from above)
taskkill /PID 1234 /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Alternative:** Change the port in `.env`:
```env
PORT=5001
```

---

### Error: "EACCES: permission denied" during npm install

**Problem:** Permission error installing packages.

**Solution:**

**macOS/Linux:**
```bash
# Configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try npm install again
npm install
```

**Windows:**
Run Command Prompt or PowerShell as Administrator, then:
```bash
npm install
```

---

### Error: Database connection errors or "Can't reach database server"

**Problem:** Database not initialized or corrupted.

**Solution:**
```bash
# Delete and recreate database
rm dev.db
npx prisma db push

# Verify it worked
ls -la dev.db  # Should show the file
```

---

### Error: Frontend shows blank page or "Failed to fetch"

**Problem:** Backend not running or wrong API URL.

**Solution:**
1. Make sure backend is running:
   ```bash
   npm run server
   ```
   Should show: "✅ NoxShift API server running on port 5000"

2. Check backend health in browser: http://localhost:5000/api/health
   Should show: `{"status":"ok",...}`

3. Verify `.env` has correct API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Restart frontend:
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

---

### Error: "Cannot read properties of undefined" or React errors

**Problem:** Frontend dependencies issue or cache problem.

**Solution:**
```bash
# Clear Vite cache and reinstall
rm -rf node_modules/.vite
rm -rf dist
npm install
npm run dev
```

---

### Error: npm install is very slow (taking 10+ minutes)

**Problem:** Installing from network drive or slow connection.

**Solutions:**
1. **If on network drive (Windows):**
   - Copy project to local drive (C:\)
   - Or use the provided `SETUP-LOCAL.bat` script

2. **Use npm cache:**
   ```bash
   npm install --prefer-offline
   ```

3. **Clear npm cache if corrupted:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

## Step-by-Step Troubleshooting Flow

```
Problem? → Run: node verify-setup.cjs
    ↓
Shows Errors?
    ↓
├─ Missing node_modules? → npm install
├─ Missing .env? → cp .env.example .env
├─ Prisma errors? → npx prisma generate, npx prisma db push
├─ Command not found? → Install Node.js and Git
└─ Port in use? → Kill process or change port
    ↓
Run verify-setup.cjs again
    ↓
All checks pass? → Start servers!
```

---

## Still Having Issues?

### 1. Check Prerequisites
- [ ] Node.js v18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed: `git --version`

### 2. Verify Project Structure
```bash
# Make sure you're in the right directory
pwd  # or cd on Windows

# Should show: /path/to/NoxShift

# Check key files exist
ls package.json prisma/schema.prisma src/main.tsx
```

### 3. Check for Error Messages
Run each command one by one and note where it fails:
```bash
npm install          # Should complete without errors
cp .env.example .env # Should create .env file
npx prisma generate  # Should generate client
npx prisma db push   # Should create database
npm run server       # Should start backend
npm run dev          # Should start frontend (in new terminal)
```

### 4. Look at the Logs
- **Terminal output:** Read error messages carefully
- **Browser console:** Press F12, check Console tab for errors
- **Backend logs:** Look at Terminal 1 where `npm run server` is running

### 5. Clean Slate Approach
If nothing works, try a fresh start:
```bash
# In your project directory
rm -rf node_modules package-lock.json dev.db .env
npm install
cp .env.example .env
# Edit .env to set JWT_SECRET
npx prisma generate
npx prisma db push
node verify-setup.cjs
```

---

## Platform-Specific Issues

### Windows-Specific

**Issue:** PowerShell scripts disabled
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned
```

**Issue:** Long path errors
```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### macOS-Specific

**Issue:** XCode command line tools missing
```bash
xcode-select --install
```

**Issue:** Using Apple Silicon and having issues
```bash
# Try using Rosetta
arch -x86_64 npm install
```

### Linux-Specific

**Issue:** Build tools missing
```bash
# Ubuntu/Debian
sudo apt install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"
```

---

## Get More Help

- **Detailed Setup:** [NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md)
- **Platform-Specific:** [PLATFORM_SETUP.md](PLATFORM_SETUP.md)
- **Checklist:** [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **Visual Flow:** [SETUP_FLOW.md](SETUP_FLOW.md)

---

## Success Indicators

When everything is working correctly, you should see:

**Terminal 1 (Backend):**
```
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
🚀 Environment: development
```

**Terminal 2 (Frontend):**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Browser (http://localhost:5173):**
- Login page loads without errors
- Can create account and login
- No error messages in browser console (F12)

**Files Created:**
- `node_modules/` folder (large, 100+ MB)
- `.env` file with your configuration
- `dev.db` file (SQLite database)

🎉 **If you see all these, you're ready to use NoxShift!**
