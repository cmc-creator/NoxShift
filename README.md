# NoxShift - Employee Shift Scheduler

A modern, feature-rich employee shift scheduling application built with React, TypeScript, Node.js, and Prisma.

## Features

- 📅 **Smart Scheduling** - Create and manage employee schedules with drag-and-drop
- 🎯 **Enhanced Shift Matrix View** - Visual grid with department color coding and role badges
- 👥 **Employee Management** - Track employee details, availability, and preferences
- 🔄 **Shift Swapping** - Allow employees to request shift swaps
- 📊 **Analytics & Reports** - View coverage rates, hours worked, and more
- ⏰ **Time Off Management** - Handle vacation and time-off requests
- 🔔 **Notifications** - Automated reminders for upcoming shifts
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide icons
- 🎨 **Department Color Coding** - 13 distinct department colors for easy identification

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/downloads)

## Quick Start

### 🆕 Setting up on a new computer?

**See [NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md)** for a complete step-by-step guide for cloning and setting up this repository on a new machine.

**Having issues?** Run `node verify-setup.cjs` to automatically check your setup and get specific fix suggestions.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cmc-creator/NoxShift.git
cd NoxShift
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
VITE_API_URL=http://localhost:5000/api
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

## Running the Application

### Development Mode

Start both frontend and backend:

**Frontend (Vite dev server):**
```bash
npm run dev
```
This starts the React app at http://localhost:3000

**Backend (Express server):**
```bash
npm run server
```
This starts the API server at http://localhost:5000

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
noxshift/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── server/                # Backend Express server
│   └── index.js           # API server
├── prisma/                # Database schema (to be added)
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

## Key Features Spotlight

### Enhanced Shift Matrix View

The shift matrix view provides a comprehensive grid layout for scheduling:

- **Period-Based Rows**: Organize shifts by Day (6am-2pm), Evening (2pm-10pm), and Night (10pm-6am)
- **Day-Based Columns**: View all shifts across the week (Sun-Sat)
- **Department Color Coding**: 13 distinct colors for instant department identification:
  - Nursing (Blue), Emergency (Red), Radiology (Green), Laboratory (Orange)
  - Pharmacy (Purple), Surgery (Rose), ICU (Sky Blue), Pediatrics (Pink)
  - Cardiology (Coral), Housekeeping (Cyan), Administration (Indigo)
  - Security (Lime), General (Light Blue)
- **Role Badges**: Quick role identification with 3-letter abbreviations
- **Enhanced Shift Cards**: Larger avatars, colored borders, hover tooltips
- **Drag-and-Drop**: Move shifts between days and periods seamlessly
- **Dark Mode Support**: Fully optimized for dark mode viewing

### View the Matrix

1. Navigate to the scheduler
2. Select "Shift Matrix" from the view dropdown
3. Use department filters to focus on specific teams
4. Drag shifts to reschedule, click to edit details

For detailed migration information, see [SHIFT_MATRIX_MIGRATION.md](SHIFT_MATRIX_MIGRATION.md).

## 📚 Documentation

### Setup & Installation Guides
- **[NEW_COMPUTER_SETUP.md](NEW_COMPUTER_SETUP.md)** - Complete guide for setting up on a new computer
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common setup issues and errors
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Quick checklist for setup verification
- **[PLATFORM_SETUP.md](PLATFORM_SETUP.md)** - Platform-specific instructions (Windows, macOS, Linux)
- **[SETUP_FLOW.md](SETUP_FLOW.md)** - Visual flow diagrams and quick reference
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide
- **[START_HERE.md](START_HERE.md)** - Backend quick start
- **verify-setup.cjs** - Automated setup verification script (run with `node verify-setup.cjs`)

### Deployment & Production
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Full deployment guide
- **[DEPLOY_NOW.md](DEPLOY_NOW.md)** - Quick deployment steps
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Additional deployment information
- **[PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)** - Production checklist

### Feature Documentation
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md)** - Feature implementation status
- **[SHIFT_MATRIX_MIGRATION.md](SHIFT_MATRIX_MIGRATION.md)** - Shift matrix view details
- **[CALENDAR_INTEGRATION.md](CALENDAR_INTEGRATION.md)** - Calendar features

### Integration & Setup Guides
- **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** - Backend setup details
- **[BACKEND_INTEGRATION_COMPLETE.md](BACKEND_INTEGRATION_COMPLETE.md)** - Backend integration status
- **[FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md)** - Firebase authentication setup
- **[FIREBASE_PUSH_SETUP.md](FIREBASE_PUSH_SETUP.md)** - Push notification setup

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database (or SQLite for development)

## Contributing

This is a personal project. Feel free to fork and customize for your needs!

## License

MIT License - feel free to use this project however you'd like.
