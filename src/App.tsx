import { ThemeProvider } from './context/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Scheduler from './components/Scheduler'
import Basecamp from './pages/Basecamp'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Scheduler />} />
          <Route path="/basecamp" element={<Basecamp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
