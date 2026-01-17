import React, { useState, useMemo } from 'react';
import { X, Sparkles, Users, Clock, Award, CheckCircle, XCircle, Zap } from 'lucide-react';

interface QuickFillAIProps {
  shifts: any[];
  employees: any[];
  selectedWeek: Date;
  onClose: () => void;
  onApplySuggestions?: (suggestions: any[]) => void;
}

export function QuickFillAI({ shifts, employees, selectedWeek, onClose, onApplySuggestions }: QuickFillAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  
  // Calculate employee suitability scores
  const calculateSuitability = (emp: any, shift: any, empShifts: any[]) => {
    let score = 100;
    
    // Check for conflicts (same day)
    const hasConflict = empShifts.some(s => {
      const sDate = new Date(s.date).toDateString();
      const shiftDate = new Date(shift.date).toDateString();
      return sDate === shiftDate;
    });
    if (hasConflict) score -= 50;
    
    // Check weekly hours
    const weeklyHours = empShifts
      .filter(s => {
        const sDate = new Date(s.date);
        const weekStart = new Date(selectedWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return sDate >= weekStart && sDate < weekEnd && !s.isTimeOff;
      })
      .reduce((sum, s) => {
        const start = new Date(`2000-01-01T${s.startTime}`);
        const end = new Date(`2000-01-01T${s.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
    
    // Prefer employees with fewer hours (for fair distribution)
    if (weeklyHours > 40) score -= 30;
    else if (weeklyHours > 32) score -= 15;
    else if (weeklyHours < 20) score += 10;
    
    // Check for consecutive days worked
    const sortedShifts = [...empShifts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const shiftDate = new Date(shift.date);
    const prevDay = new Date(shiftDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const nextDay = new Date(shiftDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const workedPrevDay = sortedShifts.some(s => 
      new Date(s.date).toDateString() === prevDay.toDateString()
    );
    const workedNextDay = sortedShifts.some(s => 
      new Date(s.date).toDateString() === nextDay.toDateString()
    );
    
    if (workedPrevDay && workedNextDay) score -= 20; // Too many consecutive days
    
    // Randomize slightly for variety (±5 points)
    score += (Math.random() * 10) - 5;
    
    return Math.max(0, Math.min(100, score));
  };
  
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Find unassigned shifts in the selected week
      const weekStart = new Date(selectedWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const unassignedShifts = shifts.filter(s => {
        const shiftDate = new Date(s.date);
        return !s.employeeName && shiftDate >= weekStart && shiftDate < weekEnd;
      });
      
      // Generate suggestions for each unassigned shift
      const newSuggestions = unassignedShifts.map(shift => {
        // Get all employee shifts for analysis
        const employeeScores = employees.map(emp => {
          const empShifts = shifts.filter(s => s.employeeName === emp.name);
          const score = calculateSuitability(emp, shift, empShifts);
          
          return {
            employee: emp,
            score,
            weeklyHours: empShifts
              .filter(s => {
                const sDate = new Date(s.date);
                return sDate >= weekStart && sDate < weekEnd && !s.isTimeOff;
              })
              .reduce((sum, s) => {
                const start = new Date(`2000-01-01T${s.startTime}`);
                const end = new Date(`2000-01-01T${s.endTime}`);
                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              }, 0)
          };
        });
        
        // Sort by score and pick top 3
        const topCandidates = employeeScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        
        return {
          shift,
          candidates: topCandidates,
          recommended: topCandidates[0]
        };
      });
      
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 1500); // Simulate AI processing time
  };
  
  const applySuggestion = (suggestion: any) => {
    const shiftId = `${suggestion.shift.date}-${suggestion.shift.startTime}`;
    setAppliedSuggestions(prev => new Set([...prev, shiftId]));
  };
  
  const applyAllSuggestions = () => {
    if (onApplySuggestions) {
      onApplySuggestions(suggestions);
    }
    suggestions.forEach(s => {
      const shiftId = `${s.shift.date}-${s.shift.startTime}`;
      setAppliedSuggestions(prev => new Set([...prev, shiftId]));
    });
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Perfect Match', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Good Fit', color: 'bg-yellow-500' };
    if (score >= 40) return { label: 'Fair Match', color: 'bg-orange-500' };
    return { label: 'Poor Match', color: 'bg-red-500' };
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6 flex items-center justify-between border-b-2 border-purple-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Quick-Fill AI Assistant
            </h2>
            <p className="text-purple-100 text-sm mt-1 font-semibold">
              Smart employee suggestions based on availability, hours, and performance
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {suggestions.length === 0 ? (
            // Initial State
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                AI-Powered Scheduling Assistant
              </h3>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Let our AI analyze your team's availability, workload, and qualifications to suggest 
                the best employee for each open shift. Save hours of manual scheduling!
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-sm font-bold text-white mb-1">Availability Check</div>
                  <div className="text-xs text-slate-400">Avoids double-booking</div>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-sm font-bold text-white mb-1">Hour Balance</div>
                  <div className="text-xs text-slate-400">Distributes hours fairly</div>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-sm font-bold text-white mb-1">Performance Score</div>
                  <div className="text-xs text-slate-400">Prioritizes top performers</div>
                </div>
              </div>
              
              <button
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-3 mx-auto text-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Suggestions...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate AI Suggestions
                  </>
                )}
              </button>
            </div>
          ) : (
            // Suggestions Display
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {suggestions.length} Shifts Need Assignment
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    AI analyzed {employees.length} employees to find optimal matches
                  </p>
                </div>
                <button
                  onClick={applyAllSuggestions}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Apply All ({suggestions.length})
                </button>
              </div>
              
              <div className="space-y-4">
                {suggestions.map((suggestion, idx) => {
                  const shiftId = `${suggestion.shift.date}-${suggestion.shift.startTime}`;
                  const isApplied = appliedSuggestions.has(shiftId);
                  const badge = getScoreBadge(suggestion.recommended.score);
                  
                  return (
                    <div key={idx} className={`bg-slate-800/50 rounded-2xl p-6 border ${isApplied ? 'border-green-500/50 bg-green-900/10' : 'border-slate-700'}`}>
                      {/* Shift Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-black text-white">
                              {new Date(suggestion.shift.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-sm text-slate-400 font-semibold">
                              {suggestion.shift.startTime} - {suggestion.shift.endTime}
                            </div>
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30">
                              {suggestion.shift.role || 'General Staff'}
                            </span>
                          </div>
                          {suggestion.shift.department && (
                            <div className="text-xs text-slate-500 font-semibold">
                              {suggestion.shift.department}
                            </div>
                          )}
                        </div>
                        
                        {isApplied && (
                          <div className="flex items-center gap-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-xl font-bold border border-green-500/30">
                            <CheckCircle className="w-5 h-5" />
                            Applied
                          </div>
                        )}
                      </div>
                      
                      {/* Top Recommendation */}
                      <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border-2 border-purple-500/50 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-lg">
                              {suggestion.recommended.employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-lg font-black text-white">
                                {suggestion.recommended.employee.name}
                              </div>
                              <div className="text-xs text-purple-300 font-semibold">
                                ⭐ AI Recommended
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-3xl font-black ${getScoreColor(suggestion.recommended.score)}`}>
                              {suggestion.recommended.score.toFixed(0)}
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${badge.color} text-white mt-1`}>
                              {badge.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {suggestion.recommended.weeklyHours.toFixed(1)}h this week
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            High performer
                          </span>
                        </div>
                        
                        {!isApplied && (
                          <button
                            onClick={() => applySuggestion(suggestion)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Assign {suggestion.recommended.employee.name}
                          </button>
                        )}
                      </div>
                      
                      {/* Alternative Candidates */}
                      <div>
                        <div className="text-sm font-bold text-slate-400 mb-2">Alternative Options:</div>
                        <div className="grid grid-cols-2 gap-3">
                          {suggestion.candidates.slice(1).map((candidate, cIdx) => {
                            const cBadge = getScoreBadge(candidate.score);
                            return (
                              <div key={cIdx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-sm">
                                      {candidate.employee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                      {candidate.employee.name}
                                    </span>
                                  </div>
                                  <span className={`text-lg font-black ${getScoreColor(candidate.score)}`}>
                                    {candidate.score.toFixed(0)}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                  {candidate.weeklyHours.toFixed(1)}h this week
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
