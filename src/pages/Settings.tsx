import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ThemeSelector from '../components/ThemeSelector'
import PushNotificationSetup from '../components/PushNotificationSetup'
import { useTheme } from '../context/ThemeContext'
import { Settings as SettingsIcon, Palette, Bell, Lock, User, Globe, Calendar, Clock, Eye, Languages, Sliders, Moon, Sun, Monitor, Type, Zap, Save, Shield } from 'lucide-react'

export default function Settings() {
  const { fontFamily, setFontFamily, fontSize, setFontSize } = useTheme()
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [weekStartDay, setWeekStartDay] = useState('monday')
  const [timeFormat, setTimeFormat] = useState('12h')
  const [defaultView, setDefaultView] = useState('shift-matrix')
  const [autoSave, setAutoSave] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('America/New_York')

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-purple-400" />
            Settings & Customization
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
          {/* Theme & Appearance */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Appearance</h2>
            </div>
            
            <button 
              onClick={() => setShowThemeSelector(true)}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold mb-4 transition-all hover:scale-105"
            >
              🎨 Choose from 40+ Themes
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Family
                </label>
                <select 
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="system-ui, -apple-system, sans-serif">System Default</option>
                  <option value='"Inter", sans-serif'>Inter</option>
                  <option value='"Poppins", sans-serif'>Poppins</option>
                  <option value='"Roboto", sans-serif'>Roboto</option>
                  <option value='"Montserrat", sans-serif'>Montserrat</option>
                  <option value='"Fira Code", monospace'>Fira Code</option>
                  <option value='"Comic Sans MS", cursive'>Comic Sans MS</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">Font Size: {fontSize}px</label>
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Accessibility</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Reduced Motion</span>
                <input 
                  type="checkbox" 
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="w-5 h-5 rounded" 
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">High Contrast Mode</span>
                <input 
                  type="checkbox" 
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-5 h-5 rounded" 
                />
              </label>
            </div>
          </div>

          {/* Calendar Preferences */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Calendar</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">Week Starts On</label>
                <select 
                  value={weekStartDay}
                  onChange={(e) => setWeekStartDay(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">Default Calendar View</label>
                <select 
                  value={defaultView}
                  onChange={(e) => setDefaultView(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="shift-matrix">Shift Matrix</option>
                  <option value="bigcalendar">Modern Calendar</option>
                  <option value="month">Month View</option>
                  <option value="week">Week View</option>
                  <option value="day">Day View</option>
                  <option value="timeline">Timeline</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">Time Format</label>
                <select 
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="12h">12-hour (9:00 AM)</option>
                  <option value="24h">24-hour (09:00)</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Auto-Save Changes
                </span>
                <input 
                  type="checkbox" 
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-5 h-5 rounded" 
                />
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            
            {/* Push Notification Setup Component */}
            <div className="mb-4">
              <PushNotificationSetup />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">SMS Notifications</span>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Schedule Changes</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Shift Reminders</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-purple-200">Time-Off Approvals</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Regional</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Language
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timezone
                </label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEDT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account & Security */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account & Security</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all border border-white/10 hover:border-purple-400">
                <User className="w-6 h-6 mb-2 mx-auto" />
                Edit Profile
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all border border-white/10 hover:border-purple-400">
                <Lock className="w-6 h-6 mb-2 mx-auto" />
                Change Password
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all border border-white/10 hover:border-purple-400">
                <Shield className="w-6 h-6 mb-2 mx-auto" />
                Enable 2FA
              </button>
            </div>
          </div>

          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all hover:scale-105 flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save All Settings
            </button>
          </div>
        </div>
      </main>

      {showThemeSelector && <ThemeSelector onClose={() => setShowThemeSelector(false)} />}
    </div>
  )
}
