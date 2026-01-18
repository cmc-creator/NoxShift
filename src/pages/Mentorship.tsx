import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, UserPlus, Heart } from 'lucide-react';

export default function Mentorship() {
  const matches=[{mentor:'Sarah J.',mentee:'New Hire',status:'Active'},{mentor:'Michael C.',mentee:'Izzy C.',status:'Active'}];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"><div className="bg-white/10 backdrop-blur-xl border-b border-white/20"><div className="max-w-7xl mx-auto px-6 py-4"><div className="flex items-center gap-4"><Link to="/command-center"><Home className="w-5 h-5 text-purple-400" /></Link><div className="h-6 w-px bg-white/20" /><h1 className="text-2xl font-black text-white flex items-center gap-2"><Heart className="w-7 h-7 text-purple-400" />Mentorship Program 🤝</h1></div></div></div><div className="max-w-7xl mx-auto p-6"><div className="grid grid-cols-2 gap-6"><div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"><h2 className="text-xl font-bold text-white mb-4">Active Mentorships</h2><div className="space-y-3">{matches.map((m,i)=>(<div key={i} className="p-4 bg-white/5 rounded-lg"><div className="flex items-center justify-between"><div><div className="text-white font-bold">{m.mentor} → {m.mentee}</div><div className="text-sm text-green-400">{m.status}</div></div></div></div>))}</div></div><div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"><h2 className="text-xl font-bold text-white mb-4">Find a Mentor</h2><button className="w-full p-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold flex items-center justify-center gap-2"><UserPlus className="w-5 h-5"/>Request Mentor</button></div></div></div></div>
  );
}
