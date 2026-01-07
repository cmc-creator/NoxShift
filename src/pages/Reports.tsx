import Sidebar from '../components/Sidebar'

export default function Reports() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Reports and analytics coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
