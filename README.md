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

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

3. Set up the database:
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
