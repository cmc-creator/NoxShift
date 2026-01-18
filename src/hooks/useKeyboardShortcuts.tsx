import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K - Command Center
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/command-center');
      }
      
      // Ctrl/Cmd + D - Dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }
      
      // Ctrl/Cmd + S - Scheduler
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        navigate('/scheduler');
      }
      
      // Ctrl/Cmd + B - Basecamp
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        navigate('/basecamp');
      }
      
      // Ctrl/Cmd + E - Employees
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        navigate('/employees');
      }
      
      // Ctrl/Cmd + P - Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
      
      // Ctrl/Cmd + , - Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        navigate('/settings');
      }

      // Escape - Go back or close modals
      if (e.key === 'Escape') {
        // Let individual components handle this
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
}
