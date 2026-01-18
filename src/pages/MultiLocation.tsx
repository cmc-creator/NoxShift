import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { MapPin, Plus, Building2, Users, Calendar, Settings, TrendingUp } from 'lucide-react'

export default function MultiLocation() {
  const [selectedLocation, setSelectedLocation] = useState('main')

  const locations = [
    { 
      id: 'main', 
      name: 'Main Campus', 
      address: '123 Healthcare Ave, Boston, MA', 
      employees: 45, 
      activeShifts: 12,
      utilization: 94,
      color: 'blue'
    },
    { 
      id: 'north', 
      name: 'North Clinic', 
      address: '456 Wellness Blvd, Cambridge, MA', 
      employees: 22, 
      activeShifts: 6,
      utilization: 88,
      color: 'green'
    },
    { 
      id: 'south', 
      name: 'South Medical Center', 
      address: '789 Care Street, Quincy, MA', 
      employees: 38, 
      activeShifts: 10,
      utilization: 91,
      color: 'purple'
    },
    { 
      id: 'urgent', 
      name: 'Urgent Care East', 
      address: '321 Emergency Lane, Somerville, MA', 
      employees: 18, 
      activeShifts: 8,
      utilization: 100,
      color: 'orange'
    },
  ]

  const crossLocationShifts = [
    { id: 1, employee: 'Sarah Johnson', from: 'Main Campus', to: 'North Clinic', date: '2026-01-20', time: '9:00 AM - 5:00 PM' },
    { id: 2, employee: 'Michael Chen', from: 'South Medical', to: 'Urgent Care East', date: '2026-01-21', time: '3:00 PM - 11:00 PM' },
    { id: 3, employee: 'Emily Davis', from: 'North Clinic', to: 'Main Campus', date: '2026-01-22', time: '7:00 AM - 3:00 PM' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <MapPin className="w-10 h-10 text-red-400" />
              Multi-Location Management
            </h1>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all hover:scale-105 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-blue-500/20 mb-3">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">4</div>
              <div className="text-purple-200 text-sm">Total Locations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-green-500/20 mb-3">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">123</div>
              <div className="text-purple-200 text-sm">Total Employees</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-purple-500/20 mb-3">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">36</div>
              <div className="text-purple-200 text-sm">Active Shifts</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-orange-500/20 mb-3">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">93%</div>
              <div className="text-purple-200 text-sm">Avg Utilization</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Locations Grid */}
            <div className="lg:col-span-2 space-y-4">
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className={`bg-white/10 backdrop-blur-xl border-2 rounded-2xl shadow-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedLocation === location.id ? `border-${location.color}-500` : 'border-white/20'
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-${location.color}-500/20 rounded-xl`}>
                        <Building2 className={`w-8 h-8 text-${location.color}-400`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{location.name}</h3>
                        <div className="flex items-center gap-2 text-purple-200 text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          {location.address}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                      <Settings className="w-5 h-5 text-purple-200" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">{location.employees}</div>
                      <div className="text-purple-200 text-xs">Employees</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">{location.activeShifts}</div>
                      <div className="text-purple-200 text-xs">Active Shifts</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className={`text-2xl font-bold mb-1 ${location.utilization >= 95 ? 'text-red-400' : 'text-green-400'}`}>
                        {location.utilization}%
                      </div>
                      <div className="text-purple-200 text-xs">Utilization</div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all">
                    View Schedule
                  </button>
                </div>
              ))}
            </div>

            {/* Cross-Location Shifts */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Cross-Location Shifts</h2>
              </div>

              <div className="space-y-3">
                {crossLocationShifts.map((shift) => (
                  <div key={shift.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-white font-semibold mb-2">{shift.employee}</div>
                    <div className="flex items-center gap-2 text-sm text-purple-200 mb-2">
                      <span className="text-red-400">{shift.from}</span>
                      <span>→</span>
                      <span className="text-green-400">{shift.to}</span>
                    </div>
                    <div className="text-purple-300 text-xs">{shift.date} • {shift.time}</div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all">
                Schedule Cross-Location Shift
              </button>
            </div>
          </div>

          {/* Location Comparison */}
          <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Location Utilization Comparison</h2>
            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center gap-4">
                  <div className="w-32 text-purple-200 font-semibold">{location.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-white/10 rounded-full h-8 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${location.color}-600 to-${location.color}-400 flex items-center justify-end pr-3 transition-all duration-500`}
                        style={{ width: `${location.utilization}%` }}
                      >
                        <span className="text-white font-bold text-sm">{location.utilization}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
