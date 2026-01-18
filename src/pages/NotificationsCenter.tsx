import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, Home, Filter, CheckCheck, Trash2, Settings, Calendar, Users, 
  Clock, AlertCircle, Gift, Trophy, Heart, MessageCircle, TrendingUp,
  Zap, Star, Award, PartyPopper, Coffee, Cake
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'schedule' | 'social' | 'achievement' | 'system' | 'timeoff' | 'swap' | 'birthday' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  icon: any;
  color: string;
}

export default function NotificationsCenter() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'schedule' | 'social'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Schedule Change',
      message: 'Your shift on Monday has been changed to 9:00 AM - 5:00 PM',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      priority: 'high',
      actionUrl: '/scheduler',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: '2',
      type: 'swap',
      title: 'Shift Swap Approved',
      message: 'Your shift swap with Sarah Johnson has been approved!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      priority: 'high',
      actionUrl: '/scheduler',
      icon: CheckCheck,
      color: 'green'
    },
    {
      id: '3',
      type: 'birthday',
      title: "It's Sarah's Birthday! 🎂",
      message: "Don't forget to wish Sarah a happy birthday today!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      priority: 'medium',
      actionUrl: '/basecamp',
      icon: Cake,
      color: 'pink'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You earned "Perfect Week" - Completed all scheduled shifts!',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      priority: 'medium',
      actionUrl: '/basecamp',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: '5',
      type: 'social',
      title: 'New Comment on Your Post',
      message: 'Karen commented: "Great job on the presentation!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: true,
      priority: 'low',
      actionUrl: '/basecamp',
      icon: MessageCircle,
      color: 'blue'
    },
    {
      id: '6',
      type: 'timeoff',
      title: 'PTO Request Approved',
      message: 'Your time-off request for Jan 25-27 has been approved.',
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      read: true,
      priority: 'high',
      actionUrl: '/time-off',
      icon: Calendar,
      color: 'green'
    },
    {
      id: '7',
      type: 'social',
      title: '8 Likes on Your Post',
      message: 'Your post about the team lunch is trending!',
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      read: true,
      priority: 'low',
      actionUrl: '/basecamp',
      icon: Heart,
      color: 'pink'
    },
    {
      id: '8',
      type: 'achievement',
      title: 'Level Up!',
      message: "You've reached Level 9! Keep up the great work!",
      timestamp: new Date(Date.now() - 1000 * 60 * 400),
      read: true,
      priority: 'medium',
      actionUrl: '/basecamp',
      icon: Star,
      color: 'purple'
    },
    {
      id: '9',
      type: 'schedule',
      title: 'New Schedule Posted',
      message: 'Your schedule for next week is now available',
      timestamp: new Date(Date.now() - 1000 * 60 * 500),
      read: true,
      priority: 'medium',
      actionUrl: '/scheduler',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: '10',
      type: 'system',
      title: 'Training Reminder',
      message: 'Complete your HIPAA training by January 31st',
      timestamp: new Date(Date.now() - 1000 * 60 * 600),
      read: true,
      priority: 'high',
      actionUrl: '/training',
      icon: Clock,
      color: 'orange'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'schedule') return ['schedule', 'swap', 'timeoff', 'alert'].includes(n.type);
    if (filter === 'social') return ['social', 'birthday', 'achievement'].includes(n.type);
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

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
                  <Bell className="w-7 h-7 text-purple-400" />
                  Notifications
                </h1>
                <p className="text-xs text-purple-200">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'All', icon: Bell },
              { id: 'unread', label: 'Unread', icon: AlertCircle },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'social', label: 'Social', icon: Users },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    filter === f.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{f.label}</span>
                  {f.id === 'unread' && unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
            <p className="text-purple-200">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white/10 backdrop-blur-xl border rounded-2xl p-5 transition-all hover:scale-[1.02] ${
                    notification.read
                      ? 'border-white/10'
                      : 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 bg-${notification.color}-500/20 rounded-xl flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${notification.color}-400`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-bold ${notification.read ? 'text-white' : 'text-white'}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-purple-300 ml-2 flex-shrink-0">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm mb-3">{notification.message}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-semibold transition-colors"
                          >
                            View
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-semibold transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
