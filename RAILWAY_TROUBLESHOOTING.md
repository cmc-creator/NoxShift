# 🚂 Railway Deployment Troubleshooting Guide

Quick reference for fixing Railway deployment issues for NoxShift.

---

## Common Error: "Environment variable not found: DATABASE_URL"

### Problem
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
  --> prisma/schema.prisma:10
```

### Root Cause
Railway can't access the `DATABASE_URL` environment variable during build or deployment.

### Solution

#### Option 1: Link PostgreSQL Service (Recommended)

1. **Go to Railway Dashboard**
   - URL: https://railway.app/dashboard
   - Select your project (e.g., "gregarious-nourishment")

2. **Click on your NoxShift service**

3. **Go to "Variables" tab**

4. **Add PostgreSQL Reference:**
   - Click "+ New Variable"
   - Click "Add Reference"
   - Select your PostgreSQL service
   - Choose `DATABASE_URL` from the dropdown
   - Click "Add"

5. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Select "Redeploy"

#### Option 2: Manual DATABASE_URL (If Option 1 Doesn't Work)

1. **Get the Database URL:**
   - Click on your **PostgreSQL service** in Railway
   - Go to "Variables" tab
   - Copy the full `DATABASE_URL` value
   - Format: `postgresql://user:password@host:port/database`

2. **Add to NoxShift Service:**
   - Click on your **NoxShift service**
   - Go to "Variables" tab
   - Click "+ New Variable"
   - Name: `DATABASE_URL`
   - Value: (paste the copied URL)
   - Click "Add"

3. **Redeploy** (as above)

---

## Required Environment Variables Checklist

Make sure these are set in your NoxShift service Variables:

- [ ] **DATABASE_URL** - PostgreSQL connection string (auto-linked or manual)
- [ ] **JWT_SECRET** - Random secure string (min 32 characters)
  ```
  Example: noxshift-production-secret-key-2026-minimum-32-characters-long
  ```
- [ ] **NODE_ENV** - `production`
- [ ] **PORT** - Railway auto-sets this, but you can manually add `5000`

**Optional Variables:**
- `VITE_FIREBASE_API_KEY` - If using Firebase
- `VITE_FIREBASE_AUTH_DOMAIN` - If using Firebase
- `VITE_FIREBASE_PROJECT_ID` - If using Firebase
- (Other Firebase vars as needed)

---

## Deployment Lifecycle

### Build Phase
```
npm install && npx prisma generate
```

**Common Issues:**
- ❌ `npm install` fails → Check package.json is valid
- ❌ `prisma generate` fails → DATABASE_URL needed during build
  - **Fix:** Make sure DATABASE_URL is set in Variables before build

### Deploy Phase
```
npx prisma db push --accept-data-loss && npx tsx server/index.js
```

**Common Issues:**
- ❌ `prisma db push` fails → DATABASE_URL not accessible
- ❌ Server won't start → Check PORT binding and dependencies

---

## Checking Deployment Logs

### Build Logs
1. Go to Railway → Your Project → NoxShift service
2. Click on a deployment
3. Select "Build Logs" tab

**What to Look For:**
```
✅ npm install completed
✅ prisma generate completed
✅ Build succeeded
```

**If Failed:**
```
❌ Error during build
   → Read the error message carefully
   → Usually missing dependencies or environment variables
```

### Deploy Logs
1. Same deployment → "Deploy Logs" tab

**Success Looks Like:**
```
Environment variables loaded from .env file
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "railway"
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
🚀 Environment: production
```

**Common Errors:**
- `DATABASE_URL not found` → Set the variable (see above)
- `Port already in use` → Railway should handle this automatically
- `Cannot find module` → Missing dependency in package.json

---

## Testing Your Deployment

### 1. Check Health Endpoint

Once deployment shows "Active", test:
```bash
curl https://noxshift-production.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "NoxShift API is running",
  "timestamp": "2026-01-19T..."
}
```

### 2. Check Database Connection

The health endpoint confirms the server is running. To verify database:
```bash
curl https://noxshift-production.up.railway.app/api/employees
```

Should return `[]` (empty array) or a 401 error (auth required) - both mean database is connected.

---

## Common Railway Issues

### Issue 1: "npm warn config production Use --omit=dev instead"

**Error in Logs:**
```
npm warn config production Use `--omit=dev` instead.
```

**Solution:** This is just a warning, not an error. Railway automatically sets `NODE_ENV=production`. You can ignore this warning.

### Issue 2: Railway Keeps Restarting

**Symptoms:** 
- Deployment shows "Restarted" multiple times
- "restartPolicyMaxRetries" being hit

**Causes:**
- Server crashes immediately after starting
- Port binding issue
- Missing environment variables
- Database connection fails

**Solution:**
1. Check Deploy Logs for the actual error
2. Make sure `DATABASE_URL` is accessible
3. Verify server binds to `0.0.0.0` not `localhost`
4. Check all required environment variables are set

### Issue 3: Build Succeeds but Deploy Fails

**Problem:** Build logs show success, but deployment crashes.

**Common Causes:**
- `DATABASE_URL` accessible during build but not deploy
- Server code has runtime errors
- Port binding incorrect

**Solution:**
1. Review Deploy Logs (not Build Logs)
2. Look for JavaScript errors or unhandled exceptions
3. Test locally with production-like environment:
   ```bash
   DATABASE_URL="postgresql://..." NODE_ENV=production npm run server
   ```

### Issue 4: "Cannot Find Module" Errors

**Error:**
```
Error: Cannot find module 'express'
Error: Cannot find module '@prisma/client'
```

**Solution:**
1. Make sure dependencies are in `dependencies` not `devDependencies`:
   ```json
   "dependencies": {
     "express": "^4.18.2",
     "@prisma/client": "^5.7.1",
     "prisma": "^5.7.1",
     "tsx": "^4.21.0"
   }
   ```

2. Railway uses `npm install --production` by default
3. Move any runtime dependencies from `devDependencies` to `dependencies`

### Issue 5: PostgreSQL Service Not Creating DATABASE_URL

**Problem:** PostgreSQL service exists but doesn't generate `DATABASE_URL`.

**Solution:**
1. Delete and recreate the PostgreSQL service:
   - Railway Dashboard → Your Project
   - Click "..." on PostgreSQL service → Remove
   - Click "+ New" → Database → PostgreSQL
   - Railway will auto-generate credentials

2. Re-link to NoxShift service (Option 1 above)

---

## Railway Configuration Files

### railway.json (Current)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npx prisma db push --accept-data-loss && npx tsx server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Key Points:**
- Uses Nixpacks (not Dockerfile)
- Generates Prisma client during build
- Pushes database schema on every deploy
- Restarts up to 10 times on failure

### Server Binding (Required for Railway)

**server/index.js must bind to 0.0.0.0:**
```javascript
const PORT = process.env.PORT || 5000;

// ✅ Correct - binds to all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ NoxShift API server running on port ${PORT}`);
});

// ❌ Wrong - only binds to localhost
app.listen(PORT, () => { ... });
```

---

## Debugging Checklist

When deployment fails:

1. **Check Variables:**
   - [ ] Go to NoxShift service → Variables
   - [ ] Verify `DATABASE_URL` exists and is linked
   - [ ] Verify `JWT_SECRET` exists
   - [ ] Verify `NODE_ENV=production`

2. **Check Logs:**
   - [ ] Go to latest deployment → Deploy Logs
   - [ ] Look for the first ERROR line
   - [ ] Note the error code (e.g., P1012)

3. **Check PostgreSQL Service:**
   - [ ] PostgreSQL service shows "Active"
   - [ ] Variables tab shows `DATABASE_URL`
   - [ ] Can copy the connection string

4. **Verify Configuration:**
   - [ ] `railway.json` exists in repo root
   - [ ] `prisma/schema.prisma` uses PostgreSQL
   - [ ] `package.json` has all dependencies
   - [ ] Server binds to `0.0.0.0`

5. **Test Locally:**
   - [ ] Can run server locally with PostgreSQL URL
   - [ ] `npm install` works
   - [ ] `npx prisma generate` works
   - [ ] `npx prisma db push` works

---

## Getting More Help

### Railway Support
- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Status:** https://railway.statuspage.io

### Project-Specific
- **GitHub Issues:** https://github.com/cmc-creator/NoxShift/issues
- **Deployment Checkpoint:** See `CHECKPOINT_2026-01-18_RAILWAY_DEPLOYMENT.md`
- **General Deployment:** See `DEPLOYMENT.md`

---

## Success Indicators

When everything works correctly:

**Railway Dashboard:**
- ✅ PostgreSQL service: Active
- ✅ NoxShift service: Active (green)
- ✅ Latest deployment: Successful

**Deploy Logs Show:**
```
✅ NoxShift API server running on port 5000
📡 Health check: http://localhost:5000/api/health
🚀 Environment: production
```

**Health Endpoint Works:**
```bash
$ curl https://noxshift-production.up.railway.app/api/health
{"status":"ok","message":"NoxShift API is running","timestamp":"..."}
```

**Next Steps:**
1. Update Vercel frontend with Railway backend URL
2. Test full application end-to-end
3. Monitor Railway metrics for performance

---

## Quick Commands

```bash
# Test health endpoint
curl https://noxshift-production.up.railway.app/api/health

# Test with verbose output
curl -v https://noxshift-production.up.railway.app/api/health

# Test employee endpoint (requires auth)
curl https://noxshift-production.up.railway.app/api/employees

# Check if server is responding at all
ping noxshift-production.up.railway.app
```

---

**Last Updated:** January 19, 2026
**Railway Project:** gregarious-nourishment
**Production URL:** https://noxshift-production.up.railway.app
