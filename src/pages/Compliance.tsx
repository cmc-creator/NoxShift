import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, Calendar, TrendingUp, Download } from 'lucide-react'

export default function Compliance() {
  const [selectedStandard, setSelectedStandard] = useState('osha')

  const complianceStandards = [
    { id: 'osha', name: 'OSHA', fullName: 'Occupational Safety and Health Administration', compliance: 94 },
    { id: 'cms', name: 'CMS', fullName: 'Centers for Medicare & Medicaid Services', compliance: 91 },
    { id: 'joint', name: 'Joint Commission', fullName: 'The Joint Commission', compliance: 88 },
    { id: 'hipaa', name: 'HIPAA', fullName: 'Health Insurance Portability Act', compliance: 96 },
    { id: 'ada', name: 'ADA', fullName: 'Americans with Disabilities Act', compliance: 100 },
  ]

  const requirements = [
    { id: 1, title: 'Staff-to-Patient Ratio Compliance', status: 'compliant', standard: 'CMS', lastCheck: '2026-01-18', nextCheck: '2026-01-19' },
    { id: 2, title: 'Mandatory Training Completion', status: 'warning', standard: 'OSHA', lastCheck: '2026-01-17', nextCheck: '2026-01-24' },
    { id: 3, title: 'Documentation Standards', status: 'compliant', standard: 'Joint Commission', lastCheck: '2026-01-18', nextCheck: '2026-01-25' },
    { id: 4, title: 'Privacy & Security Controls', status: 'compliant', standard: 'HIPAA', lastCheck: '2026-01-18', nextCheck: '2026-01-20' },
    { id: 5, title: 'Workplace Safety Inspections', status: 'action-needed', standard: 'OSHA', lastCheck: '2026-01-10', nextCheck: '2026-01-17' },
    { id: 6, title: 'Accessibility Accommodations', status: 'compliant', standard: 'ADA', lastCheck: '2026-01-15', nextCheck: '2026-02-15' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'green'
      case 'warning': return 'yellow'
      case 'action-needed': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle
      case 'warning': return AlertTriangle
      case 'action-needed': return XCircle
      default: return Shield
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-400" />
            Compliance Dashboard
          </h1>

          {/* Overall Compliance Score */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">93%</div>
              <div className="text-purple-200 text-lg mb-4">Overall Compliance Score</div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+3% from last quarter</span>
              </div>
            </div>
          </div>

          {/* Compliance Standards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {complianceStandards.map((standard) => (
              <button
                key={standard.id}
                onClick={() => setSelectedStandard(standard.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedStandard === standard.id
                    ? 'border-blue-500 bg-blue-500/10 scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-3xl font-bold text-white mb-2">{standard.compliance}%</div>
                <div className="font-bold text-white mb-1">{standard.name}</div>
                <div className="text-purple-200 text-xs">{standard.fullName}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Requirements List */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Compliance Requirements</h2>
              
              <div className="space-y-3">
                {requirements.map((req) => {
                  const StatusIcon = getStatusIcon(req.status)
                  const statusColor = getStatusColor(req.status)
                  
                  return (
                    <div key={req.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-${statusColor}-500/20 rounded-lg flex-shrink-0`}>
                          <StatusIcon className={`w-6 h-6 text-${statusColor}-400`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white font-bold">{req.title}</div>
                              <div className="text-purple-200 text-sm">{req.standard}</div>
                            </div>
                            <span className={`px-3 py-1 bg-${statusColor}-500/20 text-${statusColor}-400 text-xs font-bold rounded-full`}>
                              {req.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-purple-300">
                            <span>Last Check: {req.lastCheck}</span>
                            <span>Next: {req.nextCheck}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                </div>

                <div className="space-y-2">
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all text-left flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Generate Compliance Report
                  </button>
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all text-left flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Inspection
                  </button>
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all text-left flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Documentation
                  </button>
                  <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all text-left flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Submit Incident Report
                  </button>
                </div>
              </div>

              {/* Upcoming Audits */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Upcoming Audits</h2>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold mb-1">Joint Commission Survey</div>
                    <div className="text-purple-200 text-sm">March 15-17, 2026</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold mb-1">CMS Quality Review</div>
                    <div className="text-purple-200 text-sm">April 8, 2026</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold mb-1">OSHA Inspection</div>
                    <div className="text-purple-200 text-sm">May 2, 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Trends */}
          <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Compliance Trends (Last 6 Months)</h2>
            <div className="grid grid-cols-6 gap-4 items-end h-64">
              {[88, 90, 89, 92, 91, 93].map((score, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg transition-all hover:scale-105"
                    style={{ height: `${(score / 100) * 100}%` }}
                  />
                  <div className="text-white font-bold mt-2">{score}%</div>
                  <div className="text-purple-200 text-xs">
                    {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}
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
