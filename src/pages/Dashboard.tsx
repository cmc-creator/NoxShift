import Sidebar from '../components/Sidebar'
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Total Employees"
              value="124"
              change="+12%"
            />
            <StatCard
              icon={<Calendar className="w-8 h-8 text-green-600" />}
              title="Scheduled Shifts"
              value="456"
              change="+8%"
            />
            <StatCard
              icon={<Clock className="w-8 h-8 text-yellow-600" />}
              title="Hours This Week"
              value="2,340"
              change="+5%"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
              title="Coverage Rate"
              value="98%"
              change="+2%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Shifts</h2>
              <div className="space-y-4">
                <ShiftItem name="John Doe" time="8:00 AM - 4:00 PM" role="Manager" />
                <ShiftItem name="Jane Smith" time="9:00 AM - 5:00 PM" role="Staff" />
                <ShiftItem name="Mike Johnson" time="2:00 PM - 10:00 PM" role="Staff" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                  Create New Schedule
                </button>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                  Add Employee
                </button>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, change }: { icon: React.ReactNode; title: string; value: string; change: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function ShiftItem({ name, time, role }: { name: string; time: string; role: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
      <p className="text-sm text-gray-600">{time}</p>
    </div>
  )
}
