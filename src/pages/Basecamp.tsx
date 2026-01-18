import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Users, Heart, MessageCircle, Gamepad2, Trophy, Award, Star, Calendar, Zap, Crown, Rocket, 
  Coins, ShoppingBag, Home, ChevronRight, Play, Lock, CheckCircle, Plus, Send, Search, Bell, 
  Settings, LogOut, Camera, Mail, Gift, Target, TrendingUp, BookOpen, Video, Music, Coffee, 
  Pizza, Cake, PartyPopper, Smile, ThumbsUp, Clock, Map, Compass, Brain, Lightbulb, FileText,
  BarChart, PieChart, Book, GraduationCap, Briefcase, Shield, Flame, Wind, Droplets, Sunrise,
  Moon, CloudRain, CloudSnow, Sparkles, Headphones, Mic, Film, Image, Palette, Code, Terminal,
  Database, Server, Cpu, HardDrive, Wifi, Bluetooth, Radio, Tv, Smartphone, Tablet, Watch,
  Globe, MapPin, Navigation, Plane, Train, Car, Bike, Ship, Anchor, Flag, Mountain, TreePine
} from 'lucide-react';

interface BasecampUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];
  goals?: string[];
  joinDate: string;
  birthday?: string;
  xp: number;
  level: number;
  rank: string;
  coins: number;
  gems: number;
  achievements: string[];
  badges: string[];
  friends: string[];
  teams: string[];
}

export default function Basecamp() {
  const [currentUser, setCurrentUser] = useState<BasecampUser>({
    id: '1',
    name: 'Izzy Cooper',
    email: 'izzy@noxshift.com',
    role: 'Reception',
    bio: '🌟 Passionate about great customer service and team collaboration! Coffee enthusiast ☕',
    interests: ['Gaming 🎮', 'Photography 📸', 'Coffee ☕', 'Travel ✈️', 'Music 🎵'],
    skills: ['Customer Service', 'Communication', 'Problem Solving', 'Time Management'],
    goals: ['Learn Spanish', 'Get promoted', 'Travel to Japan'],
    joinDate: '2026-01-01',
    birthday: '03-15',
    xp: 2500,
    level: 8,
    rank: 'Gold',
    coins: 1250,
    gems: 45,
    achievements: ['first-shift', 'perfect-week', 'team-player', 'helpful-hero', 'early-bird'],
    badges: ['🏆 Top Performer', '⭐ 5-Star Service', '🎯 Goal Getter', '💪 Team Player'],
    friends: ['Sarah J.', 'Michael C.', 'Emily D.', 'James W.', 'Karen M.'],
    teams: ['Front Desk Dream Team', 'Coffee Club', 'Game Night Crew']
  });

  const [activeTab, setActiveTab] = useState<'home' | 'social' | 'games' | 'learning' | 'wellness' | 'organize' | 'kronos'>('home');

  // Expanded games library
  const gamesLibrary = [
    // Trivia & Knowledge
    { id: 'trivia', name: 'Team Trivia', icon: '🎯', category: 'Trivia', description: 'Test your knowledge', players: 24, xp: 50, difficulty: 'Medium' },
    { id: 'quiz', name: 'Quick Quiz', icon: '❓', category: 'Trivia', description: 'Fast questions', players: 45, xp: 30, difficulty: 'Easy' },
    { id: 'brain-teaser', name: 'Brain Teasers', icon: '🧠', category: 'Trivia', description: 'Mind-bending puzzles', players: 18, xp: 75, difficulty: 'Hard' },
    { id: 'fact-check', name: 'Fact or Fiction', icon: '📚', category: 'Trivia', description: 'True or false', players: 32, xp: 40, difficulty: 'Easy' },
    
    // Word Games
    { id: 'word', name: 'Word Builder', icon: '📝', category: 'Word', description: 'Build words', players: 22, xp: 35, difficulty: 'Medium' },
    { id: 'hangman', name: 'Hangman', icon: '🎪', category: 'Word', description: 'Guess the word', players: 28, xp: 30, difficulty: 'Easy' },
    { id: 'crossword', name: 'Crossword', icon: '📄', category: 'Word', description: 'Daily crossword', players: 15, xp: 60, difficulty: 'Hard' },
    { id: 'anagram', name: 'Anagram Challenge', icon: '🔤', category: 'Word', description: 'Unscramble words', players: 20, xp: 45, difficulty: 'Medium' },
    
    // Puzzle Games
    { id: 'puzzle', name: 'Daily Puzzle', icon: '🧩', category: 'Puzzle', description: 'Brain teaser', players: 31, xp: 25, difficulty: 'Easy' },
    { id: 'memory', name: 'Memory Match', icon: '🎴', category: 'Puzzle', description: 'Match pairs', players: 15, xp: 40, difficulty: 'Medium' },
    { id: 'sudoku', name: 'Sudoku', icon: '🔢', category: 'Puzzle', description: 'Number puzzle', players: 12, xp: 70, difficulty: 'Hard' },
    { id: 'maze', name: 'Maze Runner', icon: '🌀', category: 'Puzzle', description: 'Find the exit', players: 25, xp: 50, difficulty: 'Medium' },
    
    // Team Games
    { id: 'scavenger', name: 'Scavenger Hunt', icon: '🔍', category: 'Team', description: 'Find hidden items', players: 18, xp: 100, difficulty: 'Medium' },
    { id: 'team-challenge', name: 'Team Challenge', icon: '🤝', category: 'Team', description: 'Compete together', players: 40, xp: 120, difficulty: 'Medium' },
    { id: 'relay-race', name: 'Relay Race', icon: '🏃', category: 'Team', description: 'Speed challenge', players: 24, xp: 80, difficulty: 'Hard' },
    { id: 'treasure-hunt', name: 'Treasure Hunt', icon: '💎', category: 'Team', description: 'Find the treasure', players: 30, xp: 150, difficulty: 'Hard' },
    
    // Creative Games
    { id: 'draw-guess', name: 'Draw & Guess', icon: '🎨', category: 'Creative', description: 'Pictionary style', players: 22, xp: 60, difficulty: 'Easy' },
    { id: 'story-builder', name: 'Story Builder', icon: '📖', category: 'Creative', description: 'Create stories', players: 16, xp: 55, difficulty: 'Medium' },
    { id: 'emoji-decode', name: 'Emoji Decoder', icon: '😄', category: 'Creative', description: 'Guess from emojis', players: 35, xp: 35, difficulty: 'Easy' },
    { id: 'caption-this', name: 'Caption This', icon: '💬', category: 'Creative', description: 'Best caption wins', players: 28, xp: 40, difficulty: 'Easy' },
    
    // Strategy Games
    { id: 'chess', name: 'Chess', icon: '♟️', category: 'Strategy', description: 'Classic strategy', players: 8, xp: 100, difficulty: 'Hard' },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', category: 'Strategy', description: 'Quick match', players: 20, xp: 20, difficulty: 'Easy' },
    { id: 'connect-four', name: 'Connect Four', icon: '🔴', category: 'Strategy', description: 'Connect to win', players: 15, xp: 35, difficulty: 'Medium' },
    { id: 'tower-defense', name: 'Tower Defense', icon: '🏰', category: 'Strategy', description: 'Defend your base', players: 18, xp: 90, difficulty: 'Hard' },
  ];

  // Learning modules
  const learningModules = [
    { id: 'customer-service', name: 'Customer Service Excellence', icon: '🌟', duration: '30 min', level: 'Beginner', progress: 75, completed: false },
    { id: 'leadership', name: 'Leadership Skills', icon: '👑', duration: '45 min', level: 'Intermediate', progress: 40, completed: false },
    { id: 'communication', name: 'Effective Communication', icon: '💬', duration: '25 min', level: 'Beginner', progress: 100, completed: true },
    { id: 'time-management', name: 'Time Management Mastery', icon: '⏰', duration: '35 min', level: 'Intermediate', progress: 60, completed: false },
    { id: 'conflict-resolution', name: 'Conflict Resolution', icon: '🤝', duration: '40 min', level: 'Advanced', progress: 20, completed: false },
    { id: 'sales-techniques', name: 'Sales Techniques', icon: '💰', duration: '50 min', level: 'Intermediate', progress: 0, completed: false },
    { id: 'tech-skills', name: 'Tech Skills Bootcamp', icon: '💻', duration: '60 min', level: 'Beginner', progress: 85, completed: false },
    { id: 'stress-management', name: 'Stress Management', icon: '🧘', duration: '30 min', level: 'Beginner', progress: 100, completed: true },
  ];

  // Wellness activities
  const wellnessActivities = [
    { id: 'meditation', name: '5-Min Meditation', icon: '🧘', category: 'Mental', duration: '5 min', calories: 10 },
    { id: 'breathing', name: 'Breathing Exercise', icon: '💨', category: 'Mental', duration: '3 min', calories: 5 },
    { id: 'desk-yoga', name: 'Desk Yoga', icon: '🤸', category: 'Physical', duration: '10 min', calories: 30 },
    { id: 'walk', name: 'Quick Walk', icon: '🚶', category: 'Physical', duration: '15 min', calories: 50 },
    { id: 'stretching', name: 'Stretching Routine', icon: '💪', category: 'Physical', duration: '8 min', calories: 25 },
    { id: 'gratitude', name: 'Gratitude Journal', icon: '📝', category: 'Mental', duration: '5 min', calories: 0 },
    { id: 'hydration', name: 'Water Break', icon: '💧', category: 'Nutrition', duration: '1 min', calories: 0 },
    { id: 'healthy-snack', name: 'Healthy Snack Ideas', icon: '🥗', category: 'Nutrition', duration: '5 min', calories: 100 },
  ];

  // Organizational tools
  const organizationTools = [
    { id: 'calendar', name: 'My Calendar', icon: Calendar, description: 'View your schedule', notifications: 3 },
    { id: 'tasks', name: 'Task Manager', icon: CheckCircle, description: 'Track your to-dos', notifications: 5 },
    { id: 'notes', name: 'Quick Notes', icon: FileText, description: 'Jot down ideas', notifications: 0 },
    { id: 'goals', name: 'Goal Tracker', icon: Target, description: 'Track your progress', notifications: 2 },
    { id: 'contacts', name: 'Contacts', icon: Users, description: 'Team directory', notifications: 0 },
    { id: 'documents', name: 'My Documents', icon: BookOpen, description: 'Files & resources', notifications: 1 },
    { id: 'messages', name: 'Messages', icon: Mail, description: 'Team chat', notifications: 8 },
    { id: 'announcements', name: 'Announcements', icon: Bell, description: 'Company news', notifications: 2 },
  ];

  // Kronos features
  const kronosFeatures = [
    { id: 'clock-in', name: 'Clock In/Out', icon: Clock, description: 'Time tracking', status: 'Active' },
    { id: 'schedule', name: 'My Schedule', icon: Calendar, description: 'View shifts', status: 'Upcoming' },
    { id: 'timeoff', name: 'Time Off', icon: Plane, description: 'Request PTO', status: 'Available' },
    { id: 'swap', name: 'Shift Swap', icon: Zap, description: 'Trade shifts', status: 'Active' },
    { id: 'availability', name: 'Availability', icon: CheckCircle, description: 'Set availability', status: 'Updated' },
    { id: 'payroll', name: 'Payroll Info', icon: Coins, description: 'View earnings', status: 'Ready' },
  ];

  const [gameCategory, setGameCategory] = useState('All');
  const gameCategories = ['All', 'Trivia', 'Word', 'Puzzle', 'Team', 'Creative', 'Strategy'];

  const filteredGames = gameCategory === 'All' 
    ? gamesLibrary 
    : gamesLibrary.filter(g => g.category === gameCategory);

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
                  <Rocket className="w-7 h-7 text-purple-400" />
                  Basecamp 🏠
                </h1>
                <p className="text-xs text-purple-200">Your Personal Employee Hub</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold text-sm">{currentUser.coins}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold text-sm">{currentUser.gems}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-white font-bold text-sm">Level {currentUser.level}</span>
              </div>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'social', label: 'Social Hub', icon: Users },
              { id: 'games', label: 'Games Arena', icon: Gamepad2 },
              { id: 'learning', label: 'Learning Center', icon: GraduationCap },
              { id: 'wellness', label: 'Wellness', icon: Heart },
              { id: 'organize', label: 'Organize', icon: Briefcase },
              { id: 'kronos', label: 'Kronos Time', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-purple-400'
                      : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-black mb-2">Welcome back, {currentUser.name}! 👋</h2>
                <p className="text-purple-100 mb-4">You're on fire today! Keep up the amazing work! 🔥</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{currentUser.achievements.length}</div>
                    <div className="text-sm text-purple-100">Achievements</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{currentUser.friends.length}</div>
                    <div className="text-sm text-purple-100">Friends</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{currentUser.teams.length}</div>
                    <div className="text-sm text-purple-100">Teams</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <span className="text-white text-sm font-semibold">Clock In</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all">
                    <Calendar className="w-6 h-6 text-green-400" />
                    <span className="text-white text-sm font-semibold">My Schedule</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                    <span className="text-white text-sm font-semibold">Play Games</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg transition-all">
                    <Users className="w-6 h-6 text-pink-400" />
                    <span className="text-white text-sm font-semibold">Team Chat</span>
                  </button>
                </div>
              </div>

              {/* Today's Highlights */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">✨ Today's Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">New Achievement Unlocked!</p>
                      <p className="text-purple-200 text-sm">You earned "Perfect Week" badge 🎉</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Gift className="w-5 h-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">Birthday Alert!</p>
                      <p className="text-purple-200 text-sm">Sarah's birthday is tomorrow 🎂</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Star className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">New Learning Module</p>
                      <p className="text-purple-200 text-sm">Leadership Skills course now available 📚</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                    <p className="text-purple-200 text-sm">{currentUser.role}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{currentUser.rank} Tier</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-purple-200">Joined {currentUser.joinDate}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-purple-200 mb-1">
                    <span>Level {currentUser.level}</span>
                    <span>Level {currentUser.level + 1}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: `${(currentUser.xp % 1000) / 10}%` }} />
                  </div>
                  <p className="text-xs text-purple-300 mt-1">{currentUser.xp} / {Math.ceil(currentUser.xp / 1000) * 1000} XP</p>
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-all">
                  View Full Profile
                </button>
              </div>

              {/* Friends Online */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">👥 Friends Online</h3>
                <div className="space-y-2">
                  {currentUser.friends.slice(0, 5).map((friend, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-sm text-white font-bold relative">
                        {friend[0]}
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-slate-900"></div>
                      </div>
                      <span className="text-white text-sm font-semibold">{friend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Teams */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">🏆 My Teams</h3>
                <div className="space-y-2">
                  {currentUser.teams.map((team, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm">{team}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL HUB TAB */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl text-white font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <textarea 
                      placeholder="Share something with your team..."
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none mb-3"
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Image className="w-5 h-5 text-purple-400" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Smile className="w-5 h-5 text-yellow-400" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Gift className="w-5 h-5 text-pink-400" />
                        </button>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-all">
                        <Send className="w-4 h-4 inline mr-2" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Feed */}
              <div className="space-y-4">
                {[
                  { user: 'Karen M.', time: '2h ago', content: 'Great team meeting today! Love working with you all! 💪', likes: 8, comments: 3 },
                  { user: 'Michael C.', time: '4h ago', content: 'Just finished the Leadership Skills course - highly recommend! 📚', likes: 12, comments: 5 },
                  { user: 'Emily D.', time: '6h ago', content: 'Coffee break anyone? ☕', likes: 6, comments: 8 },
                ].map((post, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl text-white font-bold">
                        {post.user[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-white">{post.user}</p>
                            <p className="text-xs text-purple-300">{post.time}</p>
                          </div>
                        </div>
                        <p className="text-purple-100 mb-4">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-purple-300 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-purple-300 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-purple-300 hover:text-green-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Birthdays */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">🎂 Upcoming Birthdays</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                    <Cake className="w-6 h-6 text-pink-400" />
                    <div>
                      <p className="text-white font-semibold">Sarah J.</p>
                      <p className="text-purple-200 text-xs">Tomorrow!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Cake className="w-6 h-6 text-pink-400" />
                    <div>
                      <p className="text-white font-semibold">James W.</p>
                      <p className="text-purple-200 text-xs">In 3 days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shoutouts */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">⭐ Recent Shoutouts</h3>
                <button className="w-full py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white font-semibold mb-4 hover:scale-105 transition-all">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Give Shoutout
                </button>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-purple-200 text-sm mb-1"><strong className="text-white">Manager</strong> → <strong className="text-purple-400">Team</strong></p>
                    <p className="text-white text-xs">"Amazing work this week! 🎉"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAMES ARENA TAB */}
        {activeTab === 'games' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">🎮 Games Arena</h2>
                <p className="text-purple-200">24 games to play • Earn XP • Challenge friends</p>
              </div>
              <div className="flex gap-2">
                {gameCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGameCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      gameCategory === cat
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <div key={game.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-purple-200 text-sm mb-3">{game.description}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-1 bg-white/10 rounded text-purple-200">{game.category}</span>
                    <span className="px-2 py-1 bg-white/10 rounded text-purple-200">{game.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-purple-300">{game.players} players</span>
                    <span className="text-green-400 font-bold">+{game.xp} XP</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Play Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEARNING CENTER TAB */}
        {activeTab === 'learning' && (
          <div>
            <h2 className="text-3xl font-black text-white mb-6">📚 Learning Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningModules.map((module) => (
                <div key={module.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{module.icon}</div>
                    {module.completed && (
                      <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-purple-200 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded">{module.level}</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-purple-200 mb-1">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all">
                    {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start Learning'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WELLNESS TAB */}
        {activeTab === 'wellness' && (
          <div>
            <h2 className="text-3xl font-black text-white mb-6">💚 Wellness Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wellnessActivities.map((activity) => (
                <div key={activity.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">{activity.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{activity.name}</h3>
                  <div className="space-y-1 text-sm text-purple-200 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/10 rounded">{activity.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{activity.duration}</span>
                    </div>
                    {activity.calories > 0 && (
                      <div className="flex items-center gap-2">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>{activity.calories} cal</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold hover:scale-105 transition-all">
                    Start Activity
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORGANIZE TAB */}
        {activeTab === 'organize' && (
          <div>
            <h2 className="text-3xl font-black text-white mb-6">📋 Organization Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {organizationTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer relative">
                    {tool.notifications > 0 && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {tool.notifications}
                      </div>
                    )}
                    <Icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                    <p className="text-purple-200 text-sm">{tool.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KRONOS TIME TAB */}
        {activeTab === 'kronos' && (
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-6">
              <h2 className="text-3xl font-black mb-2">⏰ Kronos Time Management</h2>
              <p className="text-blue-100">Your complete time tracking and scheduling solution</p>
            </div>
            
            {/* Clock In/Out Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-6 text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Clock In?</h3>
              <p className="text-purple-200 mb-6">Current time: {new Date().toLocaleTimeString()}</p>
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-bold text-xl hover:scale-105 transition-all shadow-lg">
                <Clock className="w-6 h-6 inline mr-2" />
                Clock In Now
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kronosFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                    <Icon className="w-12 h-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                    <p className="text-purple-200 text-sm mb-3">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-xs font-bold">
                        {feature.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
