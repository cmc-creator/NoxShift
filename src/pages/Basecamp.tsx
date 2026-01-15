import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Heart,
  ThumbsUp,
  MessageCircle,
  Gamepad2,
  Trophy,
  Award,
  Star,
  Settings,
  LogOut,
  Bell,
  Camera,
  Mail,
  Sparkles,
  Target,
  Send,
  Smile,
  Gift,
  Calendar,
  TrendingUp,
  MessageSquare,
  Zap,
  Crown,
  Rocket
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

interface BasecampUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  joinDate: string;
  xp: number;
  level: number;
  rank: string;
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

interface Suggestion {
  id: string;
  author: string;
  title: string;
  description: string;
  timestamp: number;
  votes: number;
  votedBy: string[];
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

export default function Basecamp() {
  const [currentUser, setCurrentUser] = useState<BasecampUser | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'shoutouts' | 'games' | 'suggestions' | 'profile'>('feed');
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showNewShoutout, setShowNewShoutout] = useState(false);
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Mock current user (in production this would come from auth)
  useEffect(() => {
    setCurrentUser({
      id: '1',
      name: 'Izzy',
      email: 'izzy@noxshift.com',
      role: 'Reception',
      bio: 'Passionate about great customer service and team collaboration!',
      interests: ['Gaming', 'Photography', 'Coffee'],
      joinDate: '2026-01-01',
      xp: 2500,
      level: 8,
      rank: 'Gold'
    });
    
    // Mock shoutouts
    setShoutouts([
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
        from: 'Kenny',
        to: 'Annalissia',
        message: 'Thank you for covering my shift last week! You saved the day!',
        timestamp: Date.now() - 7200000,
        likes: 3,
        likedBy: ['Izzy', 'Karen']
      }
    ]);
    
    // Mock suggestions
    setSuggestions([
      {
        id: '1',
        author: 'Izzy',
        title: 'Coffee machine for break room',
        description: 'Would love to have a coffee machine in the break room to help us stay energized during long shifts!',
        timestamp: Date.now() - 86400000,
        votes: 8,
        votedBy: ['Karen', 'Kenny', 'Annalissia'],
        status: 'pending'
      }
    ]);
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-white text-2xl font-bold">Loading Basecamp...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundColor: darkMode ? '#0a0a1a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{
        backgroundColor: darkMode ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  BASECAMP
                </h1>
                <p className="text-xs" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>
                  Employee Portal
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.name[0]}
                </div>
                <div className="text-sm">
                  <div className="font-bold">{currentUser.name}</div>
                  <div className="text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{currentUser.xp} XP</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 transition-all text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b" style={{
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {[
              { id: 'feed', label: 'Feed', icon: Sparkles },
              { id: 'shoutouts', label: 'Shoutouts', icon: Heart },
              { id: 'games', label: 'Games', icon: Gamepad2 },
              { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap"
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: isActive ? '#fff' : (darkMode ? '#94a3b8' : '#64748b')
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activity Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-black mb-4">Activity Feed</h2>
              
              {/* Recent Shoutouts in Feed */}
              {shoutouts.slice(0, 3).map(shoutout => (
                <div
                  key={shoutout.id}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      {shoutout.from[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{shoutout.from}</span>
                        <span style={{color: darkMode ? '#94a3b8' : '#64748b'}}>→</span>
                        <span className="font-bold">{shoutout.to}</span>
                        <Heart className="w-4 h-4 text-pink-500" />
                      </div>
                      <p className="mb-3" style={{color: darkMode ? '#cbd5e1' : '#475569'}}>
                        {shoutout.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{shoutout.likes}</span>
                        </button>
                        <span style={{color: darkMode ? '#64748b' : '#94a3b8'}}>
                          {new Date(shoutout.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Quick Stats & Actions */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h3 className="font-black text-lg mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Total XP</span>
                    <span className="font-bold text-xl">{currentUser.xp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Level</span>
                    <span className="font-bold text-xl">{currentUser.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Rank</span>
                    <span className="font-bold text-xl flex items-center gap-1">
                      <Crown className="w-5 h-5" />
                      {currentUser.rank}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowNewShoutout(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Send Shoutout
              </button>

              <button
                onClick={() => setShowNewSuggestion(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                New Suggestion
              </button>
            </div>
          </div>
        )}

        {activeTab === 'shoutouts' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Shoutouts</h2>
              <button
                onClick={() => setShowNewShoutout(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
              >
                <Heart className="w-4 h-4" />
                Send Shoutout
              </button>
            </div>

            <div className="space-y-4">
              {shoutouts.map(shoutout => (
                <div
                  key={shoutout.id}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      {shoutout.from[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{shoutout.from}</span>
                        <span style={{color: darkMode ? '#94a3b8' : '#64748b'}}>→</span>
                        <span className="font-bold">{shoutout.to}</span>
                        <Heart className="w-4 h-4 text-pink-500" />
                      </div>
                      <p className="mb-3" style={{color: darkMode ? '#cbd5e1' : '#475569'}}>
                        {shoutout.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{shoutout.likes}</span>
                        </button>
                        <span style={{color: darkMode ? '#64748b' : '#94a3b8'}}>
                          {new Date(shoutout.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="max-w-4xl mx-auto text-center">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-black mb-2">Games Coming Soon!</h2>
            <p style={{color: darkMode ? '#94a3b8' : '#64748b'}}>
              Team building games and challenges will be available here.
            </p>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Employee Suggestions</h2>
              <button
                onClick={() => setShowNewSuggestion(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                New Suggestion
              </button>
            </div>

            <div className="space-y-4">
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {suggestion.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{suggestion.author}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-semibold">
                          {suggestion.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{suggestion.title}</h3>
                      <p className="mb-3" style={{color: darkMode ? '#cbd5e1' : '#475569'}}>
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                          <TrendingUp className="w-4 h-4" />
                          <span>{suggestion.votes} votes</span>
                        </button>
                        <span style={{color: darkMode ? '#64748b' : '#94a3b8'}}>
                          {new Date(suggestion.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1">
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl mx-auto">
                      {currentUser.name[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-black text-xl mb-1">{currentUser.name}</h3>
                  <p className="text-sm mb-4" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>
                    {currentUser.role}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-lg">{currentUser.rank}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="md:col-span-2 space-y-6">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <h4 className="font-bold mb-3">About</h4>
                  <p style={{color: darkMode ? '#cbd5e1' : '#475569'}}>
                    {currentUser.bio}
                  </p>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <h4 className="font-bold mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests?.map(interest => (
                      <span
                        key={interest}
                        className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <h4 className="font-bold mb-3">Stats</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-black text-purple-500">{currentUser.xp}</div>
                      <div className="text-xs" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>Total XP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-pink-500">{currentUser.level}</div>
                      <div className="text-xs" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>Level</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-yellow-500">🏆</div>
                      <div className="text-xs" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>{currentUser.rank}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
