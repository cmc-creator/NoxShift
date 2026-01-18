import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { GraduationCap, BookOpen, Award, Play, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react'

export default function Training() {
  const courses = [
    { 
      id: 1, 
      title: 'HIPAA Compliance 2026', 
      category: 'Compliance', 
      duration: '45 min', 
      enrolled: 22, 
      completed: 18, 
      dueDate: '2026-01-31',
      progress: 82,
      required: true
    },
    { 
      id: 2, 
      title: 'Fire Safety & Emergency Procedures', 
      category: 'Safety', 
      duration: '30 min', 
      enrolled: 22, 
      completed: 20, 
      dueDate: '2026-02-15',
      progress: 91,
      required: true
    },
    { 
      id: 3, 
      title: 'Advanced Wound Care', 
      category: 'Clinical', 
      duration: '2 hours', 
      enrolled: 8, 
      completed: 5, 
      dueDate: null,
      progress: 63,
      required: false
    },
    { 
      id: 4, 
      title: 'Leadership Development', 
      category: 'Professional', 
      duration: '4 hours', 
      enrolled: 6, 
      completed: 2, 
      dueDate: null,
      progress: 33,
      required: false
    },
  ]

  const certificates = [
    { id: 1, name: 'Sarah Johnson', course: 'HIPAA Compliance 2026', date: '2026-01-15', score: 98 },
    { id: 2, name: 'Michael Chen', course: 'Fire Safety', date: '2026-01-14', score: 95 },
    { id: 3, name: 'Emily Davis', course: 'HIPAA Compliance 2026', date: '2026-01-13', score: 92 },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-blue-400" />
            Training & Learning
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-blue-500/20 mb-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">12</div>
              <div className="text-purple-200 text-sm">Active Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-green-500/20 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">156</div>
              <div className="text-purple-200 text-sm">Certificates Issued</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-orange-500/20 mb-3">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">487</div>
              <div className="text-purple-200 text-sm">Total Hours Trained</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="inline-flex p-3 rounded-lg bg-purple-500/20 mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">94%</div>
              <div className="text-purple-200 text-sm">Completion Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Courses */}
            <div className="lg:col-span-2 space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        {course.required && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">REQUIRED</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-purple-200">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolled} enrolled
                        </span>
                      </div>
                    </div>
                    <button className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg transition-all hover:scale-105">
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-purple-200">Course Progress</span>
                      <span className="text-white font-bold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-green-400 font-bold">{course.completed}</span>
                      <span className="text-purple-200"> / {course.enrolled} completed</span>
                    </div>
                    {course.dueDate && (
                      <div className="text-sm text-orange-400 font-semibold">
                        Due: {course.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all hover:scale-105">
                + Create New Course
              </button>
            </div>

            {/* Recent Certificates */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Certificates</h2>
              </div>

              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-white font-semibold">{cert.name}</div>
                        <div className="text-purple-200 text-sm">{cert.course}</div>
                      </div>
                      <div className="text-green-400 font-bold text-lg">{cert.score}%</div>
                    </div>
                    <div className="text-purple-300 text-xs">{cert.date}</div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition-all">
                View All Certificates
              </button>
            </div>
          </div>

          {/* Course Categories */}
          <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Course Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Compliance', count: 4, color: 'red' },
                { name: 'Safety', count: 3, color: 'orange' },
                { name: 'Clinical', count: 6, color: 'blue' },
                { name: 'Professional', count: 5, color: 'purple' },
                { name: 'Technical', count: 2, color: 'green' },
              ].map((category) => (
                <div key={category.name} className={`p-4 bg-${category.color}-500/10 border border-${category.color}-500/20 rounded-lg text-center hover:bg-${category.color}-500/20 transition-all cursor-pointer`}>
                  <div className={`text-${category.color}-400 font-bold text-2xl mb-1`}>{category.count}</div>
                  <div className="text-purple-200 text-sm">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
