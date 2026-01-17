import React, { useState } from 'react';
import { X, Heart, Clock, TrendingUp, Award, Users, Calendar, CheckCircle } from 'lucide-react';

interface PTODonation {
  id: string;
  requestorName: string;
  requestorId: string;
  reason: string;
  hoursNeeded: number;
  hoursReceived: number;
  deadline: string;
  story: string;
  donorCount: number;
}

interface DonationHistory {
  donorName: string;
  recipientName: string;
  hours: number;
  date: string;
  message?: string;
}

interface PTODonationsProps {
  onClose: () => void;
  employees: any[];
  onDonate?: (requestId: string, employeeId: string, hours: number) => void;
}

export function PTODonations({ onClose, employees, onDonate }: PTODonationsProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(8);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Sample PTO donation requests
  const [requests] = useState<PTODonation[]>([
    {
      id: '1',
      requestorName: 'Sarah Johnson',
      requestorId: 'emp1',
      reason: 'Family Medical Emergency',
      hoursNeeded: 80,
      hoursReceived: 56,
      deadline: '2026-01-15',
      story: 'Sarah\'s mother was recently diagnosed with a serious illness and she needs time to care for her and be by her side during treatment.',
      donorCount: 7
    },
    {
      id: '2',
      requestorName: 'Mike Chen',
      requestorId: 'emp2',
      reason: 'Personal Health Recovery',
      hoursNeeded: 40,
      hoursReceived: 32,
      deadline: '2026-01-20',
      story: 'Mike is recovering from surgery and needs additional time off to fully heal before returning to work.',
      donorCount: 4
    },
    {
      id: '3',
      requestorName: 'Emma Wilson',
      requestorId: 'emp3',
      reason: 'Child Care Crisis',
      hoursNeeded: 24,
      hoursReceived: 8,
      deadline: '2026-01-12',
      story: 'Emma\'s regular childcare provider unexpectedly closed and she needs time to find alternative care arrangements.',
      donorCount: 1
    }
  ]);
  
  // Sample donation history (Wall of Generosity)
  const [history] = useState<DonationHistory[]>([
    {
      donorName: 'David Lee',
      recipientName: 'Sarah Johnson',
      hours: 8,
      date: '2026-01-05',
      message: 'Wishing your mom a speedy recovery! 💙'
    },
    {
      donorName: 'Lisa Martinez',
      recipientName: 'Mike Chen',
      hours: 8,
      date: '2026-01-04',
      message: 'Take care of yourself! We\'ve got your back.'
    },
    {
      donorName: 'John Smith',
      recipientName: 'Sarah Johnson',
      hours: 16,
      date: '2026-01-03',
      message: 'Family comes first. Hope this helps!'
    },
    {
      donorName: 'Amy Brown',
      recipientName: 'Mike Chen',
      hours: 8,
      date: '2026-01-02'
    },
    {
      donorName: 'Tom Wilson',
      recipientName: 'Emma Wilson',
      hours: 8,
      date: '2026-01-01',
      message: 'We support our team!'
    }
  ]);
  
  const getProgressColor = (received: number, needed: number) => {
    const percentage = (received / needed) * 100;
    if (percentage < 40) return 'from-red-500 to-rose-600';
    if (percentage < 70) return 'from-yellow-500 to-amber-600';
    if (percentage < 100) return 'from-blue-500 to-cyan-600';
    return 'from-green-500 to-emerald-600';
  };
  
  const getUrgencyLabel = (deadline: string, received: number, needed: number) => {
    const daysUntil = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const percentage = (received / needed) * 100;
    
    if (percentage >= 100) return { label: 'Goal Met!', color: 'text-green-400' };
    if (daysUntil <= 3) return { label: 'Urgent - ' + daysUntil + ' days left', color: 'text-red-400' };
    if (daysUntil <= 7) return { label: daysUntil + ' days remaining', color: 'text-yellow-400' };
    return { label: daysUntil + ' days remaining', color: 'text-blue-400' };
  };
  
  const handleDonate = (requestId: string) => {
    if (onDonate && employees.length > 0) {
      onDonate(requestId, employees[0].id, donationAmount);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedRequest(null);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-pink-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-6 flex items-center justify-between border-b-2 border-pink-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Heart className="w-8 h-8" />
              PTO Donation Program
            </h2>
            <p className="text-pink-100 text-sm mt-1 font-semibold">
              Support your teammates in times of need • {requests.length} active requests
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6 p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Left Column: Active Requests */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-400" />
              Active Donation Requests
            </h3>
            
            {requests.map(request => {
              const percentage = (request.hoursReceived / request.hoursNeeded) * 100;
              const urgency = getUrgencyLabel(request.deadline, request.hoursReceived, request.hoursNeeded);
              const isComplete = percentage >= 100;
              
              return (
                <div
                  key={request.id}
                  className={`bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border-2 ${
                    isComplete ? 'border-green-500/50' : 'border-pink-500/30'
                  } shadow-xl hover:shadow-2xl transition-all ${
                    selectedRequest === request.id ? 'ring-4 ring-pink-400' : ''
                  }`}
                  onClick={() => setSelectedRequest(request.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-black text-lg">
                          {request.requestorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-white">
                            {request.requestorName}
                          </h4>
                          <p className="text-sm text-pink-400 font-bold">
                            {request.reason}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">
                        {request.story}
                      </p>
                    </div>
                    
                    {isComplete && (
                      <div className="ml-4">
                        <div className="bg-green-900/40 backdrop-blur px-4 py-2 rounded-xl border-2 border-green-500/50">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-1" />
                          <div className="text-xs text-green-300 font-bold text-center">
                            Goal Met!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-bold">
                        Progress: {request.hoursReceived} / {request.hoursNeeded} hours
                      </span>
                      <span className={`font-black ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>
                    
                    <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(request.hoursReceived, request.hoursNeeded)} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-white drop-shadow-lg">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">
                        Deadline: {new Date(request.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="font-semibold">
                        {request.donorCount} {request.donorCount === 1 ? 'donor' : 'donors'}
                      </span>
                    </div>
                  </div>
                  
                  {!isComplete && (
                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-sm text-slate-400 font-bold mb-2 block">
                            Donate Hours:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(Number(e.target.value))}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-pink-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDonate(request.id);
                          }}
                          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black px-8 py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg flex items-center gap-2 mt-6"
                        >
                          <Heart className="w-5 h-5" />
                          Donate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Right Column: Wall of Generosity */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 border-2 border-amber-400/30 shadow-xl">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Wall of Generosity
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((donation, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-300" />
                      <span className="text-sm font-black text-white">
                        {donation.donorName}
                      </span>
                    </div>
                    
                    <div className="text-xs text-white/80 font-semibold mb-2">
                      Donated <span className="font-black text-yellow-300">{donation.hours} hours</span> to {donation.recipientName}
                    </div>
                    
                    {donation.message && (
                      <div className="bg-slate-900/40 rounded-lg p-2 mb-2">
                        <p className="text-xs text-white/90 italic font-medium">
                          "{donation.message}"
                        </p>
                      </div>
                    )}
                    
                    <div className="text-xs text-white/60 font-semibold">
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 border-2 border-purple-400/30 shadow-xl">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Community Impact
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {history.reduce((sum, d) => sum + d.hours, 0)} hrs
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Total Donated This Month
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {new Set(history.map(d => d.donorName)).size}
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Active Donors
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {requests.filter(r => (r.hoursReceived / r.hoursNeeded) >= 1).length}
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Goals Reached
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 right-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-green-400/50 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
          <div>
            <div className="font-black text-lg">Donation Successful!</div>
            <div className="text-sm font-semibold text-green-100">
              Thank you for supporting your teammate 💚
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
