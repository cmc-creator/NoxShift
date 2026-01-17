import React, { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle, Award, Star, Clock, Calendar, XCircle } from 'lucide-react';

interface PerformanceDashboardProps {
  shifts: any[];
  employees: any[];
  onClose: () => void;
}

export function PerformanceDashboard({ shifts, employees, onClose }: PerformanceDashboardProps) {
  const performanceData = useMemo(() => {
    return employees.map(emp => {
      const empShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff);
      const totalShifts = empShifts.length;
      const draftShifts = empShifts.filter(s => s.isDraft).length;
      const finalizedShifts = totalShifts - draftShifts;
      
      // Calculate attendance metrics
      const totalHours = empShifts.reduce((sum, s) => {
        const start = new Date(`2000-01-01T${s.startTime}`);
        const end = new Date(`2000-01-01T${s.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
      
      // Calculate consecutive days worked
      const sortedDates = empShifts
        .map(s => new Date(s.date))
        .sort((a, b) => a.getTime() - b.getTime());
      
      let maxConsecutive = 0;
      let currentConsecutive = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diffDays = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
          currentConsecutive = 1;
        }
      }
      
      // Simulate metrics (in real app, these would come from time-clock data)
      const onTimeRate = Math.max(75, Math.min(100, 92 + Math.random() * 8));
      const completionRate = Math.max(85, Math.min(100, 95 + Math.random() * 5));
      const callOuts = Math.floor(Math.random() * 3);
      
      // Calculate performance score (weighted average)
      const performanceScore = Math.round(
        (onTimeRate * 0.3) + 
        (completionRate * 0.4) + 
        ((100 - (callOuts * 10)) * 0.2) +
        ((totalShifts / employees.length) * 5) * 0.1
      );
      
      // Risk assessment
      const isAtRisk = performanceScore < 75 || onTimeRate < 85 || callOuts > 2 || maxConsecutive > 7;
      
      return {
        name: emp.name,
        totalShifts,
        totalHours: totalHours.toFixed(1),
        onTimeRate: onTimeRate.toFixed(1),
        completionRate: completionRate.toFixed(1),
        callOuts,
        maxConsecutive,
        performanceScore,
        isAtRisk,
        reliability: completionRate >= 95 ? 'Excellent' : completionRate >= 85 ? 'Good' : 'Needs Improvement',
        trend: performanceScore > 85 ? 'up' : performanceScore < 75 ? 'down' : 'stable'
      };
    });
  }, [shifts, employees]);
  
  const topPerformers = [...performanceData]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 3);
    
  const atRiskEmployees = performanceData.filter(p => p.isAtRisk);
  
  const averageScore = performanceData.reduce((sum, p) => sum + p.performanceScore, 0) / performanceData.length || 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-600';
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600 bg-green-100' };
    if (score >= 75) return { label: 'Good', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'At Risk', color: 'text-red-600 bg-red-100' };
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden border-2 border-blue-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between border-b-2 border-blue-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Award className="w-8 h-8" />
              Employee Performance Dashboard
            </h2>
            <p className="text-blue-100 text-sm mt-1 font-semibold">
              Track attendance, reliability, and overall performance
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-white" />
                <TrendingUp className="w-6 h-6 text-blue-200" />
              </div>
              <div className="text-4xl font-black text-white mb-1">{averageScore.toFixed(0)}</div>
              <div className="text-sm text-blue-100 font-bold">Average Team Score</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-white" />
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-4xl font-black text-white mb-1">{topPerformers.length}</div>
              <div className="text-sm text-green-100 font-bold">Top Performers</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 border-2 border-red-400/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-white" />
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-4xl font-black text-white mb-1">{atRiskEmployees.length}</div>
              <div className="text-sm text-red-100 font-bold">At-Risk Employees</div>
            </div>
          </div>
          
          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Top Performers This Month
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {topPerformers.map((performer, idx) => {
                  const badge = getScoreBadge(performer.performanceScore);
                  return (
                    <div key={performer.name} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border-2 border-yellow-400/30 relative overflow-hidden">
                      {idx === 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="text-4xl">👑</span>
                        </div>
                      )}
                      <div className="mb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-black text-xl">
                            #{idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-white">{performer.name}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-semibold">Performance Score:</span>
                          <span className="font-black text-yellow-400">{performer.performanceScore}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="font-semibold">On-Time Rate:</span>
                          <span className="font-bold text-green-400">{performer.onTimeRate}%</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="font-semibold">Total Shifts:</span>
                          <span className="font-bold text-blue-400">{performer.totalShifts}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* All Employees Performance Table */}
          <div>
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-400" />
              Complete Team Performance
            </h3>
            <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600">
                    <th className="text-left py-4 px-4 text-sm font-black text-white">Employee</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Score</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">On-Time %</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Completion %</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Shifts</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Hours</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Call-Outs</th>
                    <th className="text-center py-4 px-4 text-sm font-black text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((emp, idx) => {
                    const badge = getScoreBadge(emp.performanceScore);
                    return (
                      <tr key={emp.name} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${emp.isAtRisk ? 'bg-red-900/10' : ''}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getScoreColor(emp.performanceScore)} flex items-center justify-center text-white font-black`}>
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-white">{emp.name}</div>
                              <div className="text-xs text-slate-400">{emp.reliability}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">{emp.performanceScore}</span>
                            {emp.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : emp.trend === 'down' ? (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${parseFloat(emp.onTimeRate) >= 90 ? 'text-green-400' : parseFloat(emp.onTimeRate) >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {emp.onTimeRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${parseFloat(emp.completionRate) >= 95 ? 'text-green-400' : parseFloat(emp.completionRate) >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {emp.completionRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-blue-400">{emp.totalShifts}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-purple-400">{emp.totalHours}h</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${emp.callOuts === 0 ? 'text-green-400' : emp.callOuts <= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {emp.callOuts}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                          {emp.isAtRisk && (
                            <AlertTriangle className="w-4 h-4 text-red-400 mx-auto mt-1" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* At-Risk Employees Alert */}
          {atRiskEmployees.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-red-900/40 to-rose-900/40 border-2 border-red-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-lg font-black text-white mb-2">⚠️ Attention Required</h4>
                  <p className="text-red-200 text-sm mb-3">
                    {atRiskEmployees.length} employee{atRiskEmployees.length !== 1 ? 's' : ''} showing performance concerns. Consider follow-up conversations or additional support.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atRiskEmployees.map(emp => (
                      <span key={emp.name} className="bg-red-500/30 text-red-100 px-3 py-1 rounded-lg text-sm font-bold border border-red-400/50">
                        {emp.name} (Score: {emp.performanceScore})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
