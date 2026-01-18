import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle, Filter, Search,
  User, Plane, Umbrella, Heart, Home, TrendingUp, MessageSquare, FileText
} from 'lucide-react';

interface TimeOffRequest {
  id: string;
  employee: string;
  type: 'vacation' | 'sick' | 'personal' | 'pto';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  submittedDate: string;
  approver?: string;
  notes?: string;
}

interface TimeOffBalance {
  employee: string;
  vacation: number;
  sick: number;
  personal: number;
  pto: number;
}

export default function TimeOff() {
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balances'>('requests');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showNewRequest, setShowNewRequest] = useState(false);

  const [requests, setRequests] = useState<TimeOffRequest[]>([
    {
      id: '1',
      employee: 'Izzy Cooper',
      type: 'vacation',
      startDate: '2026-02-15',
      endDate: '2026-02-20',
      days: 5,
      status: 'pending',
      reason: 'Family vacation',
      submittedDate: '2026-01-10'
    },
    {
      id: '2',
      employee: 'Sarah Johnson',
      type: 'sick',
      startDate: '2026-01-18',
      endDate: '2026-01-19',
      days: 2,
      status: 'approved',
      reason: 'Flu symptoms',
      submittedDate: '2026-01-17',
      approver: 'Manager',
      notes: 'Hope you feel better soon!'
    },
    {
      id: '3',
      employee: 'Michael Chen',
      type: 'pto',
      startDate: '2026-03-10',
      endDate: '2026-03-12',
      days: 3,
      status: 'approved',
      reason: 'Personal matters',
      submittedDate: '2026-01-08',
      approver: 'Manager'
    },
    {
      id: '4',
      employee: 'Emily Davis',
      type: 'vacation',
      startDate: '2026-04-01',
      endDate: '2026-04-07',
      days: 7,
      status: 'pending',
      reason: 'Spring break trip',
      submittedDate: '2026-01-12'
    },
    {
      id: '5',
      employee: 'James Wilson',
      type: 'personal',
      startDate: '2026-01-25',
      endDate: '2026-01-25',
      days: 1,
      status: 'denied',
      reason: 'Doctor appointment',
      submittedDate: '2026-01-11',
      approver: 'Manager',
      notes: 'Too many people already off this day. Please reschedule.'
    }
  ]);

  const balances: TimeOffBalance[] = [
    { employee: 'Izzy Cooper', vacation: 10, sick: 5, personal: 3, pto: 15 },
    { employee: 'Sarah Johnson', vacation: 8, sick: 3, personal: 2, pto: 12 },
    { employee: 'Michael Chen', vacation: 12, sick: 5, personal: 3, pto: 18 },
    { employee: 'Emily Davis', vacation: 6, sick: 4, personal: 1, pto: 10 },
    { employee: 'James Wilson', vacation: 15, sick: 5, personal: 3, pto: 20 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'denied': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'denied': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation': return { icon: <Plane className="w-5 h-5" />, color: 'text-blue-400' };
      case 'sick': return { icon: <Heart className="w-5 h-5" />, color: 'text-red-400' };
      case 'personal': return { icon: <User className="w-5 h-5" />, color: 'text-purple-400' };
      case 'pto': return { icon: <Umbrella className="w-5 h-5" />, color: 'text-green-400' };
      default: return { icon: <Calendar className="w-5 h-5" />, color: 'text-gray-400' };
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesType = filterType === 'all' || req.type === filterType;
    return matchesStatus && matchesType;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const totalDaysOff = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Back to Command Center</span>
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Calendar className="w-8 h-8 text-green-400" />
                Time Off Management
              </h1>
            </div>
            <button
              onClick={() => setShowNewRequest(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all"
            >
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Approved</p>
                  <p className="text-3xl font-bold text-white">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Days Off</p>
                  <p className="text-3xl font-bold text-white">{totalDaysOff}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Your Balance</p>
                  <p className="text-3xl font-bold text-white">15</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'requests', label: 'Requests', icon: FileText },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'balances', label: 'Balances', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-green-400'
                      : 'text-green-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="all">All Types</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick</option>
                <option value="personal">Personal</option>
                <option value="pto">PTO</option>
              </select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const typeInfo = getTypeIcon(request.type);
                return (
                  <div key={request.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-white/5 ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{request.employee}</h3>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          <p className="text-green-200 capitalize">{request.type} • {request.days} {request.days === 1 ? 'day' : 'days'}</p>
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold transition-all">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition-all">
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-green-200">
                        <Calendar className="w-4 h-4" />
                        {request.startDate} to {request.endDate}
                      </div>
                      <div className="flex items-center gap-2 text-green-200">
                        <Clock className="w-4 h-4" />
                        Submitted {request.submittedDate}
                      </div>
                    </div>
                    {request.reason && (
                      <div className="mb-3">
                        <p className="text-white"><span className="text-green-300 font-semibold">Reason:</span> {request.reason}</p>
                      </div>
                    )}
                    {request.notes && (
                      <div className="p-3 bg-white/5 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm text-white"><span className="text-yellow-300 font-semibold">Manager Notes:</span> {request.notes}</p>
                      </div>
                    )}
                    {request.approver && (
                      <p className="text-xs text-green-300 mt-2">Reviewed by {request.approver}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Time Off Calendar</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-green-300 py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => {
                const hasTimeOff = Math.random() > 0.8;
                return (
                  <div
                    key={i}
                    className={`aspect-square p-2 rounded-lg text-center ${
                      hasTimeOff ? 'bg-green-500/30 border-2 border-green-400' : 'bg-white/5'
                    }`}
                  >
                    <div className="text-white font-semibold">{i + 1}</div>
                    {hasTimeOff && (
                      <div className="text-xs text-green-300 mt-1">Off</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BALANCES TAB */}
        {activeTab === 'balances' && (
          <div className="grid grid-cols-1 gap-4">
            {balances.map((balance) => (
              <div key={balance.employee} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{balance.employee}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <Plane className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-blue-200 text-sm">Vacation</p>
                    <p className="text-2xl font-bold text-white">{balance.vacation} days</p>
                  </div>
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                    <Heart className="w-6 h-6 text-red-400 mb-2" />
                    <p className="text-red-200 text-sm">Sick Leave</p>
                    <p className="text-2xl font-bold text-white">{balance.sick} days</p>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                    <User className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-purple-200 text-sm">Personal</p>
                    <p className="text-2xl font-bold text-white">{balance.personal} days</p>
                  </div>
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                    <Umbrella className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-green-200 text-sm">PTO</p>
                    <p className="text-2xl font-bold text-white">{balance.pto} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNewRequest(false)}>
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6">New Time Off Request</h2>
            <div className="space-y-4 mb-6">
              <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option>Select Type</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
                <option value="pto">PTO</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-green-200 text-sm block mb-1">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
                <div>
                  <label className="text-green-200 text-sm block mb-1">End Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
              </div>
              <textarea
                placeholder="Reason (optional)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewRequest(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Time off request submitted!');
                  setShowNewRequest(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
