import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, TrendingDown, Calendar, Clock, DollarSign, Users,
  Download, Filter, Home, Target, Award, Zap, Activity, FileText, PieChart
} from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'hours', name: 'Hours Worked', icon: Clock },
    { id: 'payroll', name: 'Payroll', icon: DollarSign },
    { id: 'attendance', name: 'Attendance', icon: Users },
    { id: 'performance', name: 'Performance', icon: Target },
  ];

  const quickStats = [
    { label: 'Total Hours', value: '1,284', change: '+12%', icon: Clock, color: 'blue' },
    { label: 'Labor Cost', value: '$45,680', change: '+8%', icon: DollarSign, color: 'green' },
    { label: 'Attendance Rate', value: '96%', change: '+2%', icon: Users, color: 'purple' },
    { label: 'Overtime Hours', value: '142', change: '-5%', icon: Zap, color: 'orange' },
  ];

  const monthlyData = [
    { month: 'Jul', hours: 1150, cost: 42000 },
    { month: 'Aug', hours: 1200, cost: 43500 },
    { month: 'Sep', hours: 1180, cost: 42800 },
    { month: 'Oct', hours: 1250, cost: 45200 },
    { month: 'Nov', hours: 1220, cost: 44100 },
    { month: 'Dec', hours: 1284, cost: 45680 },
  ];

  const departmentData = [
    { name: 'Nursing', hours: 520, employees: 12, utilization: 94 },
    { name: 'Front Desk', hours: 280, employees: 7, utilization: 88 },
    { name: 'Clinical', hours: 240, employees: 6, utilization: 92 },
    { name: 'Laboratory', hours: 160, employees: 4, utilization: 96 },
    { name: 'Pharmacy', hours: 84, employees: 3, utilization: 85 },
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', hours: 168, rating: 4.9, dept: 'Nursing' },
    { name: 'Michael Chen', hours: 160, rating: 4.7, dept: 'Clinical' },
    { name: 'Emily Davis', hours: 156, rating: 4.8, dept: 'Laboratory' },
    { name: 'Izzy Cooper', hours: 152, rating: 4.8, dept: 'Front Desk' },
    { name: 'James Wilson', hours: 128, rating: 4.6, dept: 'Pharmacy' },
  ];

  const maxHours = Math.max(...monthlyData.map(d => d.hours));
  const maxCost = Math.max(...monthlyData.map(d => d.cost));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="w-5 h-5 text-indigo-400" />
                <span className="text-white font-semibold">Back to Command Center</span>
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-indigo-400" />
                Analytics & Reports
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-bold transition-all">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.change.startsWith('+');
              return (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                    <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Types Sidebar */}
          <div className="space-y-2">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    selectedReport === type.id
                      ? 'bg-white/10 text-white border border-indigo-400'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{type.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Report Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hours & Cost Trend Chart */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400" />
                Monthly Trends
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Hours Chart */}
                <div>
                  <p className="text-indigo-200 mb-4 font-semibold">Total Hours Worked</p>
                  <div className="space-y-2">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center gap-3">
                        <span className="text-white font-semibold w-10">{data.month}</span>
                        <div className="flex-1 bg-white/5 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(data.hours / maxHours) * 100}%` }}
                          >
                            <span className="text-white text-xs font-bold">{data.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Chart */}
                <div>
                  <p className="text-indigo-200 mb-4 font-semibold">Labor Cost</p>
                  <div className="space-y-2">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center gap-3">
                        <span className="text-white font-semibold w-10">{data.month}</span>
                        <div className="flex-1 bg-white/5 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-600 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(data.cost / maxCost) * 100}%` }}
                          >
                            <span className="text-white text-xs font-bold">${(data.cost / 1000).toFixed(1)}k</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Department Performance
              </h2>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                      <span className="text-sm text-gray-300">{dept.employees} employees</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Total Hours</p>
                        <p className="text-xl font-bold text-white">{dept.hours}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Utilization</p>
                        <p className="text-xl font-bold text-white">{dept.utilization}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${dept.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Top Performers
              </h2>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{performer.name}</h3>
                      <p className="text-sm text-gray-300">{performer.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{performer.hours} hrs</p>
                      <p className="text-sm text-yellow-400 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {performer.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
