import React, { useState } from 'react';
import { X, Plus, Users, Mail, Lock, Trash2, Edit2, Shield, UserCheck, Key, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee' | 'admin';
  department: string;
  phone: string;
  hasLogin: boolean;
  username?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
}

interface EmployeeManagementProps {
  onClose: () => void;
  currentUser: string;
  onAddEmployee?: (employee: Employee) => void;
  onUpdateEmployee?: (employee: Employee) => void;
}

export function EmployeeManagement({ onClose, currentUser, onAddEmployee, onUpdateEmployee }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      role: 'employee',
      department: 'Reception',
      phone: '(555) 123-4567',
      hasLogin: true,
      username: 'sjohnson',
      status: 'active',
      createdAt: new Date(2024, 0, 15),
      lastLogin: new Date()
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.c@company.com',
      role: 'manager',
      department: 'Nursing',
      phone: '(555) 234-5678',
      hasLogin: true,
      username: 'mchen',
      status: 'active',
      createdAt: new Date(2024, 1, 10),
      lastLogin: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@company.com',
      role: 'employee',
      department: 'Retail',
      phone: '(555) 345-6789',
      hasLogin: false,
      status: 'pending',
      createdAt: new Date(),
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    role: 'employee',
    status: 'pending',
    hasLogin: false
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'manager' | 'employee' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  
  const filteredEmployees = employees.filter(emp => {
    const roleMatch = filterRole === 'all' || emp.role === filterRole;
    const statusMatch = filterStatus === 'all' || emp.status === filterStatus;
    return roleMatch && statusMatch;
  });
  
  const generateUsername = (name: string) => {
    const parts = name.toLowerCase().split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1]}` 
      : parts[0];
  };
  
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      return;
    }
    
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role || 'employee',
      department: newEmployee.department,
      phone: newEmployee.phone || '',
      hasLogin: newEmployee.hasLogin || false,
      status: newEmployee.hasLogin ? 'active' : 'pending',
      createdAt: new Date()
    };
    
    if (newEmployee.hasLogin) {
      const username = generateUsername(employee.name);
      const password = generatePassword();
      employee.username = username;
      
      setGeneratedCredentials({ username, password });
      setShowCredentialsModal(true);
    }
    
    setEmployees([employee, ...employees]);
    setShowAddModal(false);
    setNewEmployee({
      role: 'employee',
      status: 'pending',
      hasLogin: false
    });
    
    if (onAddEmployee) {
      onAddEmployee(employee);
    }
  };
  
  const handleCreateLogin = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;
    
    const username = generateUsername(employee.name);
    const password = generatePassword();
    
    setEmployees(employees.map(e => 
      e.id === employeeId 
        ? { ...e, hasLogin: true, username, status: 'active' }
        : e
    ));
    
    setGeneratedCredentials({ username, password });
    setShowCredentialsModal(true);
  };
  
  const handleCopyToClipboard = (text: string, type: 'username' | 'password') => {
    navigator.clipboard.writeText(text);
    if (type === 'username') {
      setCopiedUsername(true);
      setTimeout(() => setCopiedUsername(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };
  
  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return { label: 'Admin', color: 'bg-red-600/20 text-red-300 border-red-500/30' };
      case 'manager': return { label: 'Manager', color: 'bg-purple-600/20 text-purple-300 border-purple-500/30' };
      default: return { label: 'Employee', color: 'bg-blue-600/20 text-blue-300 border-blue-500/30' };
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-600/20 text-green-300 border-green-500/30' };
      case 'pending': return { label: 'Pending', color: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' };
      default: return { label: 'Inactive', color: 'bg-gray-600/20 text-gray-300 border-gray-500/30' };
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden border-2 border-cyan-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 flex items-center justify-between border-b-2 border-cyan-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Users className="w-8 h-8" />
              Employee Management
            </h2>
            <p className="text-cyan-100 text-sm mt-1 font-semibold">
              Add employees, assign logins, and manage user accounts
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30">
              <Users className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">{employees.length}</div>
              <div className="text-sm text-blue-100 font-bold">Total Employees</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400/30">
              <UserCheck className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">
                {employees.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-green-100 font-bold">Active Users</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl p-6 border-2 border-yellow-400/30">
              <Lock className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">
                {employees.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-100 font-bold">Pending Setup</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 border-2 border-purple-400/30">
              <Shield className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">
                {employees.filter(e => e.role === 'manager' || e.role === 'admin').length}
              </div>
              <div className="text-sm text-purple-100 font-bold">Managers/Admins</div>
            </div>
          </div>
          
          {/* Filters & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Roles</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
          
          {/* Employee Table */}
          <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600">
                  <th className="text-left py-4 px-4 text-sm font-black text-white">Employee</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-white">Contact</th>
                  <th className="text-center py-4 px-4 text-sm font-black text-white">Role</th>
                  <th className="text-center py-4 px-4 text-sm font-black text-white">Department</th>
                  <th className="text-center py-4 px-4 text-sm font-black text-white">Login Status</th>
                  <th className="text-center py-4 px-4 text-sm font-black text-white">Status</th>
                  <th className="text-center py-4 px-4 text-sm font-black text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const roleBadge = getRoleBadge(emp.role);
                  const statusBadge = getStatusBadge(emp.status);
                  
                  return (
                    <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white">{emp.name}</div>
                            {emp.username && (
                              <div className="text-xs text-slate-400">@{emp.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-300">{emp.email}</div>
                        <div className="text-xs text-slate-500">{emp.phone}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${roleBadge.color}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-bold text-white">{emp.department}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {emp.hasLogin ? (
                          <div className="flex items-center justify-center gap-2">
                            <Key className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-bold text-green-400">Enabled</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCreateLogin(emp.id)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg text-xs transition-all"
                          >
                            Create Login
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors text-blue-400"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-cyan-500/50">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Plus className="w-7 h-7" />
              Add New Employee
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newEmployee.name || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="john.doe@company.com"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newEmployee.phone || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Department *</label>
                  <input
                    type="text"
                    value={newEmployee.department || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    placeholder="Reception, Nursing, etc."
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Role</label>
                <select
                  value={newEmployee.role || 'employee'}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as any })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <input
                  type="checkbox"
                  checked={newEmployee.hasLogin || false}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hasLogin: e.target.checked })}
                  className="w-5 h-5 rounded mt-0.5 accent-cyan-600"
                />
                <div>
                  <span className="font-bold text-white block mb-1">Create login credentials</span>
                  <span className="text-sm text-slate-400">
                    Generate username and password for this employee to access the system
                  </span>
                </div>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEmployee({ role: 'employee', status: 'pending', hasLogin: false });
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                disabled={!newEmployee.name || !newEmployee.email || !newEmployee.department}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all disabled:opacity-50"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Credentials Modal */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border-2 border-green-500/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Login Created!</h3>
              <p className="text-slate-400 text-sm">
                Save these credentials securely. They won't be shown again.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <label className="text-xs font-bold text-slate-400 block mb-2">USERNAME</label>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-lg font-mono text-white">{generatedCredentials.username}</code>
                  <button
                    onClick={() => handleCopyToClipboard(generatedCredentials.username, 'username')}
                    className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors text-blue-400"
                  >
                    {copiedUsername ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <label className="text-xs font-bold text-slate-400 block mb-2">PASSWORD</label>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-lg font-mono text-white">
                    {showPassword ? generatedCredentials.password : '••••••••••••'}
                  </code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors text-purple-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(generatedCredentials.password, 'password')}
                      className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors text-blue-400"
                    >
                      {copiedPassword ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-200 font-semibold">
                ⚠️ Make sure to send these credentials to the employee via secure channel (email, text, or in person).
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowCredentialsModal(false);
                setGeneratedCredentials(null);
                setShowPassword(false);
                setCopiedUsername(false);
                setCopiedPassword(false);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
