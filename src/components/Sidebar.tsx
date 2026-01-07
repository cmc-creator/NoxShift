import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, Clock, FileText, Settings } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/timeoff', icon: Clock, label: 'Time Off' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">NoxShift</h1>
        <p className="text-gray-400 text-sm mt-1">Shift Scheduler</p>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-sm text-gray-400">admin@noxshift.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
