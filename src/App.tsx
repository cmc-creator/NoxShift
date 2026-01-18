import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Scheduler from './components/Scheduler'
import Basecamp from './pages/Basecamp'
import CommandCenter from './pages/CommandCenter'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Employees from './pages/Employees'
import TimeOff from './pages/TimeOff'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Payroll from './pages/Payroll'
import PerformanceReviews from './pages/PerformanceReviews'
import Training from './pages/Training'
import Compliance from './pages/Compliance'
import MultiLocation from './pages/MultiLocation'
import NotificationsCenter from './pages/NotificationsCenter'
import TeamCalendar from './pages/TeamCalendar'
import PhotoGallery from './pages/PhotoGallery'
import Leaderboards from './pages/Leaderboards'
import GoalTracker from './pages/GoalTracker'
import NewsFeed from './pages/NewsFeed'
import LiveChat from './pages/LiveChat'
import OrgChart from './pages/OrgChart'
import CareerPlanner from './pages/CareerPlanner'
import Mentorship from './pages/Mentorship'
import SkillMatrix from './pages/SkillMatrix'
import AdvancedAnalytics from './pages/AdvancedAnalytics'
import KronoAI from './components/KronoAI'
import MusicPlayer from './components/MusicPlayer'
import ProtectedRoute from './components/ProtectedRoute'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { NotificationToast, useNotifications } from './components/NotificationToast'
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'
import { Bot, Music } from 'lucide-react'

function AppContent() {
  useKeyboardShortcuts();
  const { notifications, removeNotification } = useNotifications();
  const [isKronoOpen, setIsKronoOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  return (
    <>
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      <KeyboardShortcutsHelp />
      
      {/* Krono AI Floating Button */}
      {!isKronoOpen && (
        <button
          onClick={() => setIsKronoOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group"
          title="Open Krono AI Assistant"
        >
          <Bot className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      )}
      
      {/* Music Player Floating Button */}
      <button
        onClick={() => setIsMusicOpen(!isMusicOpen)}
        className="fixed bottom-6 right-24 z-40 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group"
        title="Toggle Music Player"
      >
        <Music className="w-6 h-6 text-white" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
      
      <KronoAI isOpen={isKronoOpen} onClose={() => setIsKronoOpen(false)} />
      <MusicPlayer isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)} />
      
      <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/scheduler" 
              element={
                <ProtectedRoute>
                  <Scheduler />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/basecamp" 
              element={
                <ProtectedRoute>
                  <Basecamp />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/command-center" 
              element={
                <ProtectedRoute>
                  <CommandCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timeoff" 
              element={
                <ProtectedRoute>
                  <TimeOff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payroll" 
              element={
                <ProtectedRoute>
                  <Payroll />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/performance" 
              element={
                <ProtectedRoute>
                  <PerformanceReviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/training" 
              element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/compliance" 
              element={
                <ProtectedRoute>
                  <Compliance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/locations" 
              element={
                <ProtectedRoute>
                  <MultiLocation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <NotificationsCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <TeamCalendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/photos" 
              element={
                <ProtectedRoute>
                  <PhotoGallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboards" 
              element={
                <ProtectedRoute>
                  <Leaderboards />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <ProtectedRoute>
                  <GoalTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/news" 
              element={
                <ProtectedRoute>
                  <NewsFeed />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <LiveChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/org-chart" 
              element={
                <ProtectedRoute>
                  <OrgChart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/career" 
              element={
                <ProtectedRoute>
                  <CareerPlanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentorship" 
              element={
                <ProtectedRoute>
                  <Mentorship />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skills" 
              element={
                <ProtectedRoute>
                  <SkillMatrix />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AdvancedAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

