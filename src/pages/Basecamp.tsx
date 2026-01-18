import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Users, Heart, MessageCircle, Gamepad2, Trophy, Award, Star,
  Calendar, Zap, Crown, Rocket, Coins, ShoppingBag, Home, ChevronRight, Play, Lock, CheckCircle
} from 'lucide-react';

interface BasecampUser {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  interests?: string[];
  joinDate: string;
  xp: number;
  level: number;
  rank: string;
  coins: number;
  gems: number;
  achievements: string[];
}

interface Shoutout {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: number;
  likes: number;
  likedBy: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  icon: string;
  category: string;
}

export default function Basecamp() {
  const [currentUser, setCurrentUser] = useState<BasecampUser>({
    id: '1',
    name: 'Izzy',
    email: 'izzy@noxshift.com',
    role: 'Reception',
    bio: 'Passionate about great customer service and team collaboration!',
    interests: ['Gaming', 'Photography', 'Coffee'],
    joinDate: '2026-01-01',
    xp: 2500,
    level: 8,
    rank: 'Gold',
    coins: 1250,
    gems: 45,
    achievements: ['first-shift', 'perfect-week', 'team-player']
  });

  const [activeTab, setActiveTab] = useState<'feed' | 'games' | 'store' | 'achievements' | 'profile'>('feed');
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([
    {
      id: '1',
      from: 'Karen',
      to: 'Izzy',
      message: 'Amazing job handling that difficult customer situation today! You stayed calm and professional.',
      timestamp: Date.now() - 3600000,
      likes: 5,
      likedBy: ['Kenny', 'Annalissia', 'Manager']
    },
    {
      id: '2',
      from: 'Manager',
      to: 'Everyone',
      message: 'Great teamwork this week! We hit all our targets. Pizza party Friday! 🍕',
      timestamp: Date.now() - 7200000,
      likes: 12,
      likedBy: []
    }
  ]);

  const [showNewShoutout, setShowNewShoutout] = useState(false);

  const games = [
    { id: 'trivia', name: 'Team Trivia', icon: '🎯', description: 'Test your knowledge', players: 24, xp: 50 },
    { id: 'scavenger', name: 'Scavenger Hunt', icon: '🔍', description: 'Find hidden items', players: 18, xp: 100 },
    { id: 'puzzle', name: 'Daily Puzzle', icon: '🧩', description: 'Brain teaser', players: 31, xp: 25 },
    { id: 'quiz', name: 'Quick Quiz', icon: '❓', description: 'Fast questions', players: 45, xp: 30 },
    { id: 'memory', name: 'Memory Match', icon: '🎴', description: 'Match pairs', players: 15, xp: 40 },
    { id: 'word', name: 'Word Builder', icon: '📝', description: 'Build words', players: 22, xp: 35 },
  ];

  const achievements: Achievement[] = [
    { id: 'first-shift', name: 'First Shift', description: 'Complete your first shift', icon: '🎯', xp: 100, unlocked: true },
    { id: 'perfect-week', name: 'Perfect Week', description: 'No late arrivals for a week', icon: '⭐', xp: 250, unlocked: true },
    { id: 'team-player', name: 'Team Player', description: 'Help 5 colleagues', icon: '🤝', xp: 150, unlocked: true },
    { id: 'early-bird', name: 'Early Bird', description: 'Arrive early 10 times', icon: '🌅', xp: 200, unlocked: false, progress: 7, total: 10 },
    { id: 'overtime-hero', name: 'Overtime Hero', description: 'Work 5 overtime shifts', icon: '💪', xp: 300, unlocked: false, progress: 3, total: 5 },
    { id: 'shoutout-giver', name: 'Shoutout Champion', description: 'Give 20 shoutouts', icon: '📣', xp: 100, unlocked: false, progress: 14, total: 20 },
  ];

  const storeItems: StoreItem[] = [
    { id: '1', name: 'Extra Break', description: '+15 min break time', price: 500, currency: 'coins', icon: '☕', category: 'perks' },
    { id: '2', name: 'Parking Spot', description: 'Reserved parking for a week', price: 750, currency: 'coins', icon: '🚗', category: 'perks' },
    { id: '3', name: 'Casual Friday', description: 'Dress casual one Friday', price: 300, currency: 'coins', icon: '👕', category: 'perks' },
    { id: '4', name: 'Gift Card $10', description: 'Starbucks gift card', price: 1000, currency: 'coins', icon: '💳', category: 'rewards' },
    { id: '5', name: 'Gift Card $25', description: 'Amazon gift card', price: 2500, currency: 'coins', icon: '🎁', category: 'rewards' },
    { id: '6', name: 'Premium Badge', description: 'Gold nameplate', price: 20, currency: 'gems', icon: '👑', category: 'cosmetic' },
    { id: '7', name: 'Custom Avatar', description: 'Upload your own avatar', price: 15, currency: 'gems', icon: '🎨', category: 'cosmetic' },
    { id: '8', name: 'PTO Boost', description: 'Earn PTO 10% faster', price: 50, currency: 'gems', icon: '🌴', category: 'premium' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', xp: 4500, level: 12, avatar: '👩‍⚕️' },
    { rank: 2, name: 'Michael Chen', xp: 4200, level: 11, avatar: '👨‍⚕️' },
    { rank: 3, name: 'Emily Davis', xp: 3800, level: 10, avatar: '👩‍⚕️' },
    { rank: 4, name: 'James Wilson', xp: 3500, level: 10, avatar: '👨‍⚕️' },
    { rank: 5, name: 'Izzy (You)', xp: 2500, level: 8, avatar: '🎯' },
  ];

  const handleLike = (shoutoutId: string) => {
    setShoutouts(shoutouts.map(s => {
      if (s.id === shoutoutId) {
        const alreadyLiked = s.likedBy.includes(currentUser.name);
        return {
          ...s,
          likes: alreadyLiked ? s.likes - 1 : s.likes + 1,
          likedBy: alreadyLiked ? s.likedBy.filter(n => n !== currentUser.name) : [...s.likedBy, currentUser.name]
        };
      }
      return s;
    }));
  };

  const handlePurchase = (item: StoreItem) => {
    if (item.currency === 'coins' && currentUser.coins >= item.price) {
      setCurrentUser({...currentUser, coins: currentUser.coins - item.price});
      alert(`Purchased ${item.name}! Check your profile for active perks.`);
    } else if (item.currency === 'gems' && currentUser.gems >= item.price) {
      setCurrentUser({...currentUser, gems: currentUser.gems - item.price});
      alert(`Purchased ${item.name}! Check your profile for active perks.`);
    } else {
      alert(`Not enough ${item.currency}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Back to Command Center</span>
            </Link>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Rocket className="w-8 h-8 text-purple-400" />
              Basecamp
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{currentUser.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-bold">{currentUser.gems}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-white font-bold">Level {currentUser.level}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-2">
            {[
              { id: 'feed', label: 'Feed', icon: MessageCircle },
              { id: 'games', label: 'Games', icon: Gamepad2 },
              { id: 'store', label: 'Store', icon: ShoppingBag },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-purple-400'
                      : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Create Shoutout */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <button
                  onClick={() => setShowNewShoutout(!showNewShoutout)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Give a Shoutout!
                </button>
                {showNewShoutout && (
                  <div className="mt-4 space-y-3">
                    <select className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option>Select teammate...</option>
                      <option>Sarah Johnson</option>
                      <option>Michael Chen</option>
                      <option>Emily Davis</option>
                    </select>
                    <textarea
                      placeholder="Write something nice..."
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                      rows={3}
                    />
                    <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold">
                      Post Shoutout
                    </button>
                  </div>
                )}
              </div>

              {/* Shoutouts Feed */}
              {shoutouts.map((shoutout) => (
                <div key={shoutout.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                      {shoutout.from[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white">{shoutout.from}</span>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-purple-400">{shoutout.to}</span>
                      </div>
                      <p className="text-purple-100 mb-3">{shoutout.message}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => handleLike(shoutout.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            shoutout.likedBy.includes(currentUser.name) ? 'text-red-400' : 'text-purple-300 hover:text-red-400'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={shoutout.likedBy.includes(currentUser.name) ? 'currentColor' : 'none'} />
                          <span>{shoutout.likes}</span>
                        </button>
                        <span className="text-purple-300">{new Date(shoutout.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Top Players
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className={`flex items-center gap-3 p-3 rounded-lg ${player.name.includes('You') ? 'bg-purple-500/20 border border-purple-400' : 'bg-white/5'}`}>
                      <div className="text-2xl font-bold text-white w-6">{player.rank}</div>
                      <div className="text-2xl">{player.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-xs text-purple-200">Level {player.level} • {player.xp} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAMES TAB */}
        {activeTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-purple-200 mb-4">{game.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">{game.players} players</span>
                  <span className="text-green-400 font-bold">+{game.xp} XP</span>
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Play Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* STORE TAB */}
        {activeTab === 'store' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeItems.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-purple-200 mb-4 text-sm">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-bold flex items-center gap-1 ${item.currency === 'gems' ? 'text-cyan-400' : 'text-yellow-400'}`}>
                    {item.currency === 'gems' ? <Zap className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                    {item.price}
                  </span>
                  <span className="text-xs text-purple-300 bg-white/5 px-2 py-1 rounded">{item.category}</span>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all"
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`backdrop-blur-xl border-2 rounded-2xl p-6 ${achievement.unlocked ? 'bg-white/10 border-green-500/30' : 'bg-white/5 border-white/20'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{achievement.icon}</div>
                  {achievement.unlocked ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{achievement.name}</h3>
                <p className="text-purple-200 mb-4 text-sm">{achievement.description}</p>
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-purple-300 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.total}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="text-green-400 font-bold">+{achievement.xp} XP</div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl">
                    {currentUser.name[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{currentUser.name}</h2>
                    <p className="text-purple-200 mb-2">{currentUser.role}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-purple-300">
                        <Calendar className="w-4 h-4" />
                        Joined {currentUser.joinDate}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Crown className="w-4 h-4" />
                        {currentUser.rank} Tier
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Bio</h3>
                  <p className="text-purple-200">{currentUser.bio}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Interests</h3>
                  <div className="flex gap-2 flex-wrap">
                    {currentUser.interests?.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-purple-200 text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* XP Progress */}
                <div>
                  <div className="flex justify-between text-sm text-purple-200 mb-2">
                    <span>Level {currentUser.level}</span>
                    <span>Level {currentUser.level + 1}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-4 mb-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full" style={{ width: `${(currentUser.xp % 1000) / 10}%` }} />
                  </div>
                  <p className="text-xs text-purple-300">{currentUser.xp} / {Math.ceil(currentUser.xp / 1000) * 1000} XP</p>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-purple-200">Achievements</span>
                    <span className="font-bold text-white">{currentUser.achievements.length}/20</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-purple-200">Games Played</span>
                    <span className="font-bold text-white">47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-purple-200">Shoutouts Given</span>
                    <span className="font-bold text-white">14</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-purple-200">Shoutouts Received</span>
                    <span className="font-bold text-white">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
