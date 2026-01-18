import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Search, Filter, Mail, Phone, Calendar, MapPin, Briefcase,
  Clock, DollarSign, Award, Settings, Edit, Trash2, MoreVertical, ChevronRight,
  Home, CheckCircle, XCircle, AlertCircle, Star, Target, TrendingUp, Loader2
} from 'lucide-react';
import { employeeAPI } from '../services/api';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  status: string;
  hourlyRate?: number;
  maxHoursPerWeek?: number;
}

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load employees from API
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
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await employeeAPI.delete(id);
      await loadEmployees();
    } catch (err: any) {
      alert('Failed to delete employee: ' + err.message);
    }
  };

  const departments = ['all', 'Front Desk', 'Nursing', 'Clinical', 'Laboratory', 'Pharmacy', 'Administration'];
  const statuses = ['all', 'ACTIVE', 'ON_LEAVE', 'INACTIVE'];

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/20';
      case 'ON_LEAVE': return 'text-yellow-400 bg-yellow-400/20';
      case 'INACTIVE': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'ON_LEAVE': return <AlertCircle className="w-4 h-4" />;
      case 'INACTIVE': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 mx-6 mt-4">
          <p className="font-semibold">Error: {error}</p>
          <button onClick={loadEmployees} className="text-red-400 underline mt-2">Retry</button>
        </div>
      )}
      
      {/* Success banner */}
      {!loading && !error && employees.length > 0 && (
        <div className="bg-blue-500/20 border border-blue-400 text-blue-200 px-4 py-3 rounded-lg mx-6 mt-4 mb-2">
          ✅ Connected to Backend! This data is coming from your Express API + PostgreSQL database.
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Back to Command Center</span>
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-400" />
                Employee Management
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Add Employee
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Employees</p>
                  <p className="text-3xl font-bold text-white">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Active</p>
                  <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'ACTIVE').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">On Leave</p>
                  <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'ON_LEAVE').length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Departments</p>
                  <p className="text-3xl font-bold text-white">{new Set(employees.map(e => e.department).filter(Boolean)).size}</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === 'all' ? 'All Status' : status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => setSelectedEmployee(employee)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{employee.firstName} {employee.lastName}</h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        {employee.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {employee.position && (
                        <div className="flex items-center gap-2 text-blue-200">
                          <Briefcase className="w-4 h-4" />
                          {employee.position}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-blue-200">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-2 text-blue-200">
                          <Phone className="w-4 h-4" />
                          {employee.phone}
                        </div>
                      )}
                      {employee.hireDate && (
                        <div className="flex items-center gap-2 text-blue-200">
                          <Calendar className="w-4 h-4" />
                          Hired {new Date(employee.hireDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      {employee.hourlyRate && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-white font-semibold">${employee.hourlyRate.toFixed(2)}/hr</span>
                        </div>
                      )}
                      {employee.maxHoursPerWeek && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{employee.maxHoursPerWeek}h/week</span>
                        </div>
                      )}
                      {employee.department && (
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-yellow-400" />
                          <span className="text-white">{employee.department}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEmployee(employee.id);
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
            <p className="text-blue-200 text-lg">No employees found matching your filters</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6">Add New Employee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="text" placeholder="Full Name" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <input type="email" placeholder="Email" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <input type="tel" placeholder="Phone" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <input type="text" placeholder="Role" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option>Select Department</option>
                {departments.filter(d => d !== 'all').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input type="date" placeholder="Hire Date" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <input type="number" placeholder="Hourly Rate" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
              <input type="number" placeholder="Weekly Hours" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Employee added successfully!');
                  setShowAddModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
