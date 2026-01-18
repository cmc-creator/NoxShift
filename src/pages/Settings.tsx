import Sidebar from '../components/Sidebar'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { Settings as SettingsIcon, Palette, Bell, Lock, User, Globe } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-purple-400" />
            Settings
          </h1>
          
          {/* Theme Settings */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Appearance</h2>
            </div>
            <p className="text-purple-200 mb-4">Choose your preferred theme</p>
            <ThemeSwitcher />
          </div>

          {/* Notifications Settings */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Push Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">SMS Notifications</span>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </label>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account</h2>
            </div>
            <p className="text-purple-200">Account settings coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
