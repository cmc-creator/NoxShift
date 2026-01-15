import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Scheduler from './components/Scheduler'
import Basecamp from './pages/Basecamp'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
