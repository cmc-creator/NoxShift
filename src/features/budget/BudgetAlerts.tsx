import React, { useMemo } from 'react';
import { X, AlertTriangle, TrendingUp, DollarSign, Calendar, Activity } from 'lucide-react';

interface BudgetAlertsProps {
  shifts: any[];
  monthlyBudget: number;
  budgetUsed: number;
  currentMonth: string;
  onClose: () => void;
}

export function BudgetAlerts({ shifts, monthlyBudget, budgetUsed, currentMonth, onClose }: BudgetAlertsProps) {
  const budgetAnalysis = useMemo(() => {
    // Calculate total cost from shifts
    const totalCost = shifts.reduce((sum, shift) => {
      if (shift.isTimeOff) return sum;
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const rate = shift.payRate || 18; // Default $18/hr
      return sum + (hours * rate);
    }, 0);
    
    const percentUsed = (totalCost / monthlyBudget) * 100;
    const remaining = monthlyBudget - totalCost;
    
    // Week-by-week breakdown
    const weeks = new Map<number, { shifts: any[], cost: number }>();
    shifts.forEach(shift => {
      if (shift.isTimeOff) return;
      const date = new Date(shift.date);
      const weekNumber = Math.ceil(date.getDate() / 7);
      
      if (!weeks.has(weekNumber)) {
        weeks.set(weekNumber, { shifts: [], cost: 0 });
      }
      
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const rate = shift.payRate || 18;
      const cost = hours * rate;
      
      const week = weeks.get(weekNumber)!;
      week.shifts.push(shift);
      week.cost += cost;
    });
    
    // Projected month-end cost (based on current pace)
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const projectedMonthEnd = (totalCost / currentDay) * daysInMonth;
    
    // Previous month comparison (simulated - in real app would fetch from DB)
    const lastMonthCost = monthlyBudget * (0.85 + Math.random() * 0.2); // 85-105% of budget
    const costChange = ((totalCost - lastMonthCost) / lastMonthCost) * 100;
    
    // Determine alert level
    let alertLevel: 'success' | 'warning' | 'danger' | 'critical';
    if (percentUsed < 75) alertLevel = 'success';
    else if (percentUsed < 90) alertLevel = 'warning';
    else if (percentUsed < 100) alertLevel = 'danger';
    else alertLevel = 'critical';
    
    return {
      totalCost,
      percentUsed,
      remaining,
      weeks: Array.from(weeks.entries()).map(([num, data]) => ({
        week: num,
        ...data
      })),
      projectedMonthEnd,
      lastMonthCost,
      costChange,
      alertLevel
    };
  }, [shifts, monthlyBudget, budgetUsed]);
  
  const getAlertColor = () => {
    switch (budgetAnalysis.alertLevel) {
      case 'success': return { bg: 'from-green-600 to-emerald-700', text: 'text-green-400', border: 'border-green-400/30' };
      case 'warning': return { bg: 'from-yellow-600 to-amber-700', text: 'text-yellow-400', border: 'border-yellow-400/30' };
      case 'danger': return { bg: 'from-orange-600 to-red-700', text: 'text-orange-400', border: 'border-orange-400/30' };
      case 'critical': return { bg: 'from-red-600 to-rose-700', text: 'text-red-400', border: 'border-red-400/30' };
    }
  };
  
  const getAlertMessage = () => {
    switch (budgetAnalysis.alertLevel) {
      case 'success': return '✅ Budget on track';
      case 'warning': return '⚠️ Approaching budget limit';
      case 'danger': return '🚨 Near budget threshold';
      case 'critical': return '🔴 BUDGET EXCEEDED';
    }
  };
  
  const colors = getAlertColor();
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border-2 border-orange-500/50 shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.bg} px-8 py-6 flex items-center justify-between border-b-2 ${colors.border}`}>
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Labor Budget Dashboard
            </h2>
            <p className="text-white/90 text-sm mt-1 font-semibold">
              {currentMonth} • Real-time budget tracking & projections
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Alert Status Banner */}
          <div className={`mb-6 bg-gradient-to-r ${colors.bg} rounded-2xl p-6 border-2 ${colors.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/80 font-bold mb-2">{getAlertMessage()}</div>
                <div className="text-5xl font-black text-white mb-2">
                  {budgetAnalysis.percentUsed.toFixed(1)}%
                </div>
                <div className="text-white/90 text-sm font-semibold">of monthly budget used</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80 font-bold mb-2">Remaining</div>
                <div className="text-4xl font-black text-white">
                  ${budgetAnalysis.remaining.toLocaleString()}
                </div>
                <div className="text-white/90 text-sm font-semibold">
                  of ${monthlyBudget.toLocaleString()} budget
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 bg-white/20 rounded-full h-6 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-500 ${
                  budgetAnalysis.percentUsed >= 100 ? 'bg-red-500' :
                  budgetAnalysis.percentUsed >= 90 ? 'bg-orange-500' :
                  budgetAnalysis.percentUsed >= 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, budgetAnalysis.percentUsed)}%` }}
              />
              {/* Threshold markers */}
              <div className="absolute inset-0 flex items-center">
                <div className="absolute left-[75%] w-0.5 h-full bg-white/40" />
                <div className="absolute left-[90%] w-0.5 h-full bg-white/60" />
                <div className="absolute left-[100%] w-0.5 h-full bg-white/80" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/70 font-semibold mt-2">
              <span>0%</span>
              <span>75%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30">
              <Activity className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white mb-1">
                ${budgetAnalysis.totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-blue-100 font-bold">Spent This Month</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 border-2 border-purple-400/30">
              <TrendingUp className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white mb-1">
                ${budgetAnalysis.projectedMonthEnd.toLocaleString()}
              </div>
              <div className="text-sm text-purple-100 font-bold">Projected Month-End</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400/30">
              <Calendar className="w-8 h-8 text-white mb-3" />
              <div className={`text-3xl font-black text-white mb-1 flex items-center gap-2`}>
                {budgetAnalysis.costChange > 0 ? '+' : ''}{budgetAnalysis.costChange.toFixed(1)}%
                {budgetAnalysis.costChange > 0 ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingUp className="w-6 h-6 rotate-180" />
                )}
              </div>
              <div className="text-sm text-green-100 font-bold">vs Last Month</div>
            </div>
          </div>
          
          {/* Week-by-Week Breakdown */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Week-by-Week Breakdown
            </h3>
            <div className="space-y-3">
              {budgetAnalysis.weeks.map(week => {
                const weekBudget = monthlyBudget / 4;
                const weekPercent = (week.cost / weekBudget) * 100;
                return (
                  <div key={week.week} className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-white font-bold">Week {week.week}</span>
                        <span className="text-slate-400 text-sm ml-3">
                          {week.shifts.length} shifts
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-white">
                          ${week.cost.toLocaleString()}
                        </div>
                        <div className={`text-sm font-bold ${
                          weekPercent > 100 ? 'text-red-400' :
                          weekPercent > 90 ? 'text-orange-400' :
                          weekPercent > 75 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {weekPercent.toFixed(0)}% of weekly budget
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          weekPercent > 100 ? 'bg-red-500' :
                          weekPercent > 90 ? 'bg-orange-500' :
                          weekPercent > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, weekPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Alert Thresholds Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Automated Alert Thresholds
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white font-bold">Below 75%</span>
                </div>
                <span className="text-green-400 text-sm font-semibold">On Track ✅</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white font-bold">75% - 90%</span>
                </div>
                <span className="text-yellow-400 text-sm font-semibold">Warning Alert ⚠️</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-900/20 border border-orange-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-white font-bold">90% - 100%</span>
                </div>
                <span className="text-orange-400 text-sm font-semibold">Urgent Alert 🚨</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white font-bold">Over 100%</span>
                </div>
                <span className="text-red-400 text-sm font-semibold">Critical Alert 🔴</span>
              </div>
            </div>
          </div>
          
          {/* Projection Warning */}
          {budgetAnalysis.projectedMonthEnd > monthlyBudget && (
            <div className="mt-6 bg-gradient-to-r from-red-900/40 to-rose-900/40 border-2 border-red-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-lg font-black text-white mb-2">⚠️ Budget Overrun Projected</h4>
                  <p className="text-red-200 text-sm mb-3">
                    At current pace, you're projected to exceed your monthly budget by{' '}
                    <span className="font-black">
                      ${(budgetAnalysis.projectedMonthEnd - monthlyBudget).toLocaleString()}
                    </span>
                    {' '}({((budgetAnalysis.projectedMonthEnd / monthlyBudget - 1) * 100).toFixed(1)}% over)
                  </p>
                  <div className="text-red-100 text-sm space-y-1">
                    <p className="font-semibold">💡 Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Review upcoming shifts for optimization opportunities</li>
                      <li>Consider reducing overtime hours in week {budgetAnalysis.weeks.length + 1}</li>
                      <li>Evaluate part-time vs full-time staffing mix</li>
                    </ul>
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
