import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  hourlyRate?: number;
  status: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await employeeAPI.getAll();
      setEmployees(response.employees || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      setError('');
      setSuccess('');
      
      // Example: Add a test employee
      await employeeAPI.create({
        firstName: 'Test',
        lastName: 'Employee',
        email: `test${Date.now()}@example.com`,
        phone: '555-0100',
        position: 'Staff',
        department: 'Operations',
        hourlyRate: 25.0,
        maxHoursPerWeek: 40,
        status: 'ACTIVE',
      });
      
      setSuccess('Employee added successfully!');
      loadEmployees();
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Employees (Real Data!)</h2>
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
        >
          + Add Test Employee
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {employees.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-4">No employees yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">
                {employee.firstName} {employee.lastName}
              </h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>📧 {employee.email}</p>
                {employee.phone && <p>📱 {employee.phone}</p>}
                {employee.position && <p>💼 {employee.position}</p>}
                {employee.department && <p>🏢 {employee.department}</p>}
                {employee.hourlyRate && <p>💰 ${employee.hourlyRate}/hr</p>}
                <p className={`inline-block px-2 py-1 rounded text-xs ${
                  employee.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {employee.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-sm">
          ✅ <strong>Connected to Backend!</strong> This data is coming from your Express API + PostgreSQL database.
        </p>
      </div>
    </div>
  );
}
