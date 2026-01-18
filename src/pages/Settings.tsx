import Sidebar from '../components/Sidebar'

export default function Settings() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
            <p className="text-purple-200">Settings configuration coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
