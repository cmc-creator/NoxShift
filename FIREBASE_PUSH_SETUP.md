# Firebase Push Notifications - Quick Setup

## ✅ What's Already Done:
- Firebase project connected: `noxshift-2617b`
- Service worker created: `public/firebase-messaging-sw.js`
- Push notification service activated
- UI component ready in Settings

## 🔑 Get Your VAPID Key (2 minutes):

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **noxshift-2617b**
3. Click gear icon → **Project Settings**
4. Go to **Cloud Messaging** tab
5. Scroll to **Web Push certificates**
6. Click **Generate key pair** button
7. Copy the key that appears

## 📝 Add VAPID Key to Your Project:

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

**Important:** Don't commit the `.env` file to Git!

## 🧪 Test It:

1. Run `npm run dev`
2. Go to Settings → Notifications
3. Click "Enable Notifications"
4. Allow notifications in browser
5. Check browser console for your FCM token
6. You should see a test notification!

## 📤 Send Test Notification from Firebase Console:

1. Firebase Console → **Cloud Messaging**
2. Click **Send your first message**
3. Enter title and body
4. Click **Send test message**
5. Paste your FCM token from browser console
6. Click **Test** button

You should receive the notification on your device!

## 🚀 Current Status:

- ✅ Firebase configured
- ✅ Service worker created
- ✅ FCM initialized
- ⏳ VAPID key needed (get from Firebase Console)
- ✅ Everything else ready to go!

Once you add the VAPID key, push notifications will work even when the browser is closed!
