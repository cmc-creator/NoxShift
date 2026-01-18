import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Command, Users, Calendar, Clock, FileText, Settings, LogOut, Crown, Home, BarChart2, LayoutDashboard } from 'lucide-react'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { path: '/command-center', icon: Command, label: 'Command Center', highlight: true },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scheduler', icon: Calendar, label: 'Scheduler' },
    { path: '/basecamp', icon: Home, label: 'Basecamp' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/timeoff', icon: Clock, label: 'Time Off' },
    { path: '/reports', icon: BarChart2, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 text-white flex flex-col border-r border-purple-500/20 shadow-2xl">
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">NoxSHIFT</h1>
            <p className="text-purple-300 text-xs">Workforce Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              } ${item.highlight ? 'border-2 border-yellow-400/30' : ''}`}
            >
              <Icon className={`w-5 h-5 ${item.highlight ? 'text-yellow-400' : ''}`} />
              <span className="font-semibold">{item.label}</span>
              {item.highlight && <Crown className="w-4 h-4 text-yellow-400 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-purple-500/20">
        <div className="flex items-center gap-3 px-4 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="font-bold text-white">A</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">Admin User</p>
            <p className="text-xs text-purple-300">Manager</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
