import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Home, Crown, Medal, Star, Zap, TrendingUp, Users, Gamepad2, Award, Target, Clock, Flame } from 'lucide-react';

interface LeaderEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak: number;
  badges: string[];
  trend: 'up' | 'down' | 'same';
}

export default function Leaderboards() {
  const [selectedBoard, setSelectedBoard] = useState<'overall' | 'games' | 'performance' | 'attendance'>('overall');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'alltime'>('month');

  const overallLeaders: LeaderEntry[] = [
    { rank: 1, id: '1', name: 'Sarah Johnson', avatar: 'SJ', score: 8750, level: 12, streak: 45, badges: ['🏆', '⭐', '🔥', '💎'], trend: 'up' },
    { rank: 2, id: '2', name: 'Michael Chen', avatar: 'MC', score: 8320, level: 11, streak: 38, badges: ['🏆', '⭐', '🔥'], trend: 'same' },
    { rank: 3, id: '3', name: 'Emily Davis', avatar: 'ED', score: 7895, level: 10, streak: 32, badges: ['🏆', '⭐'], trend: 'up' },
    { rank: 4, id: '4', name: 'James Wilson', avatar: 'JW', score: 7540, level: 10, streak: 28, badges: ['🏆', '⭐'], trend: 'down' },
    { rank: 5, id: '5', name: 'Karen Martinez', avatar: 'KM', score: 7210, level: 9, streak: 25, badges: ['🏆'], trend: 'up' },
    { rank: 6, id: '6', name: 'Izzy Cooper', avatar: 'IC', score: 6890, level: 8, streak: 22, badges: ['⭐', '🔥'], trend: 'up' },
    { rank: 7, id: '7', name: 'David Lee', avatar: 'DL', score: 6450, level: 8, streak: 18, badges: ['⭐'], trend: 'same' },
    { rank: 8, id: '8', name: 'Lisa Park', avatar: 'LP', score: 6120, level: 7, streak: 15, badges: ['⭐'], trend: 'down' },
    { rank: 9, id: '9', name: 'Tom Brown', avatar: 'TB', score: 5780, level: 7, streak: 12, badges: [], trend: 'up' },
    { rank: 10, id: '10', name: 'Rachel Green', avatar: 'RG', score: 5450, level: 6, streak: 10, badges: [], trend: 'same' },
  ];

  const gamesLeaders: LeaderEntry[] = [
    { rank: 1, id: '1', name: 'Michael Chen', avatar: 'MC', score: 2840, level: 11, streak: 18, badges: ['🎮', '🏆', '🎯'], trend: 'up' },
    { rank: 2, id: '2', name: 'Emily Davis', avatar: 'ED', score: 2560, level: 10, streak: 15, badges: ['🎮', '🏆'], trend: 'up' },
    { rank: 3, id: '3', name: 'Sarah Johnson', avatar: 'SJ', score: 2380, level: 12, streak: 14, badges: ['🎮'], trend: 'same' },
    { rank: 4, id: '4', name: 'Izzy Cooper', avatar: 'IC', score: 2120, level: 8, streak: 12, badges: ['🎮'], trend: 'up' },
    { rank: 5, id: '5', name: 'James Wilson', avatar: 'JW', score: 1980, level: 10, streak: 10, badges: [], trend: 'down' },
  ];

  const performanceLeaders: LeaderEntry[] = [
    { rank: 1, id: '1', name: 'Sarah Johnson', avatar: 'SJ', score: 98, level: 12, streak: 30, badges: ['⭐', '💯', '🏆'], trend: 'up' },
    { rank: 2, id: '2', name: 'James Wilson', avatar: 'JW', score: 96, level: 10, streak: 25, badges: ['⭐', '💯'], trend: 'up' },
    { rank: 3, id: '3', name: 'Karen Martinez', avatar: 'KM', score: 94, level: 9, streak: 22, badges: ['⭐'], trend: 'same' },
    { rank: 4, id: '4', name: 'Michael Chen', avatar: 'MC', score: 92, level: 11, streak: 20, badges: ['⭐'], trend: 'up' },
    { rank: 5, id: '5', name: 'Emily Davis', avatar: 'ED', score: 91, level: 10, streak: 18, badges: [], trend: 'down' },
  ];

  const attendanceLeaders: LeaderEntry[] = [
    { rank: 1, id: '1', name: 'Sarah Johnson', avatar: 'SJ', score: 100, level: 12, streak: 180, badges: ['✅', '🔥', '💎'], trend: 'up' },
    { rank: 2, id: '2', name: 'Karen Martinez', avatar: 'KM', score: 100, level: 9, streak: 165, badges: ['✅', '🔥'], trend: 'same' },
    { rank: 3, id: '3', name: 'Izzy Cooper', avatar: 'IC', score: 98, level: 8, streak: 142, badges: ['✅', '🔥'], trend: 'up' },
    { rank: 4, id: '4', name: 'Michael Chen', avatar: 'MC', score: 97, level: 11, streak: 128, badges: ['✅'], trend: 'up' },
    { rank: 5, id: '5', name: 'David Lee', avatar: 'DL', score: 96, level: 8, streak: 115, badges: ['✅'], trend: 'same' },
  ];

  const getCurrentLeaders = () => {
    switch (selectedBoard) {
      case 'games': return gamesLeaders;
      case 'performance': return performanceLeaders;
      case 'attendance': return attendanceLeaders;
      default: return overallLeaders;
    }
  };

  const leaders = getCurrentLeaders();
  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Command Center</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                  Leaderboards 🏆
                </h1>
                <p className="text-xs text-purple-200">Compete, Achieve, Celebrate!</p>
              </div>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex gap-2 bg-white/5 rounded-lg p-1">
              {[
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
                { id: 'year', label: 'Year' },
                { id: 'alltime', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    timeframe === t.id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Board Selector */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'overall', label: 'Overall', icon: Trophy, emoji: '🏆' },
              { id: 'games', label: 'Games', icon: Gamepad2, emoji: '🎮' },
              { id: 'performance', label: 'Performance', icon: TrendingUp, emoji: '⭐' },
              { id: 'attendance', label: 'Attendance', icon: Target, emoji: '✅' },
            ].map((board) => {
              const Icon = board.icon;
              return (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoard(board.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedBoard === board.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{board.emoji}</span>
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{board.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500 rounded-2xl p-6 mb-4 hover:scale-105 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-2xl text-white font-bold mx-auto mb-3">
                    {topThree[1].avatar}
                  </div>
                  <Medal className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-white mb-1">{topThree[1].name}</h3>
                  <p className="text-3xl font-black text-slate-300 mb-2">{topThree[1].score.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {topThree[1].badges.map((badge, idx) => (
                      <span key={idx} className="text-lg">{badge}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Flame className="w-3 h-3" />
                    <span>{topThree[1].streak} day streak</span>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-xl flex items-center justify-center">
                  <span className="text-6xl font-black text-slate-400">2</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-400 rounded-2xl p-6 mb-4 hover:scale-105 transition-all shadow-2xl shadow-yellow-500/50 relative">
                  <Crown className="w-8 h-8 text-yellow-200 absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce" />
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center text-3xl text-yellow-900 font-bold mx-auto mb-3 border-4 border-yellow-200">
                    {topThree[0].avatar}
                  </div>
                  <Trophy className="w-14 h-14 text-yellow-200 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-white mb-1">{topThree[0].name}</h3>
                  <p className="text-4xl font-black text-yellow-100 mb-2">{topThree[0].score.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {topThree[0].badges.map((badge, idx) => (
                      <span key={idx} className="text-xl">{badge}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-yellow-100">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{topThree[0].streak} day streak</span>
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-t-xl flex items-center justify-center">
                  <span className="text-7xl font-black text-yellow-100">1</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-700 to-orange-900 border-2 border-orange-600 rounded-2xl p-6 mb-4 hover:scale-105 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-2xl text-white font-bold mx-auto mb-3">
                    {topThree[2].avatar}
                  </div>
                  <Award className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-white mb-1">{topThree[2].name}</h3>
                  <p className="text-3xl font-black text-orange-300 mb-2">{topThree[2].score.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {topThree[2].badges.map((badge, idx) => (
                      <span key={idx} className="text-lg">{badge}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-300">
                    <Flame className="w-3 h-3" />
                    <span>{topThree[2].streak} day streak</span>
                  </div>
                </div>
                <div className="h-24 bg-gradient-to-br from-orange-700 to-orange-900 rounded-t-xl flex items-center justify-center">
                  <span className="text-5xl font-black text-orange-400">3</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Full Rankings
          </h2>
          <div className="space-y-2">
            {rest.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  <span className="text-2xl font-bold text-purple-300">#{entry.rank}</span>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg text-white font-bold">
                  {entry.avatar}
                </div>

                {/* Name & Level */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {entry.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <Star className="w-3 h-3" />
                    <span>Level {entry.level}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1">
                  {entry.badges.map((badge, idx) => (
                    <span key={idx} className="text-xl">{badge}</span>
                  ))}
                </div>

                {/* Streak */}
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-lg">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold text-sm">{entry.streak}</span>
                </div>

                {/* Score */}
                <div className="text-right min-w-[100px]">
                  <p className="text-2xl font-black text-white">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-purple-300">points</p>
                </div>

                {/* Trend */}
                <div className="w-8">
                  {entry.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
                  {entry.trend === 'down' && <TrendingUp className="w-5 h-5 text-red-400 transform rotate-180" />}
                  {entry.trend === 'same' && <span className="text-purple-400">━</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
