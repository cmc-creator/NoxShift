import { useNavigate } from 'react-router-dom';

export default function SimpleLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
          NOXSHIFT™
        </h1>
        <p className="text-3xl text-gray-300 mb-12">
          The Ultimate Employee Scheduler
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
