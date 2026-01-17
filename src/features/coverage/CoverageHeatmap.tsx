import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CoverageHeatmapProps {
  shifts: any[];
  targetStaffing?: number;
}

export function CoverageHeatmap({ shifts, targetStaffing = 5 }: CoverageHeatmapProps) {
  const getDayName = (offset: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const day = new Date(today);
    day.setDate(today.getDate() + offset);
    return days[day.getDay()];
  };
  
  const getDayDate = (offset: number) => {
    const today = new Date();
    const day = new Date(today);
    day.setDate(today.getDate() + offset);
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const getDayCoverage = (offset: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);
    const dateStr = targetDate.toISOString().split('T')[0];
    
    const dayShifts = shifts.filter(s => 
      s.date.startsWith(dateStr) && !s.isTimeOff
    );
    
    return dayShifts.length;
  };
  
  const days = [0, 1, 2, 3, 4]; // Next 5 days
  
  const getCoverageColor = (count: number) => {
    const percentage = (count / targetStaffing) * 100;
    
    if (percentage < 60) return 'from-red-500 to-rose-600';
    if (percentage < 80) return 'from-orange-500 to-amber-600';
    if (percentage < 100) return 'from-yellow-500 to-amber-500';
    if (percentage <= 110) return 'from-green-500 to-emerald-600';
    return 'from-blue-500 to-cyan-600';
  };
  
  const getCoverageLabel = (count: number) => {
    const percentage = (count / targetStaffing) * 100;
    
    if (percentage < 60) return 'Critical';
    if (percentage < 80) return 'Low';
    if (percentage < 100) return 'Good';
    if (percentage <= 110) return 'Optimal';
    return 'Overstaffed';
  };
  
  const getCoverageIcon = (count: number) => {
    const percentage = (count / targetStaffing) * 100;
    
    if (percentage < 80) return <TrendingDown className="w-4 h-4" />;
    if (percentage <= 110) return <Activity className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };
  
  const totalCoverage = days.reduce((sum, offset) => sum + getDayCoverage(offset), 0);
  const avgCoverage = totalCoverage / days.length;
  const avgPercentage = (avgCoverage / targetStaffing) * 100;
  
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-purple-500/40 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-7 h-7 text-purple-400" />
            Coverage Heatmap
          </h3>
          <p className="text-sm text-slate-400 mt-1">Next 5 days staffing overview</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white">{avgCoverage.toFixed(1)}</div>
          <div className="text-xs text-slate-400 font-semibold">Avg Staff/Day</div>
          <div className={`text-xs font-bold mt-1 ${
            avgPercentage < 80 ? 'text-red-400' :
            avgPercentage < 100 ? 'text-yellow-400' :
            avgPercentage <= 110 ? 'text-green-400' : 'text-blue-400'
          }`}>
            {avgPercentage.toFixed(0)}% of target
          </div>
        </div>
      </div>
      
      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 gap-4">
        {days.map(offset => {
          const coverage = getDayCoverage(offset);
          const percentage = (coverage / targetStaffing) * 100;
          
          return (
            <div
              key={offset}
              className="group relative"
            >
              {/* Day Card */}
              <div className={`bg-gradient-to-br ${getCoverageColor(coverage)} rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-2xl cursor-pointer`}>
                <div className="text-white">
                  <div className="text-xs font-bold opacity-90 mb-1">
                    {getDayName(offset).substring(0, 3)}
                  </div>
                  <div className="text-3xl font-black mb-1">
                    {coverage}
                  </div>
                  <div className="text-[10px] font-semibold opacity-75">
                    {getDayDate(offset)}
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="flex items-center justify-center gap-1 text-white">
                    {getCoverageIcon(coverage)}
                    <span className="text-xs font-bold">
                      {getCoverageLabel(coverage)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-purple-500/50">
                  <div>{getDayName(offset)}, {getDayDate(offset)}</div>
                  <div className="text-purple-300 mt-1">{coverage} / {targetStaffing} staff ({percentage.toFixed(0)}%)</div>
                </div>
                <div className="w-2 h-2 bg-slate-900 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-purple-500/50"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-rose-600"></div>
            <span className="text-slate-400 font-semibold">&lt;60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-amber-600"></div>
            <span className="text-slate-400 font-semibold">60-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-amber-500"></div>
            <span className="text-slate-400 font-semibold">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
            <span className="text-slate-400 font-semibold">100-110%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-600"></div>
            <span className="text-slate-400 font-semibold">&gt;110%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
