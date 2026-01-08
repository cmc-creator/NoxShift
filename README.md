# NoxShift - Employee Shift Scheduler

A modern, feature-rich employee shift scheduling application built with React, TypeScript, Node.js, and Prisma.

## Features

- 📅 **Smart Scheduling** - Create and manage employee schedules with drag-and-drop
- 👥 **Employee Management** - Track employee details, availability, and preferences
- 🔄 **Shift Swapping** - Allow employees to request shift swaps
- 📊 **Analytics & Reports** - View coverage rates, hours worked, and more
- ⏰ **Time Off Management** - Handle vacation and time-off requests
- 🔔 **Notifications** - Automated reminders for upcoming shifts
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide icons

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

<!-- Deployment trigger -->
