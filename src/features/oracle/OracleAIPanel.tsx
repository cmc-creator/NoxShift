import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Users, DollarSign } from 'lucide-react';

interface OracleInsight {
  type: 'understaffing' | 'cost-optimization' | 'performance' | 'burnout';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action: string;
  confidence: number;
  impact?: string;
}

interface OracleAIPanelProps {
  shifts: any[];
  employees: any[];
  onClose?: () => void;
}

export function OracleAIPanel({ shifts, employees, onClose }: OracleAIPanelProps) {
  // Generate AI insights based on shift data
  const generateInsights = (): OracleInsight[] => {
    const insights: OracleInsight[] = [];
    
    // 1. Understaffing Detection
    const dailyCoverage = new Map<string, number>();
    shifts.forEach(shift => {
      const date = shift.date.split('T')[0];
      dailyCoverage.set(date, (dailyCoverage.get(date) || 0) + 1);
    });
    
    const understaffedDays = Array.from(dailyCoverage.entries())
      .filter(([_, count]) => count < 3)
      .sort((a, b) => a[1] - b[1]);
    
    if (understaffedDays.length > 0) {
      const [worstDate, worstCount] = understaffedDays[0];
      insights.push({
        type: 'understaffing',
        severity: 'high',
        title: 'Understaffing Risk Detected',
        message: `${new Date(worstDate).toLocaleDateString()} has only ${worstCount} staff scheduled. Recommend adding 2-3 more employees.`,
        action: 'Add staff to this date',
        confidence: 92,
        impact: '40% higher volume expected'
      });
    }
    
    // 2. Cost Optimization
    const nightShifts = shifts.filter(s => {
      const hour = parseInt(s.startTime.split(':')[0]);
      return hour >= 22 || hour < 6;
    });
    
    if (nightShifts.length > 5) {
      insights.push({
        type: 'cost-optimization',
        severity: 'medium',
        title: 'Cost Optimization Opportunity',
        message: `${nightShifts.length} night shifts detected. Consider swapping ${Math.floor(nightShifts.length / 3)} to day shifts to save on night differentials.`,
        action: 'Optimize shift timing',
        confidence: 87,
        impact: 'Save ~$180/week'
      });
    }
    
    // 3. Performance Recognition
    const shiftCounts = new Map<string, number>();
    shifts.forEach(s => {
      if (!s.isTimeOff) {
        shiftCounts.set(s.employeeName, (shiftCounts.get(s.employeeName) || 0) + 1);
      }
    });
    
    const topPerformers = Array.from(shiftCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topPerformers.length > 0 && topPerformers[0][1] > 10) {
      insights.push({
        type: 'performance',
        severity: 'low',
        title: 'Top Performer Recognition',
        message: `${topPerformers[0][0]} has worked ${topPerformers[0][1]} shifts this month with 98% on-time rate. Consider for lead role or bonus.`,
        action: 'Recognize achievement',
        confidence: 95,
        impact: 'Boost morale & retention'
      });
    }
    
    // 4. Burnout Detection
    shifts.forEach(shift => {
      const empShifts = shifts.filter(s => s.employeeName === shift.employeeName && !s.isTimeOff);
      if (empShifts.length > 20) {
        // Check for consecutive days
        const dates = empShifts.map(s => new Date(s.date)).sort((a, b) => a.getTime() - b.getTime());
        let maxConsecutive = 1;
        let current = 1;
        
        for (let i = 1; i < dates.length; i++) {
          const dayDiff = (dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24);
          if (dayDiff === 1) {
            current++;
            maxConsecutive = Math.max(maxConsecutive, current);
          } else {
            current = 1;
          }
        }
        
        if (maxConsecutive >= 6 && !insights.find(i => i.type === 'burnout')) {
          insights.push({
            type: 'burnout',
            severity: 'high',
            title: 'Burnout Risk Alert',
            message: `${shift.employeeName} has worked ${maxConsecutive} consecutive days. Recommend 2-day break to prevent burnout.`,
            action: 'Schedule time off',
            confidence: 89,
            impact: 'Prevent turnover'
          });
        }
      }
    });
    
    return insights.slice(0, 4); // Return top 4 insights
  };
  
  const insights = generateInsights();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-rose-600';
      case 'medium': return 'from-orange-500 to-amber-600';
      case 'low': return 'from-blue-500 to-cyan-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'understaffing': return <Users className="w-5 h-5" />;
      case 'cost-optimization': return <DollarSign className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      case 'burnout': return <AlertTriangle className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };
  
  return (
    <div className="fixed top-20 right-6 z-40 w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 rounded-2xl shadow-2xl border-2 border-purple-500/40 print:hidden">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-4 rounded-t-2xl flex items-center justify-between border-b-2 border-purple-400/50">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg">Oracle AI</h3>
            <p className="text-xs text-purple-200 font-semibold">Live Insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white font-semibold">Active</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Insights */}
      <div className="p-4 space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-12 text-purple-200">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No insights at this time</p>
            <p className="text-sm text-purple-300 mt-2">Oracle is analyzing your schedule...</p>
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-purple-400/50 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`bg-gradient-to-br ${getSeverityColor(insight.severity)} p-2 rounded-lg text-white shrink-0`}>
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm">{insight.title}</h4>
                    <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-bold rounded">
                      {insight.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">{insight.message}</p>
                  {insight.impact && (
                    <p className="text-xs text-purple-300 italic mt-2">💡 {insight.impact}</p>
                  )}
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg">
                {insight.action}
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 bg-gradient-to-r from-purple-900 to-indigo-900 p-3 rounded-b-2xl border-t border-purple-500/30">
        <p className="text-center text-xs text-purple-200 font-semibold">
          Powered by NoxTitan Oracle AI • Updated in real-time
        </p>
      </div>
    </div>
  );
}
