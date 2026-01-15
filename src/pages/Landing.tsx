import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, BarChart3, ArrowRight, CheckCircle2, Sparkles, Zap, Shield, TrendingUp, Bell, DollarSign, Award } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [vipError, setVipError] = useState('');

  const handleVipAccess = () => {
    if (vipCode.toUpperCase() === 'NOX424') {
      localStorage.setItem('noxshift-vip', 'true');
      navigate('/login');
    } else {
      setVipError('Invalid VIP code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="relative z-10">
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">NOXSHIFT™</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowVipModal(true)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">🔑 VIP Access</button>
              <button onClick={() => navigate('/login')} className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white font-bold rounded-lg hover:bg-white/20 border-2 border-white/20 transition-all">Sign In</button>
            </div>
          </div>
        </header>
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-semibold">Part of the NOX Product Line</span>
            </div>
            <h1 className="text-8xl font-black text-white mb-8 leading-none">Schedule Smarter.<br/><span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Work Better.</span></h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">The ultimate employee scheduling platform powered by AI. Manage shifts, track time, and optimize your workforce—all in one powerful dashboard.</p>
            <div className="flex gap-4 justify-center mb-16">
              <button onClick={() => navigate('/login')} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3">Get Started Free<ArrowRight className="w-6 h-6" /></button>
              <button onClick={() => setShowVipModal(true)} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"><Zap className="w-6 h-6" />VIP Early Access</button>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"><div className="text-4xl font-black text-white mb-2">500+</div><div className="text-gray-400">Companies</div></div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"><div className="text-4xl font-black text-white mb-2">10K+</div><div className="text-gray-400">Employees</div></div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"><div className="text-4xl font-black text-white mb-2">99.9%</div><div className="text-gray-400">Uptime</div></div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16"><h2 className="text-5xl font-black text-white mb-4">Everything You Need</h2><p className="text-xl text-gray-400">Powerful features for modern teams</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <FeatureCard icon={<Calendar className="w-10 h-10" />} title="Smart Scheduling" description="AI-powered shift optimization" gradient="from-purple-500/20 to-purple-600/20" />
            <FeatureCard icon={<Users className="w-10 h-10" />} title="Team Management" description="Complete employee oversight" gradient="from-blue-500/20 to-blue-600/20" />
            <FeatureCard icon={<Clock className="w-10 h-10" />} title="Time Tracking" description="Automated timesheets" gradient="from-pink-500/20 to-pink-600/20" />
            <FeatureCard icon={<BarChart3 className="w-10 h-10" />} title="Analytics" description="Real-time dashboards" gradient="from-indigo-500/20 to-indigo-600/20" />
            <FeatureCard icon={<Bell className="w-10 h-10" />} title="Notifications" description="Automated alerts" gradient="from-green-500/20 to-green-600/20" />
            <FeatureCard icon={<DollarSign className="w-10 h-10" />} title="Payroll" description="Seamless integration" gradient="from-yellow-500/20 to-yellow-600/20" />
            <FeatureCard icon={<Shield className="w-10 h-10" />} title="Security" description="Enterprise-grade" gradient="from-red-500/20 to-red-600/20" />
            <FeatureCard icon={<TrendingUp className="w-10 h-10" />} title="Performance" description="Track efficiency" gradient="from-cyan-500/20 to-cyan-600/20" />
          </div>
        </section>
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center relative overflow-hidden">
              <Award className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h2 className="text-5xl font-black text-white mb-6">Ready to Transform Your Scheduling?</h2>
              <p className="text-xl text-gray-300 mb-10">Start your free trial today. No credit card required.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => navigate('/login')} className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all">Start Free Trial</button>
                <button onClick={() => setShowVipModal(true)} className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all">Get VIP Access</button>
              </div>
            </div>
          </div>
        </section>
        <footer className="container mx-auto px-6 py-12 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-black text-white">NOXSHIFT™</span>
            </div>
            <p className="text-gray-500">&copy; 2026 NOXSHIFT™. Part of the Nox Product Line.</p>
          </div>
        </footer>
      </div>
      {showVipModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowVipModal(false)}>
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border-2 border-amber-500/50 rounded-3xl p-10 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-8 h-8 text-white" /></div>
              <h3 className="text-3xl font-black text-white mb-2">VIP Access</h3>
              <p className="text-gray-300">Enter your exclusive code</p>
            </div>
            <input type="text" value={vipCode} onChange={(e) => { setVipCode(e.target.value); setVipError(''); }} placeholder="Enter VIP Code" className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4" onKeyPress={(e) => e.key === 'Enter' && handleVipAccess()} />
            {vipError && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"><p className="text-red-400 text-sm font-semibold">{vipError}</p></div>}
            <div className="flex gap-3">
              <button onClick={handleVipAccess} className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all">Unlock</button>
              <button onClick={() => { setShowVipModal(false); setVipCode(''); setVipError(''); }} className="px-6 py-4 bg-white/10 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 hover:scale-105 transition-all group cursor-pointer`}>
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white/20 group-hover:scale-110 transition-all">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
