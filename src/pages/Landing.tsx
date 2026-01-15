import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, BarChart3, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">NOXSHIFT™</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowVipModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
            >
              VIP Access
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
              NOXSHIFT™
            </h1>
            <p className="text-3xl text-gray-300 mb-4 font-light">
              The Ultimate Employee Scheduler
            </p>
            <p className="text-lg text-gray-400 mb-12">
              Part of the Nox Product Line - Powerful. Intuitive. Unstoppable.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-white">Platform Overview</h2>
            </div>
            <p className="text-xl text-gray-400">One Scheduler. Complete Control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Smart Scheduling"
              description="AI-powered shift optimization"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Employee Management"
              description="Centralized team oversight"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Time Tracking"
              description="Accurate attendance monitoring"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics"
              description="Real-time insights & reports"
            />
          </div>
        </section>

        {/* Core Features */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h2 className="text-4xl font-bold text-white">Core Features</h2>
            </div>
            <p className="text-xl text-gray-400">Everything You Need to Manage Your Team</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <Feature text="Drag-and-drop shift scheduling" />
            <Feature text="Real-time team communication" />
            <Feature text="Automated notifications and reminders" />
            <Feature text="Mobile-friendly access" />
            <Feature text="Conflict detection and resolution" />
            <Feature text="Customizable shift templates" />
            <Feature text="Advanced reporting and analytics" />
            <Feature text="Integration with payroll systems" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Scheduling?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses using NoxShift to streamline their workforce management.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setShowVipModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all"
              >
                VIP Access
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="text-center text-gray-500">
            <p>&copy; 2026 NoxShift™. Part of the Nox Product Line. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">VIP Access</h3>
            <p className="text-gray-300 mb-6">
              Enter your exclusive VIP code to unlock premium features and early access.
            </p>
            <input
              type="text"
              value={vipCode}
              onChange={(e) => {
                setVipCode(e.target.value);
                setVipError('');
              }}
              placeholder="Enter VIP Code"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleVipAccess()}
            />
            {vipError && (
              <p className="text-red-400 text-sm mb-4">{vipError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleVipAccess}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
              >
                Unlock Access
              </button>
              <button
                onClick={() => {
                  setShowVipModal(false);
                  setVipCode('');
                  setVipError('');
                }}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:text-purple-400 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
      <span className="text-gray-300 text-lg">{text}</span>
    </div>
  );
}
