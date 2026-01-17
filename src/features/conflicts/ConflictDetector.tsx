import React from 'react';
import { AlertTriangle, Clock, Users, XCircle } from 'lucide-react';

interface Conflict {
  type: 'double-booking' | 'overtime' | 'understaffing';
  severity: 'error' | 'warning';
  message: string;
  employeeName?: string;
  date?: string;
}

interface ConflictDetectorProps {
  shifts: any[];
  onClose?: () => void;
}

export function ConflictDetector({ shifts, onClose }: ConflictDetectorProps) {
  const detectConflicts = (): Conflict[] => {
    const conflicts: Conflict[] = [];
    
    // 1. Double Booking Detection
    const shiftsByEmployee = new Map<string, any[]>();
    shifts.forEach(shift => {
      if (!shift.isTimeOff) {
        const key = shift.employeeName;
        if (!shiftsByEmployee.has(key)) {
          shiftsByEmployee.set(key, []);
        }
        shiftsByEmployee.get(key)!.push(shift);
      }
    });
    
    shiftsByEmployee.forEach((employeeShifts, employeeName) => {
      for (let i = 0; i < employeeShifts.length; i++) {
        for (let j = i + 1; j < employeeShifts.length; j++) {
          const shift1 = employeeShifts[i];
          const shift2 = employeeShifts[j];
          
          // Check if same date
          if (shift1.date.split('T')[0] === shift2.date.split('T')[0]) {
            // Check if times overlap
            const start1 = new Date(`2000-01-01T${shift1.startTime}`).getTime();
            const end1 = new Date(`2000-01-01T${shift1.endTime}`).getTime();
            const start2 = new Date(`2000-01-01T${shift2.startTime}`).getTime();
            const end2 = new Date(`2000-01-01T${shift2.endTime}`).getTime();
            
            if ((start1 < end2 && end1 > start2)) {
              conflicts.push({
                type: 'double-booking',
                severity: 'error',
                message: `${employeeName} is double-booked on ${new Date(shift1.date).toLocaleDateString()} (${shift1.startTime}-${shift1.endTime} overlaps with ${shift2.startTime}-${shift2.endTime})`,
                employeeName,
                date: shift1.date
              });
            }
          }
        }
      }
    });
    
    // 2. Overtime Detection
    shiftsByEmployee.forEach((employeeShifts, employeeName) => {
      // Group by week
      const weeklyHours = new Map<string, number>();
      
      employeeShifts.forEach(shift => {
        const shiftDate = new Date(shift.date);
        const weekStart = new Date(shiftDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        const start = new Date(`2000-01-01T${shift.startTime}`);
        const end = new Date(`2000-01-01T${shift.endTime}`);
        let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (hours < 0) hours += 24; // Handle overnight shifts
        
        weeklyHours.set(weekKey, (weeklyHours.get(weekKey) || 0) + hours);
      });
      
      weeklyHours.forEach((hours, weekStart) => {
        if (hours > 40) {
          conflicts.push({
            type: 'overtime',
            severity: 'warning',
            message: `${employeeName} scheduled for ${hours.toFixed(1)} hours week of ${new Date(weekStart).toLocaleDateString()} (${(hours - 40).toFixed(1)}hrs overtime)`,
            employeeName,
            date: weekStart
          });
        }
      });
    });
    
    // 3. Understaffing Detection
    const dailyCoverage = new Map<string, number>();
    shifts.forEach(shift => {
      if (!shift.isTimeOff) {
        const date = shift.date.split('T')[0];
        dailyCoverage.set(date, (dailyCoverage.get(date) || 0) + 1);
      }
    });
    
    dailyCoverage.forEach((count, date) => {
      if (count < 3) {
        conflicts.push({
          type: 'understaffing',
          severity: 'warning',
          message: `Only ${count} staff scheduled for ${new Date(date).toLocaleDateString()} (minimum 3 recommended)`,
          date
        });
      }
    });
    
    // Sort by severity (errors first, then warnings)
    return conflicts.sort((a, b) => {
      if (a.severity === 'error' && b.severity === 'warning') return -1;
      if (a.severity === 'warning' && b.severity === 'error') return 1;
      return 0;
    });
  };
  
  const conflicts = detectConflicts();
  const errorCount = conflicts.filter(c => c.severity === 'error').length;
  const warningCount = conflicts.filter(c => c.severity === 'warning').length;
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'double-booking': return <XCircle className="w-5 h-5" />;
      case 'overtime': return <Clock className="w-5 h-5" />;
      case 'understaffing': return <Users className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    return severity === 'error' 
      ? 'from-red-500 to-rose-600'
      : 'from-yellow-500 to-amber-600';
  };
  
  return (
    <div className="fixed bottom-6 left-6 z-40 w-96 max-h-[500px] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-red-500/40 print:hidden">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 p-4 rounded-t-2xl flex items-center justify-between border-b-2 border-red-400/50">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg">Conflict Detection</h3>
            <p className="text-xs text-red-200 font-semibold">
              {errorCount} errors • {warningCount} warnings
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Conflicts List */}
      <div className="p-4 space-y-3">
        {conflicts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-white">No Conflicts Detected</p>
            <p className="text-sm text-slate-400 mt-2">Your schedule looks great!</p>
          </div>
        ) : (
          <>
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className={`bg-white/5 backdrop-blur-lg rounded-xl p-4 border-2 transition-all hover:scale-[1.02] ${
                  conflict.severity === 'error' 
                    ? 'border-red-500/50 hover:border-red-400' 
                    : 'border-yellow-500/50 hover:border-yellow-400'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`bg-gradient-to-br ${getSeverityColor(conflict.severity)} p-2 rounded-lg text-white shrink-0`}>
                    {getIcon(conflict.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                        conflict.severity === 'error' 
                          ? 'bg-red-500/30 text-red-200' 
                          : 'bg-yellow-500/30 text-yellow-200'
                      }`}>
                        {conflict.severity}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        conflict.severity === 'error' 
                          ? 'bg-red-900/50 text-red-300' 
                          : 'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {conflict.type.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed mt-2">
                      {conflict.message}
                    </p>
                  </div>
                </div>
                <button className={`w-full px-4 py-2 bg-gradient-to-r ${
                  conflict.severity === 'error' 
                    ? 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500' 
                    : 'from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500'
                } text-white text-sm font-semibold rounded-lg transition-all shadow-lg`}>
                  Fix Issue
                </button>
              </div>
            ))}
            
            {/* Fix All Button */}
            {conflicts.length > 1 && (
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg">
                🔧 Fix All Issues ({conflicts.length})
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 bg-gradient-to-r from-slate-900 to-slate-800 p-3 rounded-b-2xl border-t border-slate-700">
        <p className="text-center text-xs text-slate-400 font-semibold">
          Real-time conflict monitoring • Auto-updated
        </p>
      </div>
    </div>
  );
}
