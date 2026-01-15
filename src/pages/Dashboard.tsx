import Sidebar from '../components/Sidebar'
import { Calendar, Users, Clock, TrendingUp, Zap, Shield, Sparkles, Trophy } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Zap className="relative w-16 h-16 text-cyan-400" />
              </div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                NoxShift
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The Revolutionary Employee Scheduling Platform with AI-Powered Intelligence & Gamification
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-300">Gamified</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              title="Total Employees"
              value="124"
              change="+12%"
              gradient="from-cyan-500/20 to-blue-500/20"
            />
            <StatCard
              icon={<Calendar className="w-8 h-8 text-green-400" />}
              title="Scheduled Shifts"
              value="456"
              change="+8%"
              gradient="from-green-500/20 to-emerald-500/20"
            />
            <StatCard
              icon={<Clock className="w-8 h-8 text-yellow-400" />}
              title="Hours This Week"
              value="2,340"
              change="+5%"
              gradient="from-yellow-500/20 to-amber-500/20"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
              title="Coverage Rate"
              value="98%"
              change="+2%"
              gradient="from-purple-500/20 to-pink-500/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Upcoming Shifts</h2>
              <div className="space-y-4">
                <ShiftItem name="John Doe" time="8:00 AM - 4:00 PM" role="Manager" />
                <ShiftItem name="Jane Smith" time="9:00 AM - 5:00 PM" role="Staff" />
                <ShiftItem name="Mike Johnson" time="2:00 PM - 10:00 PM" role="Staff" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition font-semibold shadow-lg hover:shadow-cyan-500/50">
                  Create New Schedule
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition font-semibold shadow-lg hover:shadow-green-500/50">
                  Add Employee
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition font-semibold shadow-lg hover:shadow-purple-500/50">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, change, gradient }: { icon: React.ReactNode; title: string; value: string; change: string; gradient: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-sm font-bold text-green-400 bg-green-400/20 px-3 py-1 rounded-full">{change}</span>
      </div>
      <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  )
}

function ShiftItem({ name, time, role }: { name: string; time: string; role: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition">
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
      <p className="text-sm text-cyan-400 font-medium">{time}</p>
    </div>
  )
}
