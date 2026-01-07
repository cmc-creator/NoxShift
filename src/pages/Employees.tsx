import Sidebar from '../components/Sidebar'

export default function Employees() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Employees</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Employee management coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
