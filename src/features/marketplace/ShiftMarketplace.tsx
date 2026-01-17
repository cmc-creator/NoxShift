import React, { useState } from 'react';
import { X, DollarSign, Clock, TrendingUp, Award, Zap, Star, Trophy, Crown } from 'lucide-react';

interface BonusShift {
  id: string;
  date: string;
  time: string;
  position: string;
  bonusAmount: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  xpReward: number;
  description: string;
  claimedBy?: string;
}

interface ShiftMarketplaceProps {
  onClose: () => void;
  employees: any[];
  onClaimShift?: (shiftId: string, employeeId: string) => void;
}

export function ShiftMarketplace({ onClose, employees, onClaimShift }: ShiftMarketplaceProps) {
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high-pay' | 'urgent'>('all');
  
  // Sample bonus shifts
  const [bonusShifts] = useState<BonusShift[]>([
    {
      id: '1',
      date: '2026-01-10',
      time: '6:00 PM - 2:00 AM',
      position: 'Night Shift RN',
      bonusAmount: 150,
      urgency: 'critical',
      xpReward: 500,
      description: 'Extra coverage needed due to call-out'
    },
    {
      id: '2',
      date: '2026-01-11',
      time: '7:00 AM - 3:00 PM',
      position: 'Day Shift CNA',
      bonusAmount: 75,
      urgency: 'high',
      xpReward: 250,
      description: 'Weekend coverage needed'
    },
    {
      id: '3',
      date: '2026-01-12',
      time: '3:00 PM - 11:00 PM',
      position: 'Evening Shift LPN',
      bonusAmount: 100,
      urgency: 'medium',
      xpReward: 300,
      description: 'Holiday weekend shift'
    },
    {
      id: '4',
      date: '2026-01-13',
      time: '11:00 PM - 7:00 AM',
      position: 'Night Shift RN',
      bonusAmount: 125,
      urgency: 'high',
      xpReward: 400,
      description: 'Overnight coverage needed'
    },
    {
      id: '5',
      date: '2026-01-14',
      time: '7:00 AM - 3:00 PM',
      position: 'Day Shift CNA',
      bonusAmount: 50,
      urgency: 'low',
      xpReward: 150,
      description: 'Additional support requested'
    }
  ]);
  
  // Sample leaderboard data
  const leaderboard = [
    { name: 'Sarah Johnson', claims: 12, totalEarned: 1450, xp: 3600, rank: 1 },
    { name: 'Mike Chen', claims: 10, totalEarned: 1200, xp: 3000, rank: 2 },
    { name: 'Emma Wilson', claims: 8, totalEarned: 950, xp: 2400, rank: 3 },
    { name: 'David Lee', claims: 7, totalEarned: 825, xp: 2100, rank: 4 },
    { name: 'Lisa Martinez', claims: 6, totalEarned: 700, xp: 1800, rank: 5 }
  ];
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'from-red-600 to-rose-700';
      case 'high': return 'from-orange-500 to-amber-600';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-green-500 to-emerald-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };
  
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return { label: 'URGENT', icon: <Zap className="w-3 h-3" /> };
      case 'high': return { label: 'High Priority', icon: <TrendingUp className="w-3 h-3" /> };
      case 'medium': return { label: 'Medium', icon: <Clock className="w-3 h-3" /> };
      case 'low': return { label: 'Low', icon: <Star className="w-3 h-3" /> };
      default: return { label: '', icon: null };
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Trophy className="w-5 h-5 text-slate-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-4 h-4 text-purple-400" />;
    }
  };
  
  const filteredShifts = bonusShifts.filter(shift => {
    if (filter === 'high-pay') return shift.bonusAmount >= 100;
    if (filter === 'urgent') return shift.urgency === 'critical' || shift.urgency === 'high';
    return true;
  });
  
  const handleClaim = (shiftId: string) => {
    if (onClaimShift && employees.length > 0) {
      onClaimShift(shiftId, employees[0].id);
    }
    setSelectedShift(shiftId);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 flex items-center justify-between border-b-2 border-purple-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Shift Marketplace
            </h2>
            <p className="text-purple-100 text-sm mt-1 font-semibold">
              Claim bonus shifts and earn rewards • {filteredShifts.length} available
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
          {/* Left Column: Available Shifts */}
          <div className="col-span-2 space-y-4">
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Shifts
              </button>
              <button
                onClick={() => setFilter('high-pay')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === 'high-pay'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                High Pay ($100+)
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === 'urgent'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Urgent
              </button>
            </div>
            
            {/* Shift Cards */}
            {filteredShifts.map(shift => {
              const urgencyBadge = getUrgencyBadge(shift.urgency);
              
              return (
                <div
                  key={shift.id}
                  className={`bg-gradient-to-br ${getUrgencyColor(shift.urgency)} rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer ${
                    selectedShift === shift.id ? 'ring-4 ring-green-400' : ''
                  }`}
                  onClick={() => setSelectedShift(shift.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {urgencyBadge.icon}
                        <span className="text-xs font-black text-white/90 uppercase tracking-wider">
                          {urgencyBadge.label}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white">{shift.position}</h3>
                      <p className="text-sm text-white/80 font-semibold mt-1">
                        {new Date(shift.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl mb-2">
                        <div className="text-3xl font-black text-white">
                          ${shift.bonusAmount}
                        </div>
                        <div className="text-xs text-white/80 font-bold">Bonus</div>
                      </div>
                      <div className="bg-purple-900/40 backdrop-blur px-3 py-1 rounded-lg">
                        <div className="text-sm font-bold text-yellow-300">
                          +{shift.xpReward} XP
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-white/90">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-bold">{shift.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm font-semibold mb-4">
                    {shift.description}
                  </p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaim(shift.id);
                    }}
                    className="w-full bg-white text-slate-900 font-black py-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Award className="w-5 h-5" />
                    Claim This Shift
                  </button>
                </div>
              );
            })}
            
            {filteredShifts.length === 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-12 text-center border-2 border-slate-700">
                <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold text-lg">
                  No shifts match your filter
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Try adjusting your filters to see more options
                </p>
              </div>
            )}
          </div>
          
          {/* Right Column: Leaderboard */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl p-6 border-2 border-yellow-400/30 shadow-xl">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Top Earners
              </h3>
              
              <div className="space-y-3">
                {leaderboard.map((person, index) => (
                  <div
                    key={index}
                    className={`bg-white/20 backdrop-blur rounded-xl p-4 border-2 ${
                      person.rank === 1
                        ? 'border-yellow-300'
                        : person.rank === 2
                        ? 'border-slate-300'
                        : person.rank === 3
                        ? 'border-amber-500'
                        : 'border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getRankIcon(person.rank)}
                      <div className="flex-1">
                        <div className="font-black text-white text-sm">
                          {person.name}
                        </div>
                        <div className="text-xs text-white/70 font-semibold">
                          #{person.rank} • {person.claims} claims
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-green-900/40 rounded-lg px-2 py-1">
                        <div className="text-green-300 font-black">
                          ${person.totalEarned}
                        </div>
                        <div className="text-green-200/70 font-semibold">Earned</div>
                      </div>
                      <div className="bg-purple-900/40 rounded-lg px-2 py-1">
                        <div className="text-purple-300 font-black">
                          {person.xp} XP
                        </div>
                        <div className="text-purple-200/70 font-semibold">Points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 border-2 border-indigo-400/30 shadow-xl">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                This Month
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {filteredShifts.reduce((sum, s) => sum + s.bonusAmount, 0)}
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Total Bonuses Available
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {filteredShifts.reduce((sum, s) => sum + s.xpReward, 0)}
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Total XP Available
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl font-black text-white">
                    {filteredShifts.filter(s => s.urgency === 'critical').length}
                  </div>
                  <div className="text-xs text-white/70 font-bold">
                    Urgent Shifts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
