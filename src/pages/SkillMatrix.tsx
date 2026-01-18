import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Award, CheckCircle } from 'lucide-react';

export default function SkillMatrix() {
  const skills=[{name:'Customer Service',level:5,employees:22},{name:'Leadership',level:3,employees:8},{name:'Technical',level:4,employees:15},{name:'Communication',level:5,employees:20}];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"><div className="bg-white/10 backdrop-blur-xl border-b border-white/20"><div className="max-w-7xl mx-auto px-6 py-4"><div className="flex items-center gap-4"><Link to="/command-center"><Home className="w-5 h-5 text-purple-400" /></Link><div className="h-6 w-px bg-white/20" /><h1 className="text-2xl font-black text-white flex items-center gap-2"><Award className="w-7 h-7 text-purple-400" />Skills Matrix 🎯</h1></div></div></div><div className="max-w-7xl mx-auto p-6"><div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"><h2 className="text-2xl font-bold text-white mb-6">Team Skills Overview</h2><div className="grid grid-cols-2 gap-6">{skills.map(s=>(<div key={s.name} className="p-6 bg-white/5 rounded-xl"><h3 className="text-xl font-bold text-white mb-3">{s.name}</h3><div className="flex items-center gap-2 mb-2">{Array(5).fill(0).map((_,i)=>(<div key={i} className={`w-8 h-8 rounded ${i<s.level?'bg-purple-600':'bg-white/10'}`}/>))}</div><p className="text-purple-200 text-sm">{s.employees} employees proficient</p></div>))}</div></div></div></div>
  );
}
