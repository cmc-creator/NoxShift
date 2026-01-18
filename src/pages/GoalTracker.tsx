import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Home, Plus, TrendingUp, CheckCircle, Clock, Star, Award, Zap, Calendar, Users, Trash2, Edit2, Flag } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'team' | 'company';
  category: 'career' | 'learning' | 'performance' | 'wellness' | 'social';
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  owner: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

export default function GoalTracker() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'personal' | 'team' | 'company'>('all');
  const [showNewGoal, setShowNewGoal] = useState(false);

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Complete 5 Training Courses',
      description: 'Enhance professional skills through online learning',
      type: 'personal',
      category: 'learning',
      progress: 3,
      target: 5,
      unit: 'courses',
      deadline: new Date(2026, 2, 31),
      status: 'active',
      owner: 'You',
      milestones: [
        { id: '1', title: 'HIPAA Compliance', completed: true, dueDate: new Date(2026, 0, 15) },
        { id: '2', title: 'Leadership Skills', completed: true, dueDate: new Date(2026, 0, 25) },
        { id: '3', title: 'Customer Service', completed: true, dueDate: new Date(2026, 1, 5) },
        { id: '4', title: 'Time Management', completed: false, dueDate: new Date(2026, 1, 20) },
        { id: '5', title: 'Conflict Resolution', completed: false, dueDate: new Date(2026, 2, 15) },
      ]
    },
    {
      id: '2',
      title: 'Get Promoted to Senior Position',
      description: 'Work towards promotion through excellent performance',
      type: 'personal',
      category: 'career',
      progress: 6,
      target: 10,
      unit: 'months',
      deadline: new Date(2026, 9, 30),
      status: 'active',
      owner: 'You',
      milestones: [
        { id: '1', title: 'Exceed performance metrics', completed: true, dueDate: new Date(2026, 2, 31) },
        { id: '2', title: 'Complete leadership training', completed: true, dueDate: new Date(2026, 4, 30) },
        { id: '3', title: 'Lead 2 major projects', completed: false, dueDate: new Date(2026, 6, 30) },
        { id: '4', title: 'Mentor 3 team members', completed: false, dueDate: new Date(2026, 8, 30) },
      ]
    },
    {
      id: '3',
      title: 'Team Efficiency: 95% Target',
      description: 'Improve team productivity and workflow efficiency',
      type: 'team',
      category: 'performance',
      progress: 88,
      target: 95,
      unit: '%',
      deadline: new Date(2026, 5, 30),
      status: 'active',
      owner: 'Team',
      milestones: [
        { id: '1', title: 'Implement new scheduling system', completed: true, dueDate: new Date(2026, 0, 31) },
        { id: '2', title: 'Reduce response time by 20%', completed: true, dueDate: new Date(2026, 2, 31) },
        { id: '3', title: 'Achieve 90% satisfaction rate', completed: false, dueDate: new Date(2026, 4, 31) },
      ]
    },
    {
      id: '4',
      title: 'Wellness Challenge: 10,000 Steps Daily',
      description: 'Maintain healthy habits with daily step goal',
      type: 'personal',
      category: 'wellness',
      progress: 18,
      target: 90,
      unit: 'days',
      deadline: new Date(2026, 3, 18),
      status: 'active',
      owner: 'You',
      milestones: [
        { id: '1', title: 'Week 1 Complete', completed: true, dueDate: new Date(2026, 0, 25) },
        { id: '2', title: 'Week 2 Complete', completed: true, dueDate: new Date(2026, 1, 1) },
        { id: '3', title: 'Month 1 Complete', completed: false, dueDate: new Date(2026, 1, 18) },
      ]
    },
    {
      id: '5',
      title: 'Company-Wide: Reduce Turnover to <5%',
      description: 'Improve employee retention through better engagement',
      type: 'company',
      category: 'performance',
      progress: 8.2,
      target: 5,
      unit: '%',
      deadline: new Date(2026, 11, 31),
      status: 'active',
      owner: 'HR Team',
      milestones: [
        { id: '1', title: 'Launch engagement surveys', completed: true, dueDate: new Date(2026, 1, 28) },
        { id: '2', title: 'Implement retention bonuses', completed: false, dueDate: new Date(2026, 5, 30) },
        { id: '3', title: 'Expand benefits package', completed: false, dueDate: new Date(2026, 8, 30) },
      ]
    },
  ];

  const filteredGoals = activeFilter === 'all' ? goals : goals.filter(g => g.type === activeFilter);

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'yellow';
    return 'orange';
  };

  const getDaysRemaining = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
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
                  <Target className="w-7 h-7 text-purple-400" />
                  Goal Tracker 🎯
                </h1>
                <p className="text-xs text-purple-200">Track progress • Achieve greatness</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewGoal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'All Goals', emoji: '🎯' },
              { id: 'personal', label: 'Personal', emoji: '👤' },
              { id: 'team', label: 'Team', emoji: '👥' },
              { id: 'company', label: 'Company', emoji: '🏢' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                <span>{filter.emoji}</span>
                <span className="font-semibold text-sm">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <Target className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{goals.length}</div>
            <div className="text-purple-200 text-sm">Active Goals</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {goals.filter(g => g.status === 'completed').length}
            </div>
            <div className="text-purple-200 text-sm">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(goals.reduce((acc, g) => acc + (g.progress / g.target * 100), 0) / goals.length)}%
            </div>
            <div className="text-purple-200 text-sm">Avg Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <Star className="w-8 h-8 text-yellow-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {goals.reduce((acc, g) => acc + g.milestones.filter(m => m.completed).length, 0)}
            </div>
            <div className="text-purple-200 text-sm">Milestones Hit</div>
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const progressPercentage = (goal.progress / goal.target) * 100;
            const color = getProgressColor(goal.progress, goal.target);
            const daysLeft = getDaysRemaining(goal.deadline);
            
            return (
              <div key={goal.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-[1.02] transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 bg-${color}-500/20 text-${color}-400 text-xs font-bold rounded`}>
                        {goal.type.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded">
                        {goal.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                    <p className="text-purple-200 text-sm">{goal.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-purple-300" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-300">Progress</span>
                    <span className="text-sm font-bold text-white">
                      {goal.progress} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r from-${color}-600 to-${color}-400 h-3 rounded-full transition-all flex items-center justify-end pr-2`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    >
                      {progressPercentage >= 20 && (
                        <span className="text-xs font-bold text-white">{Math.round(progressPercentage)}%</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-purple-400" />
                    Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                  </h4>
                  <div className="space-y-2">
                    {goal.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className={`w-4 h-4 ${milestone.completed ? 'text-green-400' : 'text-slate-600'}`} />
                        <span className={`text-sm flex-1 ${milestone.completed ? 'text-white line-through' : 'text-purple-200'}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {goal.milestones.length > 3 && (
                      <button className="text-xs text-purple-400 hover:text-purple-300 ml-7">
                        +{goal.milestones.length - 3} more milestones
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <Users className="w-4 h-4" />
                    <span>{goal.owner}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
