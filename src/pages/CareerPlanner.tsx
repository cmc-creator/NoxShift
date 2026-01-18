import React from 'react';
import { Link } from 'react-router-dom';
import { Home, TrendingUp, Award, Target, Star } from 'lucide-react';

export default function CareerPlanner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20"><div className="max-w-7xl mx-auto px-6 py-4"><div className="flex items-center gap-4"><Link to="/command-center"><Home className="w-5 h-5 text-purple-400" /></Link><div className="h-6 w-px bg-white/20" /><h1 className="text-2xl font-black text-white flex items-center gap-2"><TrendingUp className="w-7 h-7 text-purple-400" />Career Path Planner 🚀</h1></div></div></div>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {[{title:'Current Role',sub:'Reception',icon:Star,color:'purple'},{title:'Next Step',sub:'Senior Reception',icon:Target,color:'blue'},{title:'Long-term Goal',sub:'Operations Manager',icon:Award,color:'yellow'}].map(item=>{const Icon=item.icon;return(<div key={item.title} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"><Icon className={`w-12 h-12 text-${item.color}-400 mx-auto mb-3`}/><h3 className="text-xl font-bold text-white mb-1">{item.title}</h3><p className="text-purple-200">{item.sub}</p></div>);})}
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"><h2 className="text-2xl font-bold text-white mb-4">Development Path</h2><div className="space-y-4">{['Complete Leadership Training','Gain 2 years experience','Lead major project','Mentor team members'].map((step,i)=>(<div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg"><div className={`w-8 h-8 rounded-full ${i<2?'bg-green-500':'bg-white/20'} flex items-center justify-center text-white font-bold`}>{i+1}</div><span className="text-white">{step}</span></div>))}</div></div>
      </div>
    </div>
  );
}
