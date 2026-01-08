# NoxShift Setup Guide

## ✅ What's Been Set Up

Your NoxShift employee shift scheduler has been successfully integrated with:

- ✅ React + TypeScript frontend with Vite
- ✅ Tailwind CSS with Inter font
- ✅ Firebase integration for real-time data sync
- ✅ Full scheduler code from your Gemini project
- ✅ Employee management
- ✅ Shift scheduling with drag-drop
- ✅ Department filtering
- ✅ Time off tracking
- ✅ Draft/Published shift workflow
- ✅ CSV export
- ✅ Cost calculations
- ✅ Print-friendly views

## 🔧 Required: Firebase Configuration

To use the scheduler, you need to set up Firebase:

### 1. Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "NoxShift" (or your preferred name)
4. Follow the setup wizard

### 2. Enable Firebase Services

In your Firebase console:
- Go to **Authentication** → Enable "Anonymous" sign-in
- Go to **Firestore Database** → Create database (start in test mode for development)

### 3. Get Your Firebase Config

1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Scroll down to "Your apps" → Click Web icon (</>) 
3. Register your app
4. Copy the Firebase configuration

### 4. Update `.env` File

Edit `C:\NoxShift\.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_APP_ID=noxshift
```

## 🚀 Running the App

The dev server is already running! Open http://localhost:3000/

If you need to restart:

```powershell
cd C:\NoxShift
$env:Path = "\\192.168.168.182\Folder Redirection\Ccooper\Desktop\PortableNode\node-v24.12.0-win-x64;$env:Path"
npm.cmd run dev
```

## 📝 Features Overview

### Scheduler Features:
- **Calendar View**: Monthly calendar with color-coded shifts
- **Employee Management**: Add employees with hourly rates
- **Department Filtering**: Filter schedule by department
- **Draft Mode**: Create draft shifts before publishing
- **Time Off**: Mark employee unavailability
- **Conflict Detection**: Warns when double-booking employees
- **Copy/Paste**: Copy entire days or individual shifts
- **Stats Dashboard**: View hours and costs per employee
- **CSV Export**: Download schedule data
- **Theming**: 6 color themes and 3 font styles
- **Print Optimized**: Clean print layout

### Customization (Settings Panel):
- Manage employees and their rates
- Define roles (Reception, Manager, etc.)
- Create departments
- Set up shift time presets
- Customize appearance

## 🎯 Next Steps

1. **Set up Firebase** (see above) - Required for data persistence
2. **Add your team**: Use Settings → Employees to add your staff
3. **Create shifts**: Click any day to add a shift
4. **Customize**: Adjust roles, departments, and themes to fit your needs

## 📦 Project Structure

```
C:\NoxShift/
├── src/
│   ├── components/
│   │   └── Scheduler.tsx    # Main scheduler component
│   ├── firebase.config.ts    # Firebase configuration
│   ├── App.tsx               # App entry point
│   ├── index.css             # Tailwind styles
│   └── main.tsx              # React entry
├── package.json
├── .env                      # Environment variables (UPDATE THIS!)
└── vite.config.ts
```

## ⚠️ Important Notes

- The scheduler requires Firebase to save data
- Without Firebase config, shifts won't persist between sessions
- Test mode Firestore rules allow public read/write (secure this for production!)
- The app uses anonymous authentication by default

## 🐛 Troubleshooting

**If you see compilation errors:**
```powershell
cd C:\NoxShift
npm.cmd install
```

**If Firebase errors appear:**
- Check that `.env` file has correct Firebase credentials
- Verify Firestore and Authentication are enabled in Firebase Console

**To view errors:**
- Open browser DevTools (F12) and check Console tab

---

Your NoxShift scheduler is ready! Configure Firebase and start scheduling shifts! 🎉
