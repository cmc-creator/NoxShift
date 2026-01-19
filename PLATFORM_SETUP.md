# 🖥️ Platform-Specific Setup Instructions

Quick setup guides for different operating systems.

---

## Windows Setup

### Prerequisites

1. **Install Node.js:**
   - Download from https://nodejs.org/
   - Run the installer (`.msi` file)
   - Choose "Add to PATH" during installation
   - Restart terminal after installation

2. **Install Git:**
   - Download from https://git-scm.com/download/win
   - Run installer with default settings
   - Choose "Git from the command line and 3rd-party software"

### Setup Steps

```powershell
# Open PowerShell or Command Prompt

# Clone repository
git clone https://github.com/cmc-creator/NoxShift.git
cd NoxShift

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Generate Prisma Client
npx prisma generate

# Initialize database
npx prisma db push

# Start backend (in first terminal)
npm run server

# Start frontend (in second terminal - open new PowerShell)
npm run dev
```

### Windows Helper Scripts

The repository includes automated batch files for Windows environments:

**For Network/Portable Node.js Setups:**
```batch
# Automated full setup (copies to C:\Temp\NoxShift)
SETUP-LOCAL.bat

# Just install dependencies
install-dependencies.bat

# Start development server
start-dev.bat
```

**When to use these scripts:**
- You have a portable Node.js installation
- Your repository is on a network drive
- You need to copy the project to a local directory for better performance

**For standard installations:** Use the manual npm commands shown above instead.

### Common Windows Issues

**Issue:** "npm is not recognized"
- **Fix:** Restart terminal after Node.js installation
- **Fix:** Add Node.js to PATH manually:
  - System Properties → Environment Variables
  - Add `C:\Program Files\nodejs` to PATH

**Issue:** Scripts disabled in PowerShell
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned
```

---

## macOS Setup

### Prerequisites

1. **Install Homebrew** (if not installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js:**
   ```bash
   brew install node
   ```

3. **Install Git:**
   ```bash
   brew install git
   ```

### Setup Steps

```bash
# Open Terminal

# Clone repository
git clone https://github.com/cmc-creator/NoxShift.git
cd NoxShift

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Initialize database
npx prisma db push

# Start backend (in first terminal)
npm run server

# Start frontend (in second terminal - open new Terminal tab with Cmd+T)
npm run dev
```

### macOS Helper Commands

```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9

# Edit .env file
nano .env
# or
open -e .env
```

### Common macOS Issues

**Issue:** Permission denied errors
```bash
# Fix npm permissions
sudo chown -R $USER /usr/local/lib/node_modules
```

**Issue:** Command not found after Node.js install
```bash
# Reload shell configuration
source ~/.zshrc
# or for bash
source ~/.bash_profile
```

---

## Linux Setup

### Prerequisites (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
git --version
```

### Prerequisites (Fedora/RHEL/CentOS)

```bash
# Install Node.js
sudo dnf install nodejs

# Install Git
sudo dnf install git

# Verify installations
node --version
npm --version
git --version
```

### Setup Steps

```bash
# Clone repository
git clone https://github.com/cmc-creator/NoxShift.git
cd NoxShift

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Initialize database
npx prisma db push

# Start backend (in first terminal)
npm run server

# Start frontend (in second terminal - Ctrl+Shift+T for new tab)
npm run dev
```

### Linux Helper Commands

```bash
# Kill process on port
sudo kill -9 $(sudo lsof -t -i:5000)

# Edit .env file
nano .env
# or
vim .env

# Check running processes
ps aux | grep node
```

### Common Linux Issues

**Issue:** EACCES permission errors
```bash
# Configure npm to use different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Issue:** Port already in use
```bash
# Find and kill process
sudo lsof -i :5000
sudo kill -9 <PID>
```

---

## Docker Setup (All Platforms)

If you prefer using Docker:

### Prerequisites
- Install Docker Desktop
  - **Windows:** https://docs.docker.com/desktop/install/windows-install/
  - **macOS:** https://docs.docker.com/desktop/install/mac-install/
  - **Linux:** https://docs.docker.com/desktop/install/linux-install/

### Using Docker (Coming Soon)

*Note: Dockerfile configuration is planned for future releases.*

---

## Environment Variables by Platform

### All Platforms

Create `.env` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (generate a secure one!)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Firebase (optional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API URL
VITE_API_URL=http://localhost:5000/api
```

### Generate Secure JWT_SECRET

**All platforms (Node.js):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Alternative (OpenSSL - macOS/Linux):**
```bash
openssl rand -base64 32
```

---

## Editor Setup

### Visual Studio Code (Recommended)

**Install Extensions:**
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense

**Open Project:**
```bash
code .
```

### Other Editors

- **WebStorm/IntelliJ IDEA:** Open folder directly
- **Sublime Text:** `subl .`
- **Vim/Neovim:** `vim .`

---

## Verifying Installation

### Health Check Script

Create this test script to verify everything works:

**test-setup.sh** (macOS/Linux):
```bash
#!/bin/bash
echo "Testing NoxShift Setup..."
echo ""
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version)"
echo ""
echo "Checking files..."
test -f package.json && echo "✓ package.json exists" || echo "✗ package.json missing"
test -f .env && echo "✓ .env exists" || echo "✗ .env missing (create it!)"
test -d node_modules && echo "✓ node_modules exists" || echo "✗ node_modules missing (run npm install)"
test -f dev.db && echo "✓ dev.db exists" || echo "✗ dev.db missing (run npx prisma db push)"
echo ""
echo "Setup check complete!"
```

**test-setup.bat** (Windows):
```batch
@echo off
echo Testing NoxShift Setup...
echo.
node --version
npm --version
git --version
echo.
echo Checking files...
if exist package.json (echo ✓ package.json exists) else (echo ✗ package.json missing)
if exist .env (echo ✓ .env exists) else (echo ✗ .env missing - create it!)
if exist node_modules (echo ✓ node_modules exists) else (echo ✗ node_modules missing - run npm install)
if exist dev.db (echo ✓ dev.db exists) else (echo ✗ dev.db missing - run npx prisma db push)
echo.
echo Setup check complete!
pause
```

---

## Platform-Specific Troubleshooting

### Windows-Specific

**Antivirus/Windows Defender blocking npm:**
- Add exception for `node_modules` folder
- Add exception for npm cache: `%AppData%\npm-cache`

**Long path issues:**
```powershell
# Enable long paths (run as Administrator)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### macOS-Specific

**XCode Command Line Tools missing:**
```bash
xcode-select --install
```

**Rosetta for Apple Silicon:**
```bash
# If using ARM Mac and having issues
arch -x86_64 npm install
```

### Linux-Specific

**Build tools missing:**
```bash
# Ubuntu/Debian
sudo apt install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"
```

---

## Next Steps

After successful setup on your platform:

1. ✅ Open http://localhost:5173
2. ✅ Create your first account
3. ✅ Add employees
4. ✅ Start scheduling!

See [NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md) for detailed usage guide.
