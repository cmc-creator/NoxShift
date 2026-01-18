import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Star, Award, TrendingUp, FileText, Plus, Calendar, CheckCircle, Clock } from 'lucide-react'

export default function PerformanceReviews() {
  const [showNewReview, setShowNewReview] = useState(false)

  const employees = [
    { id: 1, name: 'Sarah Johnson', role: 'RN', lastReview: '2025-07-15', nextReview: '2026-01-15', rating: 4.5, status: 'due' },
    { id: 2, name: 'Michael Chen', role: 'RN', lastReview: '2025-08-20', nextReview: '2026-02-20', rating: 4.8, status: 'upcoming' },
    { id: 3, name: 'Emily Davis', role: 'LPN', lastReview: '2025-09-10', nextReview: '2026-03-10', rating: 4.2, status: 'upcoming' },
  ]

  const reviewTemplates = [
    { id: 1, name: '90-Day New Hire Review', categories: 6, questions: 12 },
    { id: 2, name: 'Annual Performance Review', categories: 8, questions: 24 },
    { id: 3, name: 'Mid-Year Check-In', categories: 5, questions: 10 },
    { id: 4, name: 'Leadership Assessment', categories: 10, questions: 30 },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Award className="w-10 h-10 text-yellow-400" />
              Performance Reviews
            </h1>
            <button
              onClick={() => setShowNewReview(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Review
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-yellow-500/20 mb-3">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">4.5</div>
              <div className="text-purple-200 text-sm">Average Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-red-500/20 mb-3">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">3</div>
              <div className="text-purple-200 text-sm">Reviews Due</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-green-500/20 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">18</div>
              <div className="text-purple-200 text-sm">Completed (2025)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-blue-500/20 mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">+12%</div>
              <div className="text-purple-200 text-sm">Rating Improvement</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Employee Review Status */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Employee Review Status</h2>
              
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white font-bold text-lg">{employee.name}</div>
                        <div className="text-purple-200 text-sm">{employee.role}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(employee.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                          />
                        ))}
                        <span className="text-white font-bold ml-2">{employee.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-purple-200">
                        <span className="text-purple-400">Last Review:</span> {employee.lastReview}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        employee.status === 'due' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        Next: {employee.nextReview}
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all">
                      {employee.status === 'due' ? 'Start Review Now' : 'View History'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Templates */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Templates</h2>
              </div>

              <div className="space-y-3">
                {reviewTemplates.map((template) => (
                  <div key={template.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="text-white font-semibold mb-2">{template.name}</div>
                    <div className="text-purple-200 text-xs">
                      {template.categories} categories • {template.questions} questions
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Create Custom Template
              </button>
            </div>
          </div>

          {/* Review Categories */}
          <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Standard Review Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Quality of Work', 'Communication', 'Teamwork', 'Attendance', 'Initiative', 'Leadership', 'Problem Solving', 'Professionalism'].map((category) => (
                <div key={category} className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                  <div className="text-purple-200">{category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
