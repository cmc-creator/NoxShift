import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Home, TrendingUp, Building, Users, Briefcase, Award, Zap, ExternalLink, Clock, BookmarkPlus } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'company' | 'industry' | 'hr' | 'tech' | 'wellness';
  source: string;
  date: Date;
  readTime: string;
  image?: string;
  trending: boolean;
}

export default function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'company' | 'industry' | 'hr'>('all');

  const articles: NewsArticle[] = [
    {
      id: '1',
      title: 'Company Announces Q1 2026 Record Performance',
      summary: 'Our team achieved unprecedented results this quarter with 127% growth in customer satisfaction and operational efficiency reaching all-time highs.',
      category: 'company',
      source: 'Internal Communications',
      date: new Date(2026, 0, 17),
      readTime: '3 min',
      trending: true
    },
    {
      id: '2',
      title: 'New Healthcare Scheduling Regulations Take Effect',
      summary: 'CMS announces updated scheduling compliance requirements for healthcare facilities. All organizations must adapt by March 2026.',
      category: 'industry',
      source: 'Healthcare Weekly',
      date: new Date(2026, 0, 16),
      readTime: '5 min',
      trending: true
    },
    {
      id: '3',
      title: 'Introducing Enhanced Benefits Package',
      summary: 'Exciting updates to our employee benefits including expanded PTO, wellness programs, and professional development opportunities.',
      category: 'company',
      source: 'HR Department',
      date: new Date(2026, 0, 15),
      readTime: '4 min',
      trending: false
    },
    {
      id: '4',
      title: 'AI-Powered Scheduling: Industry Report 2026',
      summary: 'New research shows 78% of companies adopting AI scheduling see 40% improvement in efficiency and employee satisfaction.',
      category: 'tech',
      source: 'Tech Today',
      date: new Date(2026, 0, 14),
      readTime: '6 min',
      trending: true
    },
    {
      id: '5',
      title: 'Employee Wellness Initiatives Show Strong Results',
      summary: 'Our wellness programs contributed to 32% reduction in sick days and significantly improved team morale.',
      category: 'wellness',
      source: 'Wellness Committee',
      date: new Date(2026, 0, 13),
      readTime: '3 min',
      trending: false
    },
    {
      id: '6',
      title: 'HR Tech Trends: What to Expect in 2026',
      summary: 'Predictive analytics, automated onboarding, and employee experience platforms dominate the HR technology landscape.',
      category: 'hr',
      source: 'HR Magazine',
      date: new Date(2026, 0, 12),
      readTime: '7 min',
      trending: false
    },
    {
      id: '7',
      title: 'Team Spotlight: Front Desk Excellence Award',
      summary: 'Our reception team recognized for outstanding customer service and going above and beyond for patients and visitors.',
      category: 'company',
      source: 'Employee Recognition',
      date: new Date(2026, 0, 11),
      readTime: '2 min',
      trending: false
    },
    {
      id: '8',
      title: 'Labor Laws Update: Fair Workweek Legislation',
      summary: 'New predictive scheduling laws require advance notice for shift changes. Compliance deadline: April 2026.',
      category: 'industry',
      source: 'Legal Update',
      date: new Date(2026, 0, 10),
      readTime: '5 min',
      trending: true
    },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'company': return 'purple';
      case 'industry': return 'blue';
      case 'hr': return 'green';
      case 'tech': return 'cyan';
      case 'wellness': return 'pink';
      default: return 'slate';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'company': return Building;
      case 'industry': return TrendingUp;
      case 'hr': return Users;
      case 'tech': return Zap;
      case 'wellness': return Award;
      default: return Briefcase;
    }
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
                  <Newspaper className="w-7 h-7 text-purple-400" />
                  News Feed 📰
                </h1>
                <p className="text-xs text-purple-200">Stay informed • Stay ahead</p>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'All News', icon: Newspaper },
              { id: 'company', label: 'Company', icon: Building },
              { id: 'industry', label: 'Industry', icon: TrendingUp },
              { id: 'hr', label: 'HR & People', icon: Users },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Latest Updates
            </h2>

            {filteredArticles.map((article) => {
              const color = getCategoryColor(article.category);
              const Icon = getCategoryIcon(article.category);
              
              return (
                <div key={article.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                      </div>
                      <span className={`px-2 py-1 bg-${color}-500/20 text-${color}-400 text-xs font-bold rounded`}>
                        {article.category.toUpperCase()}
                      </span>
                      {article.trending && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          TRENDING
                        </span>
                      )}
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <BookmarkPlus className="w-5 h-5 text-purple-300" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-300 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-purple-200 mb-4">{article.summary}</p>

                  <div className="flex items-center justify-between text-sm text-purple-300">
                    <div className="flex items-center gap-4">
                      <span>{article.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                      <span>{article.date.toLocaleDateString()}</span>
                    </div>
                    <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold">
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {articles.filter(a => a.trending).map((article) => (
                  <button key={article.id} className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <div className="text-white font-semibold text-sm mb-1">{article.title}</div>
                    <div className="text-xs text-purple-300">{article.source}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/calendar" className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-semibold text-sm">Team Calendar</div>
                  <div className="text-xs text-purple-300">Upcoming events</div>
                </Link>
                <Link to="/training" className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-semibold text-sm">Training Center</div>
                  <div className="text-xs text-purple-300">New courses available</div>
                </Link>
                <Link to="/basecamp" className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-semibold text-sm">Basecamp</div>
                  <div className="text-xs text-purple-300">Team hub</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
