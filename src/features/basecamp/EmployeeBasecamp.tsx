import React, { useState } from 'react';
import { X, Mountain, Users, MessageSquare, Lightbulb, Award, Gamepad2, Bot, Clock, Bell, Star, Send, ThumbsUp, Flame, Target, Gift, Heart, Coffee, Zap, Calendar, TrendingUp, PartyPopper, CheckCircle, AlertCircle, Trophy, Sparkles, BookOpen, Camera } from 'lucide-react';

interface EmployeeBasecampProps {
  currentUser?: string;
  onClose: () => void;
}

export const EmployeeBasecamp: React.FC<EmployeeBasecampProps> = ({ currentUser = 'Alex', onClose }) => {
  // Clock & Mood State
  const [clockedIn, setClockedIn] = useState(false);
  const [lastClockTime, setLastClockTime] = useState<string | null>(null);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Titan AI State
  const [showTitanChat, setShowTitanChat] = useState(false);
  const [titanPersonality, setTitanPersonality] = useState('funny');
  const [titanMessage, setTitanMessage] = useState('');

  // Kudos State
  const [showGiveKudos, setShowGiveKudos] = useState(false);
  const [kudosRecipient, setKudosRecipient] = useState('');
  const [kudosMessage, setKudosMessage] = useState('');

  // Ideas State
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('general');

  // Games State
  const [showTrivia, setShowTrivia] = useState(false);
  const [triviaAnswer, setTriviaAnswer] = useState<string | null>(null);

  // Activity Feed State
  const [showActivityFeed, setShowActivityFeed] = useState(true);

  // Challenge State
  const [activeTab, setActiveTab] = useState('overview');

  const moodOptions = [
    { emoji: '😊', label: 'Great!', value: 'great', color: 'green' },
    { emoji: '😌', label: 'Good', value: 'good', color: 'blue' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: 'yellow' },
    { emoji: '😓', label: 'Stressed', value: 'stressed', color: 'orange', alert: true },
    { emoji: '😫', label: 'Burnt Out', value: 'burnout', color: 'red', alert: true },
    { emoji: '😢', label: 'Struggling', value: 'struggling', color: 'red', alert: true },
  ];

  const titanPersonalities = {
    smart: { name: '🧠 Smart', greeting: 'Hi! Ready to optimize your day?' },
    funny: { name: '😂 Funny', greeting: 'Yo! Let\'s crush this shift! 😎' },
    sassy: { name: '💅 Sassy', greeting: 'Well well, look who showed up! 💁' },
    goofy: { name: '🤪 Goofy', greeting: 'HEYYYY!!! LET\'S DO THIS!!! 🎉' },
  };

  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Manager', dept: 'Operations', status: 'active', avatar: 'SJ' },
    { name: 'Mike Chen', role: 'Shift Lead', dept: 'Operations', status: 'active', avatar: 'MC' },
    { name: 'Emma Davis', role: 'Team Member', dept: 'Operations', status: 'break', avatar: 'ED' },
    { name: 'Tom Wilson', role: 'Team Member', dept: 'Operations', status: 'scheduled', avatar: 'TW' },
    { name: 'Lisa Rodriguez', role: 'Team Member', dept: 'Sales', status: 'active', avatar: 'LR' },
  ];

  const kudosWall = [
    { from: 'Sarah Johnson', to: 'You', message: 'Excellent customer service today! 🌟', time: '2h ago' },
    { from: 'Mike Chen', to: 'Emma Davis', message: 'Team player of the month! 🏆', time: '5h ago' },
    { from: 'You', to: 'Lisa Rodriguez', message: 'Thanks for covering my shift! 💙', time: '1d ago' },
  ];

  const ideasBoard = [
    { id: 1, author: 'Emma Davis', idea: 'What if we had themed lunch Fridays? 🌮🍕', votes: 24, comments: 8, category: 'culture' },
    { id: 2, author: 'Tom Wilson', idea: 'Add a coffee machine in break room!', votes: 18, comments: 5, category: 'workplace' },
    { id: 3, author: 'Lisa Rodriguez', idea: 'Flexible start times on Mondays?', votes: 31, comments: 12, category: 'schedule' },
  ];

  const activityFeed = [
    { type: 'kudos', user: 'Sarah Johnson', action: 'gave kudos to Mike Chen', time: '5m ago', icon: '🌟' },
    { type: 'idea', user: 'Emma Davis', action: 'posted a new idea', time: '15m ago', icon: '💡' },
    { type: 'achievement', user: 'You', action: 'earned "10 Day Streak" badge', time: '1h ago', icon: '🏆' },
    { type: 'shift', user: 'Tom Wilson', action: 'swapped shift with Lisa', time: '2h ago', icon: '🔄' },
    { type: 'birthday', user: 'Sarah Johnson', action: 'has a birthday today! 🎂', time: 'today', icon: '🎉' },
  ];

  const upcomingBirthdays = [
    { name: 'Sarah Johnson', date: 'Today!', avatar: 'SJ' },
    { name: 'Tom Wilson', date: 'Tomorrow', avatar: 'TW' },
    { name: 'Emma Davis', date: 'Jan 25', avatar: 'ED' },
  ];

  const teamChallenges = [
    { id: 1, title: '100% Attendance Week', progress: 85, goal: 100, reward: '500 XP', participants: 12 },
    { id: 2, title: 'Customer Satisfaction Stars', progress: 47, goal: 50, reward: '1000 XP', participants: 8 },
    { id: 3, title: 'Zero Safety Incidents', progress: 30, goal: 30, reward: 'Team Lunch', participants: 15 },
  ];

  const triviaQuestion = {
    question: 'What year was the company founded?',
    options: ['2010', '2015', '2018', '2020'],
    correct: '2015',
    reward: '50 XP'
  };

  const handleClockToggle = () => {
    setClockedIn(!clockedIn);
    setLastClockTime(new Date().toLocaleTimeString());
  };

  const handleMoodSelection = (mood: any) => {
    setSelectedMood(mood.value);
    if (mood.alert) {
      alert('HR and your manager have been notified. Support is available 💙');
    }
    setTimeout(() => setShowMoodCheckIn(false), 2000);
  };

  const handleGiveKudos = () => {
    if (kudosRecipient && kudosMessage) {
      alert(`Kudos sent to ${kudosRecipient}! 🌟`);
      setShowGiveKudos(false);
      setKudosRecipient('');
      setKudosMessage('');
    }
  };

  const handleSubmitIdea = () => {
    if (newIdea) {
      alert('Your idea has been posted! 💡');
      setShowAddIdea(false);
      setNewIdea('');
    }
  };

  const handleTriviaAnswer = (answer: string) => {
    setTriviaAnswer(answer);
    if (answer === triviaQuestion.correct) {
      alert(`Correct! You earned ${triviaQuestion.reward}! 🎉`);
    } else {
      alert('Not quite! Try again tomorrow!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden border-2 border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-4 sm:p-6 border-b-2 border-purple-400/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Mountain className="w-32 h-32 sm:w-64 sm:h-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-2 sm:gap-3">
                <Mountain className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                <span className="hidden sm:inline">🏕️ Employee Basecamp</span>
                <span className="sm:hidden">🏕️ Basecamp</span>
              </h1>
              <p className="text-purple-100 text-sm sm:text-base md:text-lg">Welcome back, <strong>{currentUser}</strong>! <span className="hidden sm:inline">Your team hub for everything awesome! 🚀</span></p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm self-end sm:self-auto"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Mood Check-In Modal */}
        {showMoodCheckIn && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 max-w-2xl w-full border-2 border-purple-500/30 shadow-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">How are you feeling today?</h2>
              <p className="text-purple-200 text-center mb-4 sm:mb-6 text-sm sm:text-base">Your wellbeing matters to us 💚</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelection(mood)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all hover:scale-105 min-h-[88px] sm:min-h-0 ${
                      mood.color === 'green' ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/60' :
                      mood.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60' :
                      mood.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60' :
                      mood.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60' :
                      'bg-red-500/10 border-red-500/30 hover:border-red-500/60'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-white font-semibold text-xs sm:text-sm">{mood.label}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowMoodCheckIn(false)}
                className="w-full py-3 sm:py-2 text-slate-400 hover:text-white text-sm transition-colors min-h-[44px] sm:min-h-0"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(95vh-140px)] p-3 sm:p-6">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 bg-slate-800/50 p-2 rounded-xl border border-purple-500/20" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {[
              { id: 'overview', label: 'Overview', icon: Mountain },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'kudos', label: 'Kudos', icon: Award },
              { id: 'ideas', label: 'Ideas', icon: Lightbulb },
              { id: 'games', label: 'Games', icon: Gamepad2 },
              { id: 'titan', label: 'Titan AI', icon: Bot },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                <div className={`${clockedIn ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30' : 'bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30'} rounded-lg sm:rounded-xl p-3 sm:p-4 border-2`}>
                  <div className="flex items-center justify-between mb-2">
                    {clockedIn ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" /> : <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" />}
                  </div>
                  <div className={clockedIn ? 'text-green-200' : 'text-red-200'}>
                    <div className="font-bold text-xs sm:text-sm">{clockedIn ? 'CLOCKED IN' : 'NOT IN'}</div>
                    {lastClockTime && <div className="text-[10px] sm:text-xs mt-1">{lastClockTime}</div>}
                  </div>
                  <button 
                    onClick={handleClockToggle}
                    className={`mt-2 w-full px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg font-semibold text-xs ${clockedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-all min-h-[44px] sm:min-h-0`}
                  >
                    {clockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-orange-500/30">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">12</div>
                  <div className="text-orange-200 text-xs sm:text-sm font-semibold">Day Streak!</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-500/30">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">847</div>
                  <div className="text-yellow-200 text-xs sm:text-sm font-semibold">Kudos</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-purple-500/30">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">Level 7</div>
                  <div className="text-purple-200 text-xs sm:text-sm font-semibold">Rising Star</div>
                </div>

                <div className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-pink-500/30">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">3</div>
                  <div className="text-pink-200 text-xs sm:text-sm font-semibold">Rewards</div>
                </div>
              </div>

              {/* Activity Feed & Birthdays Row */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Live Activity Feed */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border-2 border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Live Activity Feed
                    </h2>
                    <button className="text-blue-300 hover:text-blue-200 text-sm font-semibold" onClick={() => setShowActivityFeed(!showActivityFeed)}>
                      {showActivityFeed ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showActivityFeed && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {activityFeed.map((activity, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{activity.icon}</span>
                            <div className="flex-1">
                              <p className="text-white text-sm"><strong>{activity.user}</strong> {activity.action}</p>
                              <p className="text-slate-400 text-xs">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Birthdays */}
                <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-xl p-6 border-2 border-pink-500/30">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <PartyPopper className="w-5 h-5 text-pink-400" />
                    Birthdays 🎂
                  </h2>
                  <div className="space-y-3">
                    {upcomingBirthdays.map((person, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-pink-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {person.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{person.name}</p>
                            <p className="text-pink-300 text-xs">{person.date}</p>
                          </div>
                        </div>
                        {person.date === 'Today!' && (
                          <button className="mt-2 w-full px-3 py-1 bg-pink-500 hover:bg-pink-600 rounded-lg text-xs font-semibold text-white transition-all">
                            Send Wishes! 🎉
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Challenges */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl p-6 border-2 border-emerald-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-400" />
                  Active Team Challenges
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {teamChallenges.map((challenge) => (
                    <div key={challenge.id} className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs text-emerald-300 font-semibold">{challenge.participants} joined</span>
                      </div>
                      <h3 className="text-white font-bold mb-2">{challenge.title}</h3>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>{challenge.progress}/{challenge.goal}</span>
                          <span>{Math.round((challenge.progress/challenge.goal)*100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${(challenge.progress/challenge.goal)*100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-300">🎁 {challenge.reward}</span>
                        <button className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-300 transition-all">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-blue-500/30">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  Team Directory
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          member.status === 'active' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                          member.status === 'break' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}>
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm sm:text-base truncate">{member.name}</p>
                          <p className="text-xs text-slate-300 truncate">{member.role} • {member.dept}</p>
                          <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
                            member.status === 'active' ? 'text-green-300' :
                            member.status === 'break' ? 'text-yellow-300' :
                            'text-slate-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'active' ? 'bg-green-400 animate-pulse' :
                              member.status === 'break' ? 'bg-yellow-400' :
                              'bg-slate-400'
                            }`}></div>
                            {member.status === 'active' ? 'Active' :
                             member.status === 'break' ? 'Break' :
                             'Later'}
                          </div>
                        </div>
                        <button className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-xs font-semibold text-blue-300 transition-all min-h-[44px] whitespace-nowrap">
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* KUDOS TAB */}
          {activeTab === 'kudos' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border-2 border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Kudos Wall
                  </h2>
                  <button
                    onClick={() => setShowGiveKudos(!showGiveKudos)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Give Kudos
                  </button>
                </div>

                {showGiveKudos && (
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-yellow-500/30">
                    <h3 className="text-white font-bold mb-3">Give someone kudos! 🌟</h3>
                    <div className="space-y-3">
                      <select
                        value={kudosRecipient}
                        onChange={(e) => setKudosRecipient(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                      >
                        <option value="">Select team member...</option>
                        {teamMembers.map((member) => (
                          <option key={member.name} value={member.name}>{member.name}</option>
                        ))}
                      </select>
                      <textarea
                        value={kudosMessage}
                        onChange={(e) => setKudosMessage(e.target.value)}
                        placeholder="What did they do awesome? Be specific! 💪"
                        className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-yellow-400 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleGiveKudos}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold text-white transition-all"
                        >
                          Send Kudos! 🎉
                        </button>
                        <button
                          onClick={() => setShowGiveKudos(false)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-white transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {kudosWall.map((kudos, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-yellow-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-yellow-300 font-semibold mb-1">
                            <strong>{kudos.from}</strong> → <strong>{kudos.to}</strong>
                          </p>
                          <p className="text-slate-300 text-sm mb-2">"{kudos.message}"</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-400">{kudos.time}</span>
                            <button className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                              <Heart className="w-3 h-3" /> Like
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IDEAS TAB */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border-2 border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    Ideas Board
                  </h2>
                  <button
                    onClick={() => setShowAddIdea(!showAddIdea)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Post Idea
                  </button>
                </div>

                {showAddIdea && (
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                    <h3 className="text-white font-bold mb-3">Share your brilliant idea! 💡</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {['general', 'culture', 'workplace', 'schedule', 'benefits'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setIdeaCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              ideaCategory === cat
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newIdea}
                        onChange={(e) => setNewIdea(e.target.value)}
                        placeholder="What's your idea? Be creative! 🚀"
                        className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSubmitIdea}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white transition-all"
                        >
                          Post Idea! ✨
                        </button>
                        <button
                          onClick={() => setShowAddIdea(false)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-white transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {ideasBoard.map((idea) => (
                    <div key={idea.id} className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all">
                            <Star className="w-4 h-4 text-purple-400" />
                          </button>
                          <span className="text-white font-bold text-sm">{idea.votes}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-purple-300 font-bold">{idea.author}</span>
                            <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-300">{idea.category}</span>
                          </div>
                          <p className="text-white mb-2">{idea.idea}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {idea.comments} comments
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GAMES TAB */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-xl p-6 border-2 border-pink-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-pink-400" />
                  Daily Trivia Challenge
                </h2>
                
                <div className="bg-slate-800/50 rounded-lg p-6 border border-pink-500/20">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">Question of the Day</h3>
                      <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs font-semibold text-yellow-300">
                        🎁 {triviaQuestion.reward}
                      </span>
                    </div>
                    <p className="text-white text-lg mb-4">{triviaQuestion.question}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {triviaQuestion.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleTriviaAnswer(option)}
                        disabled={triviaAnswer !== null}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          triviaAnswer === null
                            ? 'bg-slate-700 border-slate-600 hover:border-pink-500/60 text-white hover:bg-slate-600'
                            : triviaAnswer === option && option === triviaQuestion.correct
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : triviaAnswer === option
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : option === triviaQuestion.correct
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : 'bg-slate-700 border-slate-600 text-slate-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {triviaAnswer && (
                    <div className={`mt-4 p-4 rounded-lg border-2 ${
                      triviaAnswer === triviaQuestion.correct
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-orange-500/10 border-orange-500/30'
                    }`}>
                      <p className={`font-bold ${
                        triviaAnswer === triviaQuestion.correct ? 'text-green-300' : 'text-orange-300'
                      }`}>
                        {triviaAnswer === triviaQuestion.correct
                          ? '🎉 Correct! You earned ' + triviaQuestion.reward + '!'
                          : '😅 Not quite! The answer was ' + triviaQuestion.correct + '. Try again tomorrow!'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-pink-500/20 text-center">
                    <Gamepad2 className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">More Games</h3>
                    <p className="text-slate-300 text-sm mb-3">Tic-Tac-Toe, Word Search, Puzzles</p>
                    <button className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-sm font-semibold text-pink-300 transition-all">
                      Coming Soon!
                    </button>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-pink-500/20 text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">Leaderboard</h3>
                    <p className="text-slate-300 text-sm mb-3">See who's crushing it this month</p>
                    <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm font-semibold text-yellow-300 transition-all">
                      View Leaders
                    </button>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-pink-500/20 text-center">
                    <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">Photo Contest</h3>
                    <p className="text-slate-300 text-sm mb-3">Weekly themed photo challenges</p>
                    <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-semibold text-blue-300 transition-all">
                      Enter Contest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TITAN AI TAB */}
          {activeTab === 'titan' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-cyan-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    Titan Assistant
                  </h2>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {Object.entries(titanPersonalities).map(([key, personality]) => (
                      <button
                        key={key}
                        onClick={() => setTitanPersonality(key)}
                        className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] sm:min-h-0 ${
                          titanPersonality === key
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {personality.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-cyan-500/20 mb-4">
                  <p className="text-cyan-100 text-xs sm:text-sm mb-2">
                    <strong>Your AI assistant is here!</strong> I can help with:
                  </p>
                  <ul className="text-[10px] sm:text-xs text-cyan-200 space-y-1">
                    <li>• Shift swap requests & approvals</li>
                    <li>• Time-off questions & policies</li>
                    <li>• Benefits information & enrollment</li>
                    <li>• Schedule inquiries & changes</li>
                    <li>• Company policy lookups</li>
                    <li>• General workplace questions</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="h-64 sm:h-96 bg-slate-900/50 rounded-lg p-3 sm:p-4 overflow-y-auto space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-cyan-500/20 rounded-lg p-3 border border-cyan-400/30 max-w-md">
                        <p className="text-white text-xs sm:text-sm">
                          {titanPersonalities[titanPersonality as keyof typeof titanPersonalities].greeting}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={titanMessage}
                      onChange={(e) => setTitanMessage(e.target.value)}
                      placeholder="Ask Titan anything..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none text-sm sm:text-base"
                    />
                    <button className="px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-semibold text-white transition-all min-h-[44px]">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-xs text-slate-300 transition-all min-h-[36px]">
                      Request time off
                    </button>
                    <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-xs text-slate-300 transition-all min-h-[36px]">
                      Swap my shift
                    </button>
                    <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-xs text-slate-300 transition-all min-h-[36px]">
                      My benefits
                    </button>
                    <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-xs text-slate-300 transition-all min-h-[36px]">
                      Upcoming shifts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
