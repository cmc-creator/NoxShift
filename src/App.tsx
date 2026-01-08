import { ThemeProvider } from './context/ThemeContext'
import Scheduler from './components/Scheduler'

function App() {
  return (
    <ThemeProvider>
      <Scheduler />
    </ThemeProvider>
  )
}

export default App
