import React, { useState } from 'react';
import { X, Send, Eye, Lock, Unlock, CheckCircle, AlertCircle, Bell, Calendar, Users } from 'lucide-react';

interface SchedulePublisherProps {
  shifts: any[];
  employees: any[];
  currentMonth: string;
  onClose: () => void;
  onPublish?: (notifyEmployees: boolean, lockSchedule: boolean) => void;
}

export function SchedulePublisher({ shifts, employees, currentMonth, onClose, onPublish }: SchedulePublisherProps) {
  const [notifyEmployees, setNotifyEmployees] = useState(true);
  const [lockSchedule, setLockSchedule] = useState(false);
  const [includeMessage, setIncludeMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [publishStage, setPublishStage] = useState<'draft' | 'review' | 'published'>('draft');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const draftShifts = shifts.filter(s => s.isDraft);
  const finalizedShifts = shifts.filter(s => !s.isDraft);
  
  const affectedEmployees = new Set(shifts.map(s => s.employeeName)).size;
  const totalShifts = shifts.length;
  const totalHours = shifts.reduce((sum, s) => {
    if (s.isTimeOff) return sum;
    const start = new Date(`2000-01-01T${s.startTime}`);
    const end = new Date(`2000-01-01T${s.endTime}`);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);
  
  // Check for potential issues
  const issues = [];
  
  // Check for understaffed days
  const daysCoverage = new Map<string, number>();
  shifts.forEach(s => {
    if (!s.isTimeOff) {
      const date = s.date.split('T')[0];
      daysCoverage.set(date, (daysCoverage.get(date) || 0) + 1);
    }
  });
  
  const understaffedDays = Array.from(daysCoverage.entries()).filter(([_, count]) => count < 3);
  if (understaffedDays.length > 0) {
    issues.push({
      type: 'warning',
      message: `${understaffedDays.length} day(s) with less than 3 staff members`
    });
  }
  
  // Check for employees with no shifts
  const employeesWithShifts = new Set(shifts.filter(s => !s.isTimeOff).map(s => s.employeeName));
  const employeesWithoutShifts = employees.filter(e => !employeesWithShifts.has(e.name));
  if (employeesWithoutShifts.length > 0) {
    issues.push({
      type: 'warning',
      message: `${employeesWithoutShifts.length} employee(s) have no shifts assigned`
    });
  }
  
  // Check for excessive hours
  const employeeHours = new Map<string, number>();
  shifts.forEach(s => {
    if (!s.isTimeOff) {
      const hours = (new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / (1000 * 60 * 60);
      employeeHours.set(s.employeeName, (employeeHours.get(s.employeeName) || 0) + hours);
    }
  });
  
  const overworkedEmployees = Array.from(employeeHours.entries()).filter(([_, hours]) => hours > 160);
  if (overworkedEmployees.length > 0) {
    issues.push({
      type: 'error',
      message: `${overworkedEmployees.length} employee(s) scheduled for >160 hours this month`
    });
  }
  
  const handlePublish = () => {
    if (onPublish) {
      onPublish(notifyEmployees, lockSchedule);
    }
    setPublishStage('published');
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-green-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 flex items-center justify-between border-b-2 border-green-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Send className="w-8 h-8" />
              Publish Schedule
            </h2>
            <p className="text-green-100 text-sm mt-1 font-semibold">
              Review and publish {currentMonth} schedule to all employees
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {publishStage === 'published' ? (
            // Success State
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">Schedule Published! 🎉</h3>
              <p className="text-slate-300 text-lg">
                {notifyEmployees ? `${affectedEmployees} employees have been notified` : 'Schedule is now visible to all employees'}
              </p>
              {lockSchedule && (
                <div className="mt-4 inline-flex items-center gap-2 bg-blue-900/40 text-blue-200 px-4 py-2 rounded-xl font-semibold">
                  <Lock className="w-5 h-5" />
                  Schedule is now locked
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30">
                  <Users className="w-8 h-8 text-white mb-3" />
                  <div className="text-3xl font-black text-white">{affectedEmployees}</div>
                  <div className="text-sm text-blue-100 font-bold">Employees</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 border-2 border-purple-400/30">
                  <Calendar className="w-8 h-8 text-white mb-3" />
                  <div className="text-3xl font-black text-white">{totalShifts}</div>
                  <div className="text-sm text-purple-100 font-bold">Total Shifts</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400/30">
                  <CheckCircle className="w-8 h-8 text-white mb-3" />
                  <div className="text-3xl font-black text-white">{totalHours.toFixed(0)}</div>
                  <div className="text-sm text-green-100 font-bold">Total Hours</div>
                </div>
              </div>
              
              {/* Draft vs Finalized */}
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white">Schedule Status</h3>
                  <Eye className="w-5 h-5 text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-400 font-semibold mb-2">Finalized Shifts</div>
                    <div className="text-3xl font-black text-green-400">{finalizedShifts.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-semibold mb-2">Draft Shifts</div>
                    <div className="text-3xl font-black text-yellow-400">{draftShifts.length}</div>
                  </div>
                </div>
                {draftShifts.length > 0 && (
                  <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3">
                    <p className="text-sm text-yellow-200 font-semibold">
                      ⚠️ {draftShifts.length} draft shift(s) will be published as final
                    </p>
                  </div>
                )}
              </div>
              
              {/* Issues & Warnings */}
              {issues.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Issues to Review
                  </h3>
                  <div className="space-y-2">
                    {issues.map((issue, idx) => (
                      <div key={idx} className={`rounded-xl p-4 flex items-start gap-3 ${
                        issue.type === 'error' 
                          ? 'bg-red-900/20 border border-red-500/30' 
                          : 'bg-yellow-900/20 border border-yellow-500/30'
                      }`}>
                        {issue.type === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        )}
                        <p className={`text-sm font-semibold ${
                          issue.type === 'error' ? 'text-red-200' : 'text-yellow-200'
                        }`}>
                          {issue.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Publishing Options */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6">
                <h3 className="text-lg font-black text-white mb-4">Publishing Options</h3>
                
                <div className="space-y-4">
                  {/* Notify Employees */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={notifyEmployees}
                      onChange={(e) => setNotifyEmployees(e.target.checked)}
                      className="w-6 h-6 rounded mt-1 accent-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-white group-hover:text-green-400 transition-colors">
                          Notify All Employees
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Send email/SMS notification to all {affectedEmployees} employees when schedule is published
                      </p>
                    </div>
                  </label>
                  
                  {/* Lock Schedule */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lockSchedule}
                      onChange={(e) => setLockSchedule(e.target.checked)}
                      className="w-6 h-6 rounded mt-1 accent-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          Lock Schedule After Publishing
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Prevent changes to finalized shifts. You'll need to unlock to make edits.
                      </p>
                    </div>
                  </label>
                  
                  {/* Custom Message */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeMessage}
                      onChange={(e) => setIncludeMessage(e.target.checked)}
                      className="w-6 h-6 rounded mt-1 accent-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Send className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-white group-hover:text-purple-400 transition-colors">
                          Include Custom Message
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        Add a personal message to the notification
                      </p>
                      {includeMessage && (
                        <textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="e.g., 'Please review your schedule and let me know if you have any conflicts. Thanks!'"
                          className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-purple-500 resize-none"
                          rows={3}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Publish Schedule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md border-2 border-green-500/50">
            <h3 className="text-2xl font-black text-white mb-4">Confirm Publishing</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to publish this schedule? This action will:
            </p>
            <ul className="space-y-2 mb-6 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Make schedule visible to all employees</span>
              </li>
              {notifyEmployees && (
                <li className="flex items-start gap-2">
                  <Bell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Send notifications to {affectedEmployees} employees</span>
                </li>
              )}
              {lockSchedule && (
                <li className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Lock schedule to prevent accidental changes</span>
                </li>
              )}
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  handlePublish();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
