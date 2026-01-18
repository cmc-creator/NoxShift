import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { DollarSign, Download, Upload, Settings, CheckCircle, Clock, TrendingUp, FileText, AlertTriangle } from 'lucide-react'

export default function Payroll() {
  const [exportFormat, setExportFormat] = useState('adp')
  const [payPeriod, setPayPeriod] = useState('current')
  const [includeDeductions, setIncludeDeductions] = useState(true)

  const payrollProviders = [
    { id: 'adp', name: 'ADP Workforce Now', icon: '🔵', format: 'CSV' },
    { id: 'gusto', name: 'Gusto', icon: '🟢', format: 'CSV' },
    { id: 'quickbooks', name: 'QuickBooks', icon: '🟡', format: 'IIF' },
    { id: 'paychex', name: 'Paychex Flex', icon: '🔴', format: 'XML' },
    { id: 'paylocity', name: 'Paylocity', icon: '🟣', format: 'CSV' },
    { id: 'bamboohr', name: 'BambooHR', icon: '🟠', format: 'CSV' },
    { id: 'generic', name: 'Generic CSV', icon: '⚪', format: 'CSV' },
  ]

  const recentPayrolls = [
    { id: 1, period: 'Dec 16-31, 2025', status: 'completed', amount: 48250, employees: 22 },
    { id: 2, period: 'Dec 1-15, 2025', status: 'completed', amount: 45800, employees: 22 },
    { id: 3, period: 'Nov 16-30, 2025', status: 'completed', amount: 47100, employees: 21 },
  ]

  const payrollStats = [
    { label: 'Total Hours (Current Period)', value: '1,847', icon: Clock, color: 'blue' },
    { label: 'Regular Hours', value: '1,680', icon: Clock, color: 'green' },
    { label: 'Overtime Hours', value: '167', icon: TrendingUp, color: 'orange' },
    { label: 'Gross Pay', value: '$52,430', icon: DollarSign, color: 'purple' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-green-400" />
            Payroll Integration
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {payrollStats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className={`inline-flex p-3 rounded-lg bg-${stat.color}-500/20 mb-3`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Export Section */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Download className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Export Payroll Data</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 mb-2">Select Provider</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {payrollProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setExportFormat(provider.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          exportFormat === provider.id
                            ? 'border-green-500 bg-green-500/10 scale-105'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="text-3xl mb-2">{provider.icon}</div>
                        <div className="text-white font-semibold text-sm">{provider.name}</div>
                        <div className="text-purple-200 text-xs">{provider.format}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 mb-2">Pay Period</label>
                  <select
                    value={payPeriod}
                    onChange={(e) => setPayPeriod(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="current">Current Period (Jan 1-15, 2026)</option>
                    <option value="last">Last Period (Dec 16-31, 2025)</option>
                    <option value="custom">Custom Date Range...</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      type="checkbox"
                      checked={includeDeductions}
                      onChange={(e) => setIncludeDeductions(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-purple-200">Include Deductions & Taxes</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <span className="text-purple-200">Include Bonuses</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <span className="text-purple-200">Include Shift Differentials</span>
                  </label>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Export to {payrollProviders.find(p => p.id === exportFormat)?.name}
                </button>

                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configure Field Mappings
                </button>
              </div>
            </div>

            {/* Recent Payrolls */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Exports</h2>
              </div>

              <div className="space-y-3">
                {recentPayrolls.map((payroll) => (
                  <div key={payroll.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white font-semibold">{payroll.period}</div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-purple-200 text-sm">{payroll.employees} employees</div>
                    <div className="text-green-400 font-bold text-lg mt-1">
                      ${payroll.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all">
                View All Exports
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold mb-2">Payroll Integration Tips</h3>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• Always review exported data before importing to your payroll provider</li>
                  <li>• Configure field mappings once, reuse for all future exports</li>
                  <li>• Export regularly (weekly or bi-weekly) to stay current</li>
                  <li>• Keep backup exports for audit purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
