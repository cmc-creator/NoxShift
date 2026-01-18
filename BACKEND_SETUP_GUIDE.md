# 🚀 NoxShift Backend Setup Guide for Push Notifications

## Overview
To enable **real-time push notifications** in NoxShift, you need to set up a backend infrastructure. This guide covers the complete setup process using **Firebase Cloud Messaging (FCM)** - the industry standard for mobile and web push notifications.

---

## 📋 Prerequisites
- Node.js installed (v18+ recommended)
- Firebase account (free tier available)
- Basic understanding of backend development
- NoxShift frontend already running

---

## 🔥 Option 1: Firebase Cloud Messaging (Recommended)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it **"NoxShift"**
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Cloud Messaging
1. In Firebase Console, click **"Cloud Messaging"** in left sidebar
2. Click **"Get Started"** if prompted
3. Go to **Project Settings** (gear icon) → **Cloud Messaging**
4. Copy your **Server Key** (keep this secret!)
5. Copy your **Sender ID**

### Step 3: Generate Web Credentials
1. In Cloud Messaging settings, scroll to **"Web configuration"**
2. Click **"Generate key pair"** under Web Push certificates
3. Copy the **VAPID Key** (you'll need this)

### Step 4: Install Firebase in NoxShift
```bash
cd C:\Users\ConnieCooper\NoxShift
npm install firebase
```

### Step 5: Create Environment Variables
Create a `.env` file in the root of NoxShift:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=noxshift.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=noxshift
VITE_FIREBASE_STORAGE_BUCKET=noxshift.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

**Important:** Add `.env` to your `.gitignore` file!

### Step 6: Create Service Worker
Create `public/firebase-messaging-sw.js`:

```javascript
// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "your_api_key_here",
  authDomain: "noxshift.firebaseapp.com",
  projectId: "noxshift",
  storageBucket: "noxshift.appspot.com",
  messagingSenderId: "your_sender_id_here",
  appId: "your_app_id_here"
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/noxshift-icon.png',
    badge: '/noxshift-badge.png',
    data: payload.data,
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### Step 7: Uncomment FCM Code
In `src/services/pushNotificationService.ts`, uncomment the Firebase initialization code:

```typescript
async initializeFCM(): Promise<void> {
  const { initializeApp } = await import('firebase/app');
  const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
  
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  
  // Get FCM token
  this.fcmToken = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  
  // Handle foreground messages
  onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    // Show notification to user
  });
}
```

### Step 8: Test Local Notifications
The frontend already supports **local notifications** (no backend required). Test it:

1. Go to Settings → Notifications
2. Click "Enable Notifications"
3. Grant permission in your browser
4. You should see a test notification!

---

## 🌐 Option 2: Backend API Server (Full Control)

If you want **full control** and custom logic, set up your own Node.js backend:

### Step 1: Create Backend Project
```bash
mkdir noxshift-backend
cd noxshift-backend
npm init -y
npm install express cors dotenv firebase-admin body-parser
```

### Step 2: Create Server (`server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Store user tokens (in production, use a database)
const userTokens = new Map();

// Register device token
app.post('/api/notifications/register', (req, res) => {
  const { userId, token } = req.body;
  userTokens.set(userId, token);
  res.json({ success: true, message: 'Token registered' });
});

// Send notification to specific user
app.post('/api/notifications/send', async (req, res) => {
  const { userId, title, body, data } = req.body;
  const token = userTokens.get(userId);
  
  if (!token) {
    return res.status(404).json({ error: 'User token not found' });
  }
  
  try {
    const message = {
      notification: { title, body },
      data: data || {},
      token: token
    };
    
    const response = await admin.messaging().send(message);
    res.json({ success: true, messageId: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Broadcast to all users
app.post('/api/notifications/broadcast', async (req, res) => {
  const { title, body, data } = req.body;
  const tokens = Array.from(userTokens.values());
  
  if (tokens.length === 0) {
    return res.status(400).json({ error: 'No registered tokens' });
  }
  
  try {
    const message = {
      notification: { title, body },
      data: data || {},
      tokens: tokens
    };
    
    const response = await admin.messaging().sendEachForMulticast(message);
    res.json({ 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule-specific notifications
app.post('/api/notifications/shift-reminder', async (req, res) => {
  const { userId, shiftTime, shiftRole } = req.body;
  
  await sendNotification(userId, {
    title: '⏰ Shift Reminder',
    body: `Your ${shiftRole} shift starts at ${shiftTime}`,
    data: { type: 'shift_reminder', url: '/scheduler' }
  });
  
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`NoxShift Backend running on port ${PORT}`);
});
```

### Step 3: Get Firebase Service Account Key
1. In Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"**
3. Save as `serviceAccountKey.json` in backend folder
4. **Keep this file secret!** Add to `.gitignore`

### Step 4: Start Backend
```bash
node server.js
```

### Step 5: Connect Frontend to Backend
Update `src/services/pushNotificationService.ts`:

```typescript
async registerToken(userId: string): Promise<void> {
  if (!this.fcmToken) {
    throw new Error('FCM token not available');
  }
  
  await fetch('http://localhost:3001/api/notifications/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token: this.fcmToken })
  });
}
```

---

## 📱 Option 3: Progressive Web App (PWA) Setup

To enable notifications even when the browser is closed:

### Step 1: Create Manifest
Create `public/manifest.json`:

```json
{
  "name": "NoxShift",
  "short_name": "NoxShift",
  "description": "Revolutionary Employee Scheduling Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e1b4b",
  "theme_color": "#8b5cf6",
  "icons": [
    {
      "src": "/noxshift-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/noxshift-icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "gcm_sender_id": "YOUR_SENDER_ID_HERE"
}
```

### Step 2: Add Manifest to HTML
In `index.html`:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#8b5cf6">
```

---

## 🎯 Use Cases for Notifications

Once set up, you can send notifications for:

### 1. **Shift Reminders**
```javascript
// 30 minutes before shift
{
  title: "⏰ Shift Starting Soon",
  body: "Your shift starts in 30 minutes",
  data: { url: "/scheduler", type: "shift_reminder" }
}
```

### 2. **Schedule Changes**
```javascript
{
  title: "📅 Schedule Updated",
  body: "Your Thursday shift has been moved to 2 PM",
  data: { url: "/scheduler", type: "schedule_change" }
}
```

### 3. **Time-Off Approval**
```javascript
{
  title: "✅ Time-Off Approved",
  body: "Your vacation request for March 15-20 has been approved",
  data: { url: "/timeoff", type: "timeoff_approved" }
}
```

### 4. **Shift Swap Requests**
```javascript
{
  title: "🔄 Shift Swap Request",
  body: "John wants to swap shifts with you on Friday",
  data: { url: "/scheduler", type: "swap_request" }
}
```

### 5. **Open Shift Alerts**
```javascript
{
  title: "🆘 Open Shift Available",
  body: "Saturday 6 PM - 2 AM shift needs coverage",
  data: { url: "/scheduler", type: "open_shift" }
}
```

### 6. **Achievement Unlocked**
```javascript
{
  title: "🏆 Achievement Unlocked!",
  body: "You've completed 30 consecutive shifts!",
  data: { url: "/basecamp", type: "achievement" }
}
```

---

## ✅ Testing Your Setup

1. **Test Local Notifications** (works now):
   - Go to Settings → Notifications
   - Click "Enable Notifications"
   - Should see instant test notification

2. **Test FCM** (after Firebase setup):
   - Use Firebase Console → Cloud Messaging → "Send test message"
   - Enter your FCM token from browser console
   - Send test notification

3. **Test Backend API** (after server setup):
   ```bash
   curl -X POST http://localhost:3001/api/notifications/broadcast \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","body":"Backend working!"}'
   ```

---

## 🔐 Security Best Practices

1. **Never commit secrets**:
   - Add `.env` to `.gitignore`
   - Add `serviceAccountKey.json` to `.gitignore`

2. **Use environment variables**:
   - Store all API keys in `.env`
   - Use `import.meta.env.VITE_*` in frontend

3. **Validate tokens**:
   - Verify user authentication before sending
   - Implement rate limiting on backend

4. **HTTPS required**:
   - Push notifications only work over HTTPS
   - Use Netlify/Vercel for free HTTPS

---

## 🚀 Deployment Considerations

### Frontend (Vite + React)
- Deploy to **Netlify** or **Vercel** (free HTTPS)
- Set environment variables in hosting dashboard
- Register service worker on production domain

### Backend (Node.js)
- Deploy to **Railway**, **Render**, or **Heroku**
- Use environment variables for secrets
- Enable CORS for your frontend domain

### Database (Optional)
- Store user tokens in **PostgreSQL** or **MongoDB**
- Track notification history
- Manage user preferences

---

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://web.dev/push-notifications/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

## 💡 Quick Start Summary

**Easiest Path (Local Notifications Only):**
- Already working! ✅
- No backend needed
- Go to Settings → Enable Notifications

**Medium Path (Firebase):**
1. Create Firebase project (5 min)
2. Add config to `.env` (2 min)
3. Install `npm install firebase` (1 min)
4. Uncomment code in service (2 min)
5. **Total: ~10 minutes**

**Advanced Path (Custom Backend):**
1. Set up Node.js server (15 min)
2. Configure Firebase Admin SDK (10 min)
3. Deploy backend to Railway/Render (10 min)
4. Connect frontend to backend (5 min)
5. **Total: ~40 minutes**

---

## 🎉 You're Ready!

The frontend framework is **already built** and waiting. Just follow this guide when you're ready to add the backend! 

Current status:
- ✅ Local notifications working
- ✅ UI components ready
- ✅ Service worker structure in place
- ⏳ Firebase setup (when you're ready)
- ⏳ Backend API (optional, when needed)
