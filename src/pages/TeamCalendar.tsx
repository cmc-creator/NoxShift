import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Home, Plus, Users, Cake, PartyPopper, 
  Briefcase, Heart, Trophy, Coffee, Gift, Star, ChevronLeft, ChevronRight,
  Clock, MapPin, Bell, Filter
} from 'lucide-react';

interface TeamEvent {
  id: string;
  title: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'meeting' | 'social' | 'training' | 'milestone';
  date: Date;
  time?: string;
  location?: string;
  attendees?: string[];
  description?: string;
  icon: any;
  color: string;
}

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 18)); // January 18, 2026
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'list'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'birthdays' | 'anniversaries' | 'events'>('all');

  const events: TeamEvent[] = [
    {
      id: '1',
      title: "Sarah's Birthday 🎂",
      type: 'birthday',
      date: new Date(2026, 0, 19),
      time: '12:00 PM',
      location: 'Break Room',
      description: 'Celebrating Sarah J. turning another year wiser!',
      icon: Cake,
      color: 'pink'
    },
    {
      id: '2',
      title: 'Team Building Event',
      type: 'social',
      date: new Date(2026, 0, 23),
      time: '2:00 PM - 5:00 PM',
      location: 'Bowling Alley',
      attendees: ['All Staff'],
      description: 'Fun team building afternoon with games and prizes!',
      icon: PartyPopper,
      color: 'purple'
    },
    {
      id: '3',
      title: "Michael's 5 Year Anniversary",
      type: 'anniversary',
      date: new Date(2026, 0, 25),
      description: 'Celebrating 5 amazing years with the company!',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: '4',
      title: 'HIPAA Training',
      type: 'training',
      date: new Date(2026, 0, 27),
      time: '9:00 AM - 11:00 AM',
      location: 'Conference Room A',
      attendees: ['All Staff'],
      icon: Briefcase,
      color: 'blue'
    },
    {
      id: '5',
      title: 'Monthly All-Hands Meeting',
      type: 'meeting',
      date: new Date(2026, 0, 30),
      time: '10:00 AM - 11:00 AM',
      location: 'Main Hall',
      attendees: ['All Staff'],
      icon: Users,
      color: 'indigo'
    },
    {
      id: '6',
      title: 'Coffee Chat Friday',
      type: 'social',
      date: new Date(2026, 0, 31),
      time: '3:00 PM',
      location: 'Cafe',
      description: 'Casual coffee and conversation',
      icon: Coffee,
      color: 'orange'
    },
    {
      id: '7',
      title: "Emily's Birthday",
      type: 'birthday',
      date: new Date(2026, 1, 3),
      icon: Cake,
      color: 'pink'
    },
    {
      id: '8',
      title: 'Q1 Performance Reviews',
      type: 'milestone',
      date: new Date(2026, 1, 10),
      time: 'All Week',
      icon: Star,
      color: 'green'
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => {
      if (selectedFilter === 'birthdays' && event.type !== 'birthday') return false;
      if (selectedFilter === 'anniversaries' && event.type !== 'anniversary') return false;
      if (selectedFilter === 'events' && !['social', 'meeting', 'training', 'milestone'].includes(event.type)) return false;
      
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = getDaysInMonth(currentDate);

  const upcomingEvents = events
    .filter(e => {
      if (selectedFilter === 'birthdays' && e.type !== 'birthday') return false;
      if (selectedFilter === 'anniversaries' && e.type !== 'anniversary') return false;
      if (selectedFilter === 'events' && !['social', 'meeting', 'training', 'milestone'].includes(e.type)) return false;
      return e.date >= new Date();
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

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
                  <CalendarIcon className="w-7 h-7 text-purple-400" />
                  Team Calendar
                </h1>
                <p className="text-xs text-purple-200">Birthdays • Anniversaries • Events</p>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'All Events', icon: CalendarIcon },
              { id: 'birthdays', label: 'Birthdays', icon: Cake },
              { id: 'anniversaries', label: 'Anniversaries', icon: Trophy },
              { id: 'events', label: 'Team Events', icon: PartyPopper },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedFilter === f.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-purple-300 font-bold text-sm p-2">
                    {day}
                  </div>
                ))}
                {days.map((date, idx) => {
                  const dayEvents = getEventsForDate(date);
                  return (
                    <div
                      key={idx}
                      className={`min-h-24 p-2 rounded-lg transition-all ${
                        date
                          ? isToday(date)
                            ? 'bg-purple-600 border-2 border-purple-400'
                            : dayEvents.length > 0
                            ? 'bg-white/10 hover:bg-white/20 cursor-pointer'
                            : 'bg-white/5 hover:bg-white/10 cursor-pointer'
                          : ''
                      }`}
                    >
                      {date && (
                        <>
                          <div className={`text-sm font-bold mb-1 ${isToday(date) ? 'text-white' : 'text-purple-200'}`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => {
                              const Icon = event.icon;
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded bg-${event.color}-500/20 text-${event.color}-300 flex items-center gap-1 truncate`}
                                >
                                  <Icon className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{event.title}</span>
                                </div>
                              );
                            })}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-purple-300 pl-1">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const Icon = event.icon;
                  return (
                    <div key={event.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-${event.color}-500/20 rounded-lg`}>
                          <Icon className={`w-5 h-5 text-${event.color}-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white mb-1">{event.title}</h4>
                          <p className="text-sm text-purple-200 mb-1">
                            {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {event.time && ` • ${event.time}`}
                          </p>
                          {event.location && (
                            <p className="text-xs text-purple-300 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-pink-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Cake className="w-5 h-5 text-pink-400" />
                    <span className="text-white font-semibold">Birthdays</span>
                  </div>
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">Anniversaries</span>
                  </div>
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <PartyPopper className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Events</span>
                  </div>
                  <span className="text-2xl font-bold text-white">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
