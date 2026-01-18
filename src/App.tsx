import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { NotificationToast, useNotifications } from './components/NotificationToast'
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'

function AppContent() {
  useKeyboardShortcuts();
  const { notifications, removeNotification } = useNotifications();

  return (
    <>
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      <KeyboardShortcutsHelp />
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

