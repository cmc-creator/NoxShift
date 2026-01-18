import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Users, Calendar, Clock, AlertTriangle, TrendingUp, 
  CheckCircle, Activity, BarChart3, Bell, ArrowRight,
  DollarSign, Award, Target, Brain, Zap, Shield,
  UserCheck, Trophy, MessageSquare, Inbox,
  BarChart2, Sparkles, Crown, Command
} from 'lucide-react';

export default function CommandCenter() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-2xl">
              <Command className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-bold text-white drop-shadow-lg">Command Center</h1>
                <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-lg text-purple-300 mt-1">Manager Operations Hub</p>
            </div>
          </div>
          
          <Link to="/scheduler" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Open Scheduler
            </span>
          </Link>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-2 border-blue-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">47</p>
                <p className="text-sm text-blue-300">Total Staff</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-2 border-green-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">42</p>
                <p className="text-sm text-green-300">On Duty</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-2 border-purple-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">94%</p>
                <p className="text-sm text-purple-300">Attendance</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-2 border-orange-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">3</p>
                <p className="text-sm text-orange-300">Alerts</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-2 border-pink-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-pink-400" />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">8.5h</p>
                <p className="text-sm text-pink-300">Avg Shift</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Schedule Manager */}
          <Link to="/scheduler">
            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-purple-500/30 hover:border-purple-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
                <ArrowRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Schedule Manager</h3>
              <p className="text-purple-300 text-sm mb-4">View & edit schedules, manage shifts</p>
              <div className="flex items-center gap-2 text-sm text-purple-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live calendar</span>
              </div>
            </div>
          </Link>

          {/* Time Tracking */}
          <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-blue-500/30 hover:border-blue-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Time Tracking</h3>
            <p className="text-blue-300 text-sm mb-4">Monitor attendance & hours</p>
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <span className="font-bold">42</span>
              <span>employees on duty</span>
            </div>
          </div>

          {/* Team Management */}
          <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-green-500/30 hover:border-green-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-green-400 group-hover:translate-x-2 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Team Management</h3>
            <p className="text-green-300 text-sm mb-4">Manage employees & roles</p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span className="font-bold">47</span>
              <span>active employees</span>
            </div>
          </div>

          {/* Analytics */}
          <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-cyan-500/30 hover:border-cyan-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <BarChart2 className="w-8 h-8 text-cyan-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-cyan-300 text-sm mb-4">Reports & insights</p>
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <TrendingUp className="w-4 h-4" />
              <span>94% efficiency</span>
            </div>
          </div>

          {/* Payroll */}
          <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-2 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payroll</h3>
            <p className="text-emerald-300 text-sm mb-4">Review hours & process pay</p>
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <span className="font-bold">$45,230</span>
              <span>this period</span>
            </div>
          </div>

          {/* Requests */}
          <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-amber-500/30 hover:border-amber-500 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Inbox className="w-8 h-8 text-amber-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 group-hover:translate-x-2 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Time Off Requests</h3>
            <p className="text-amber-300 text-sm mb-4">Approve or deny requests</p>
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <span className="font-bold">5</span>
              <span>pending approval</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>NoxShift™ Command Center • Powered by AI • Real-time Operations</p>
        </div>
      </div>
      </div>
    </div>
  );
}
