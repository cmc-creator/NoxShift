import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ChevronRight } from 'lucide-react';

export default function OrgChart() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/command-center"><Home className="w-5 h-5 text-purple-400" /></Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-black text-white flex items-center gap-2"><Users className="w-7 h-7 text-purple-400" />Organization Chart 🏢</h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-white mb-2">Interactive Org Chart</h2>
          <p className="text-purple-200 mb-6">Visual company structure with team hierarchies</p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-purple-600 text-white p-6 rounded-xl mb-4"><strong>CEO</strong><br/>Executive Leadership</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg"><strong>Operations</strong><br/>15 employees</div>
              <div className="bg-white/10 p-4 rounded-lg"><strong>HR & Admin</strong><br/>8 employees</div>
              <div className="bg-white/10 p-4 rounded-lg"><strong>Customer Service</strong><br/>22 employees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
