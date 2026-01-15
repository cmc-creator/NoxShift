import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SimpleLanding() {
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
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"></div>
          <span className="text-2xl font-bold text-white">NOXSHIFT™</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowVipModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            VIP Access
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div className="text-center px-6">
          <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
            NOXSHIFT™
          </h1>
          <p className="text-3xl text-gray-300 mb-4">
            The Ultimate Employee Scheduler
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Part of the Nox Product Line - Powerful. Intuitive. Unstoppable.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">VIP Access</h3>
            <p className="text-gray-300 mb-6">
              Enter your exclusive VIP code to unlock premium features.
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
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
