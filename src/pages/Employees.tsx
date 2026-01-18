import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Search, Filter, Mail, Phone, Calendar, MapPin, Briefcase,
  Clock, DollarSign, Award, Settings, Edit, Trash2, MoreVertical, ChevronRight,
  Home, CheckCircle, XCircle, AlertCircle, Star, Target, TrendingUp
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  hireDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  hourlyRate: number;
  weeklyHours: number;
  avatar?: string;
  certifications?: string[];
  performanceRating?: number;
}

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Izzy Cooper',
      email: 'izzy@noxshift.com',
      phone: '(555) 123-4567',
      role: 'Reception',
      department: 'Front Desk',
      hireDate: '2025-01-15',
      status: 'active',
      hourlyRate: 18.50,
      weeklyHours: 40,
      certifications: ['CPR', 'First Aid'],
      performanceRating: 4.8
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@noxshift.com',
      phone: '(555) 234-5678',
      role: 'Registered Nurse',
      department: 'Nursing',
      hireDate: '2024-03-10',
      status: 'active',
      hourlyRate: 35.00,
      weeklyHours: 36,
      certifications: ['RN License', 'ACLS', 'PALS'],
      performanceRating: 4.9
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.c@noxshift.com',
      phone: '(555) 345-6789',
      role: 'Medical Assistant',
      department: 'Clinical',
      hireDate: '2024-08-22',
      status: 'active',
      hourlyRate: 22.00,
      weeklyHours: 40,
      certifications: ['CMA', 'BLS'],
      performanceRating: 4.6
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.d@noxshift.com',
      phone: '(555) 456-7890',
      role: 'Lab Technician',
      department: 'Laboratory',
      hireDate: '2023-11-05',
      status: 'on-leave',
      hourlyRate: 28.50,
      weeklyHours: 40,
      certifications: ['MLT', 'Phlebotomy'],
      performanceRating: 4.7
    },
    {
      id: '5',
      name: 'James Wilson',
      email: 'james.w@noxshift.com',
      phone: '(555) 567-8901',
      role: 'Pharmacy Tech',
      department: 'Pharmacy',
      hireDate: '2024-06-18',
      status: 'active',
      hourlyRate: 24.00,
      weeklyHours: 32,
      certifications: ['CPhT', 'PTCB'],
      performanceRating: 4.5
    }
  ]);

  const departments = ['all', 'Front Desk', 'Nursing', 'Clinical', 'Laboratory', 'Pharmacy', 'Administration'];
  const statuses = ['all', 'active', 'on-leave', 'inactive'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'on-leave': return 'text-yellow-400 bg-yellow-400/20';
      case 'inactive': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'on-leave': return <AlertCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
                  <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'active').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">On Leave</p>
                  <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'on-leave').length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">4.7</p>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
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
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Briefcase className="w-4 h-4" />
                        {employee.role}
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Phone className="w-4 h-4" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Calendar className="w-4 h-4" />
                        Hired {employee.hireDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">${employee.hourlyRate}/hr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-white">{employee.weeklyHours}h/week</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{employee.department}</span>
                      </div>
                      {employee.performanceRating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-semibold">{employee.performanceRating}/5.0</span>
                        </div>
                      )}
                    </div>
                    {employee.certifications && employee.certifications.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <div className="flex gap-2 flex-wrap">
                          {employee.certifications.map(cert => (
                            <span key={cert} className="px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded text-xs font-semibold">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-white" />
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
