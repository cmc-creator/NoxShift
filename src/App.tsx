import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Scheduler from './components/Scheduler'
import Basecamp from './pages/Basecamp'
import CommandCenter from './pages/CommandCenter'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Employees from './pages/Employees'
import TimeOff from './pages/TimeOff'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

